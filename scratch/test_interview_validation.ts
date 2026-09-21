import "dotenv/config";
import prisma from "../src/lib/prisma";
import { InterviewService } from "../src/services/interview.service";
import { evaluateInterviewAnswerWithGemini } from "../src/lib/gemini";
import { InterviewQuestion } from "../src/types/interview";

interface TestReport {
  name: string;
  category: string;
  passed: boolean;
  expected: string;
  actual: string;
  details?: string;
}

const reports: TestReport[] = [];

function recordTest(
  name: string,
  category: string,
  passed: boolean,
  expected: string,
  actual: string,
  details?: string
) {
  reports.push({ name, category, passed, expected, actual, details });
  const icon = passed ? "✅ PASS" : "❌ FAIL";
  console.log(`${icon}: [${category}] ${name}`);
  if (!passed) {
    console.log(`   Expected: ${expected}`);
    console.log(`   Actual:   ${actual}`);
    if (details) console.log(`   Details:  ${details}`);
  }
}

async function runTestSuite() {
  console.log("\n=======================================================");
  console.log("🧪 RUNNING MOCK INTERVIEW ANSWER EVALUATION TEST SUITE");
  console.log("=======================================================\n");

  const sampleTechnicalQuestion: InterviewQuestion = {
    id: "q_react_1",
    question: "What is React and why do we use it?",
    category: "technical",
    expectedKeywords: ["Virtual DOM", "Component-Based", "Declarative UI", "State Management", "SPA"],
    sampleAnswer: "React is a declarative JavaScript library for building component-based user interfaces with efficient Virtual DOM reconciliation.",
  };

  const sampleExperienceQuestion: InterviewQuestion = {
    id: "q_react_exp",
    question: "Are you familiar with React and modern frontend development?",
    category: "technical",
    expectedKeywords: ["React", "JavaScript", "Frontend", "Components"],
    sampleAnswer: "Yes, I have worked with React, hooks, and modern frontend tools for multiple production projects.",
  };

  const sampleBehavioralQuestion: InterviewQuestion = {
    id: "q_bug_star",
    question: "Describe a time when you resolved a high-severity production bug under a tight deadline.",
    category: "behavioral",
    expectedKeywords: ["STAR Framework", "Root Cause Analysis", "Monitoring", "Rollback", "Post-Mortem"],
    sampleAnswer: "During a peak flash sale (Situation), our authentication API had a memory leak (Task). I profiled heap allocations, identified unclosed WebSocket listeners, and deployed a targeted patch in 20 minutes (Action). This restored 100% uptime and reduced p99 latency to 45ms (Result).",
  };

  // ─────────────────────────────────────────────────────────────────────────────
  // 1. UNIT EVALUATION TESTS
  // ─────────────────────────────────────────────────────────────────────────────

  // Test 1: Valid Technical Answer
  const validTechAnswer =
    "React is a declarative, component-based JavaScript library designed for creating dynamic user interfaces. We use it because its Virtual DOM algorithm minimizes expensive real DOM manipulations, and its reusable component structure accelerates development velocity.";
  const techEval = await evaluateInterviewAnswerWithGemini({
    question: sampleTechnicalQuestion,
    userAnswer: validTechAnswer,
    role: "Frontend Engineer",
    difficulty: "senior",
    interviewType: "technical",
  });

  recordTest(
    "Valid Technical Answer",
    "Valid Answer",
    techEval.isValidAnswer === true && techEval.score >= 65 && techEval.strengths.length > 0,
    "isValidAnswer: true, score >= 65, strengths > 0",
    `isValidAnswer: ${techEval.isValidAnswer}, score: ${techEval.score}, strengths: ${techEval.strengths.length}`
  );

  // Test 2: Valid Short Answer
  const validShortAnswer = "Yes, I have used React for about one year in my web development projects.";
  const shortEval = await evaluateInterviewAnswerWithGemini({
    question: sampleExperienceQuestion,
    userAnswer: validShortAnswer,
    role: "Frontend Engineer",
    difficulty: "junior",
    interviewType: "technical",
  });

  recordTest(
    "Valid Short Answer (Direct & Affirmative)",
    "Valid Answer",
    shortEval.isValidAnswer === true && shortEval.score >= 50,
    "isValidAnswer: true, score >= 50",
    `isValidAnswer: ${shortEval.isValidAnswer}, score: ${shortEval.score}`
  );

  // Test 3: Abusive Answer ("fuck you")
  const abusiveAnswer = "fuck you";
  const abusiveEval = await evaluateInterviewAnswerWithGemini({
    question: sampleTechnicalQuestion,
    userAnswer: abusiveAnswer,
    role: "Frontend Engineer",
    difficulty: "senior",
    interviewType: "technical",
  });

  recordTest(
    "Abusive Answer Rejection",
    "Abusive / Offensive",
    abusiveEval.isValidAnswer === false && abusiveEval.score === 0 && abusiveEval.strengths.length === 0,
    "isValidAnswer: false, score: 0, strengths: 0",
    `isValidAnswer: ${abusiveEval.isValidAnswer}, score: ${abusiveEval.score}, strengths: ${abusiveEval.strengths.length}, msg: "${abusiveEval.validationMessage}"`
  );

  // Test 4: Random Gibberish ("asdfgh 123 !!!")
  const gibberishAnswer = "asdfgh 123 !!!";
  const gibberishEval = await evaluateInterviewAnswerWithGemini({
    question: sampleTechnicalQuestion,
    userAnswer: gibberishAnswer,
    role: "Frontend Engineer",
    difficulty: "senior",
    interviewType: "technical",
  });

  recordTest(
    "Random Gibberish Rejection",
    "Gibberish / Meaningless",
    gibberishEval.isValidAnswer === false && gibberishEval.score === 0 && gibberishEval.strengths.length === 0,
    "isValidAnswer: false, score: 0, strengths: 0",
    `isValidAnswer: ${gibberishEval.isValidAnswer}, score: ${gibberishEval.score}, strengths: ${gibberishEval.strengths.length}`
  );

  // Test 5: Meaningful but Completely Irrelevant Answer (Village / Football story for React question)
  const irrelevantAnswer =
    "My village is in Cumilla. I used to play football with my childhood friends every Friday afternoon near the pond.";
  const irrelevantEval = await evaluateInterviewAnswerWithGemini({
    question: sampleTechnicalQuestion,
    userAnswer: irrelevantAnswer,
    role: "Frontend Engineer",
    difficulty: "senior",
    interviewType: "technical",
  });

  recordTest(
    "Meaningful but Irrelevant Answer Rejection",
    "Off-Topic / Irrelevant",
    irrelevantEval.isValidAnswer === false && irrelevantEval.score === 0 && irrelevantEval.strengths.length === 0,
    "isValidAnswer: false, score: 0, strengths: 0",
    `isValidAnswer: ${irrelevantEval.isValidAnswer}, score: ${irrelevantEval.score}, strengths: ${irrelevantEval.strengths.length}, msg: "${irrelevantEval.validationMessage}"`
  );

  // Test 6: "I don't know" Answer
  const idkAnswer = "I don't know";
  const idkEval = await evaluateInterviewAnswerWithGemini({
    question: sampleTechnicalQuestion,
    userAnswer: idkAnswer,
    role: "Frontend Engineer",
    difficulty: "senior",
    interviewType: "technical",
  });

  recordTest(
    "'I don't know' Insufficient Answer (No Artificial Positive Score)",
    "Knowledge Gap",
    idkEval.isValidAnswer === true && idkEval.score <= 10,
    "isValidAnswer: true, score <= 10",
    `isValidAnswer: ${idkEval.isValidAnswer}, score: ${idkEval.score}`
  );

  // Test 7: Long Relevant Behavioral Answer (With STAR Method Check)
  const longBehavioralAnswer =
    "[Situation]: During black friday traffic, our payment processing service began throwing 504 timeouts on 15% of transactions. [Task]: As lead on-call engineer, my responsibility was to immediately triage and restore checkout velocity. [Action]: I inspected Prometheus metrics, noticed connection pool saturation on PostgreSQL, enabled temporary connection pooling with PgBouncer, and restarted the degraded workers. [Result]: Checkout failure dropped to 0% within 8 minutes, saving an estimated $200k in lost carts.";
  const behavioralEval = await evaluateInterviewAnswerWithGemini({
    question: sampleBehavioralQuestion,
    userAnswer: longBehavioralAnswer,
    role: "Staff Backend Engineer",
    difficulty: "senior",
    interviewType: "behavioral",
  });

  recordTest(
    "Long Relevant Behavioral Answer with STAR Evaluation",
    "Behavioral STAR",
    behavioralEval.isValidAnswer === true &&
      behavioralEval.score >= 80 &&
      behavioralEval.starCompliance !== undefined,
    "isValidAnswer: true, score >= 80, starCompliance defined",
    `isValidAnswer: ${behavioralEval.isValidAnswer}, score: ${behavioralEval.score}, hasSTAR: ${Boolean(behavioralEval.starCompliance)}`
  );

  // Test 8: Technical Question Does NOT Force STAR Structure
  recordTest(
    "Technical Question Does Not Require STAR",
    "STAR Discipline",
    techEval.starCompliance === undefined,
    "starCompliance is undefined for technical question",
    `starCompliance: ${JSON.stringify(techEval.starCompliance)}`
  );

  // ─────────────────────────────────────────────────────────────────────────────
  // 2. END-TO-END SERVICE & DATABASE PERSISTENCE TESTS
  // ─────────────────────────────────────────────────────────────────────────────

  console.log("\n--- Testing InterviewService.evaluateAnswer Pipeline & DB Persistence ---");
  const testUserId = `test-user-int-val-${Date.now()}`;

  try {
    // 1. Create test user and session in PostgreSQL
    await prisma.user.create({
      data: {
        id: testUserId,
        email: `val-int-${Date.now()}@example.com`,
        name: "Interview Relevance Tester",
      },
    });

    const session = await prisma.interviewSession.create({
      data: {
        userId: testUserId,
        role: "Senior Full Stack Engineer",
        difficulty: "senior",
        interviewType: "technical",
        status: "IN_PROGRESS",
        totalQuestions: 2,
        questions: {
          create: [
            {
              questionIndex: 0,
              question: sampleTechnicalQuestion.question,
              category: sampleTechnicalQuestion.category,
              expectedKeywords: sampleTechnicalQuestion.expectedKeywords,
            },
            {
              questionIndex: 1,
              question: "Explain database indexing and B-Trees.",
              category: "technical",
              expectedKeywords: ["B-Tree", "Clustered Index", "Lookup", "Query Plan"],
            },
          ],
        },
      },
      include: { questions: true },
    });

    // 2. Evaluate Question 0 with Off-Topic Answer (Village story) -> Score MUST be 0 in DB
    const offTopicResponse = await InterviewService.evaluateAnswer({
      sessionId: session.id,
      questionIndex: 0,
      question: sampleTechnicalQuestion,
      userAnswer: irrelevantAnswer,
      role: "Senior Full Stack Engineer",
      difficulty: "senior",
      interviewType: "technical",
    });

    const dbQ0 = await prisma.interviewQuestion.findFirst({
      where: { sessionId: session.id, questionIndex: 0 },
    });

    recordTest(
      "InterviewService stores score = 0 and no positive strengths for irrelevant answer",
      "E2E Irrelevant DB Flow",
      offTopicResponse.evaluation.isValidAnswer === false &&
        offTopicResponse.evaluation.score === 0 &&
        dbQ0?.score === 0 &&
        dbQ0?.strengths.length === 0,
      "isValidAnswer: false, DB score: 0, strengths: 0",
      `isValidAnswer: ${offTopicResponse.evaluation.isValidAnswer}, DB score: ${dbQ0?.score}, DB strengths: ${dbQ0?.strengths.length}`
    );

    // 3. Evaluate Question 1 with Valid Technical Answer -> Score MUST be >= 65 in DB
    const validResponse = await InterviewService.evaluateAnswer({
      sessionId: session.id,
      questionIndex: 1,
      question: {
        id: "q_db_idx",
        question: "Explain database indexing and B-Trees.",
        category: "technical",
        expectedKeywords: ["B-Tree", "Clustered Index", "Lookup", "Query Plan"],
      },
      userAnswer:
        "Database indexes use balanced B-Tree search trees to reduce record lookup time from O(N) linear table scans to O(log N). Clustered indexes dictate the physical row sorting on disk, while secondary indexes point to clustered keys.",
      role: "Senior Full Stack Engineer",
      difficulty: "senior",
      interviewType: "technical",
    });

    const dbQ1 = await prisma.interviewQuestion.findFirst({
      where: { sessionId: session.id, questionIndex: 1 },
    });

    recordTest(
      "InterviewService stores positive score and strengths for valid technical answer",
      "E2E Valid DB Flow",
      validResponse.evaluation.isValidAnswer === true &&
        (dbQ1?.score || 0) >= 65 &&
        (dbQ1?.strengths.length || 0) > 0,
      "isValidAnswer: true, DB score >= 65, strengths > 0",
      `isValidAnswer: ${validResponse.evaluation.isValidAnswer}, DB score: ${dbQ1?.score}, DB strengths: ${dbQ1?.strengths.length}`
    );
  } finally {
    // Cleanup test data
    await prisma.interviewQuestion.deleteMany({
      where: { session: { userId: testUserId } },
    });
    await prisma.interviewSession.deleteMany({
      where: { userId: testUserId },
    });
    await prisma.user.deleteMany({
      where: { id: testUserId },
    });
    await prisma.$disconnect();
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // FINAL SUMMARY
  // ─────────────────────────────────────────────────────────────────────────────
  const total = reports.length;
  const passedCount = reports.filter((r) => r.passed).length;
  const failedCount = total - passedCount;

  console.log("\n=======================================================");
  console.log(`📊 TEST SUITE COMPLETE: ${passedCount}/${total} PASSED`);
  if (failedCount === 0) {
    console.log("🎉 ALL MOCK INTERVIEW VALIDATION & RELEVANCE TESTS PASSED!");
  } else {
    console.log(`⚠️ ${failedCount} TESTS FAILED`);
  }
  console.log("=======================================================\n");

  if (failedCount > 0) {
    process.exit(1);
  }
}

runTestSuite();
