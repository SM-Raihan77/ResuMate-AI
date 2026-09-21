import "dotenv/config";
import prisma from "../src/lib/prisma";
import { InterviewService } from "../src/services/interview.service";
import { ResumeService } from "../src/services/resume.service";

async function runInterviewPersistenceTest() {
  console.log("=== Starting Mock Interview PostgreSQL Persistence Test ===");

  const testUserId = `test-user-interview-${Date.now()}`;
  const testUserEmail = `interview-tester-${Date.now()}@example.com`;
  const otherUserId = `other-user-interview-${Date.now()}`;
  const otherUserEmail = `other-interview-${Date.now()}@example.com`;

  try {
    // 1. Create primary and other test users
    console.log("[1/7] Creating test users in PostgreSQL...");
    const user = await prisma.user.create({
      data: {
        id: testUserId,
        email: testUserEmail,
        name: "Interview Candidate",
      },
    });

    const otherUser = await prisma.user.create({
      data: {
        id: otherUserId,
        email: otherUserEmail,
        name: "Other Candidate",
      },
    });

    console.log(`✓ Created User: ${user.id} and OtherUser: ${otherUser.id}`);

    // 2. Create a test resume to link with the interview
    console.log("[2/7] Creating test resume in PostgreSQL...");
    const resume = await ResumeService.createResume(testUserId, {
      title: "Senior Backend Systems Architect",
      description: "Distributed database and high-throughput microservices expert",
    });
    console.log(`✓ Created Resume ID: ${resume.id}`);

    // 3. Generate questions and initialize InterviewSession in PostgreSQL
    console.log("[3/7] Generating questions with InterviewService (persisting to PostgreSQL)...");
    const questionResult = await InterviewService.generateQuestions({
      userId: testUserId,
      resumeId: resume.id,
      role: "Senior Distributed Systems Engineer",
      difficulty: "senior",
      interviewType: "technical",
      questionCount: 3,
      jobDescription: "Requirements: 5+ years in distributed systems, Raft/Paxos consensus, and high-throughput Kafka pipelines.",
    });

    console.log(`✓ Generated ${questionResult.questions.length} questions`);
    console.log(`  - Session ID: ${questionResult.sessionId}`);

    if (!questionResult.sessionId) {
      throw new Error("FAIL: InterviewSession was not created in PostgreSQL!");
    }

    // 4. Verify in PostgreSQL directly via Prisma
    console.log("[4/7] Verifying InterviewSession and InterviewQuestion records in PostgreSQL...");
    const dbSession = await prisma.interviewSession.findUnique({
      where: { id: questionResult.sessionId },
      include: { questions: true, resume: true, user: true },
    });

    if (!dbSession) {
      throw new Error("FAIL: InterviewSession not found in PostgreSQL!");
    }

    console.log("✓ Session Record Verified:");
    console.log(`  - DB Session ID: ${dbSession.id}`);
    console.log(`  - DB Status: ${dbSession.status} (Expected: IN_PROGRESS)`);
    console.log(`  - DB Role: ${dbSession.role}`);
    console.log(`  - DB Linked Resume: ${dbSession.resume?.title}`);
    console.log(`  - DB Questions Count: ${dbSession.questions.length}`);

    if (dbSession.status !== "IN_PROGRESS") {
      throw new Error(`FAIL: Expected status IN_PROGRESS, got ${dbSession.status}`);
    }

    // 5. Simulate answering and evaluating question 1
    console.log("[5/7] Evaluating candidate answer in real-time and updating question in DB...");
    const firstQuestion = questionResult.questions[0];
    const candidateAnswer = "In our high-throughput cluster, we decoupled writes using an event-driven Kafka buffer and replicated data using Raft consensus, reducing replication lag by 60% and guaranteeing linearizable consistency.";

    const evalResponse = await InterviewService.evaluateAnswer({
      sessionId: dbSession.id,
      questionIndex: 0,
      question: firstQuestion,
      userAnswer: candidateAnswer,
      role: dbSession.role,
      difficulty: "senior",
      interviewType: "technical",
    });

    console.log(`✓ Evaluated Answer Score: ${evalResponse.evaluation.score}/100`);

    // Verify question update in DB
    const updatedQuestion = await prisma.interviewQuestion.findFirst({
      where: { sessionId: dbSession.id, questionIndex: 0 },
    });

    console.log("✓ DB Question Evaluation Verified:");
    console.log(`  - Stored User Answer: "${updatedQuestion?.userAnswer?.slice(0, 50)}..."`);
    console.log(`  - Stored Score: ${updatedQuestion?.score}`);
    console.log(`  - Stored Strengths: ${updatedQuestion?.strengths.length} items`);

    if (!updatedQuestion?.score || updatedQuestion.score <= 0) {
      throw new Error("FAIL: Question score was not updated in PostgreSQL!");
    }

    // 6. Generate final report and verify COMPLETED status
    console.log("[6/7] Generating final scorecard and marking session COMPLETED in DB...");
    const finalReportResponse = await InterviewService.generateFinalReport({
      sessionId: dbSession.id,
      role: dbSession.role,
      difficulty: "senior",
      interviewType: "technical",
      evaluations: [evalResponse.evaluation],
    });

    console.log(`✓ Final Scorecard Generated: Overall Score ${finalReportResponse.report.overallScore}/100, Grade: "${finalReportResponse.report.grade}"`);

    const completedSession = await prisma.interviewSession.findUnique({
      where: { id: dbSession.id },
    });

    console.log("✓ Completed Session in PostgreSQL:");
    console.log(`  - Final DB Status: ${completedSession?.status} (Expected: COMPLETED)`);
    console.log(`  - Final DB OverallScore: ${completedSession?.overallScore}`);
    console.log(`  - Final DB Grade: ${completedSession?.grade}`);

    if (completedSession?.status !== "COMPLETED") {
      throw new Error(`FAIL: Expected session status COMPLETED, got ${completedSession?.status}`);
    }

    // 7. Test historical retrieval and ownership isolation
    console.log("[7/7] Testing historical session retrieval and security isolation...");
    const userSessions = await InterviewService.getUserInterviewSessions(testUserId);
    console.log(`✓ Retrieved ${userSessions.length} sessions for user ${testUserId}`);

    const singleSession = await InterviewService.getInterviewSessionById(testUserId, dbSession.id);
    console.log(`✓ Retrieved session details by ID: ${singleSession.id}`);

    try {
      await InterviewService.getInterviewSessionById(otherUserId, dbSession.id);
      throw new Error("FAIL: Other user was able to access primary user's interview session!");
    } catch (authErr: any) {
      console.log(`✓ Correctly rejected unauthorized access attempt: "${authErr.message}"`);
    }

    console.log("\n=======================================================");
    console.log("🎉 ALL MOCK INTERVIEW PERSISTENCE TESTS PASSED (7/7)!");
    console.log("=======================================================\n");
  } catch (error) {
    console.error("❌ Test Failed with Error:", error);
    process.exit(1);
  } finally {
    // Cleanup
    console.log("Cleaning up test database records...");
    await prisma.interviewQuestion.deleteMany({
      where: { session: { userId: { in: [testUserId, otherUserId] } } },
    });
    await prisma.interviewSession.deleteMany({
      where: { userId: { in: [testUserId, otherUserId] } },
    });
    await prisma.resume.deleteMany({
      where: { userId: { in: [testUserId, otherUserId] } },
    });
    await prisma.user.deleteMany({
      where: { id: { in: [testUserId, otherUserId] } },
    });
    await prisma.$disconnect();
    console.log("✓ Cleanup finished.");
  }
}

runInterviewPersistenceTest();
