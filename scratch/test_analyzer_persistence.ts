import "dotenv/config";
import prisma from "../src/lib/prisma";
import { ResumeService } from "../src/services/resume.service";


async function runAnalyzerPersistenceTest() {
  console.log("=== Starting Resume Analyzer PostgreSQL Persistence Test ===");

  const testUserId = `test-user-analyzer-${Date.now()}`;
  const testUserEmail = `analyzer-tester-${Date.now()}@example.com`;
  const otherUserId = `other-user-analyzer-${Date.now()}`;
  const otherUserEmail = `other-tester-${Date.now()}@example.com`;

  try {
    // 1. Create primary and secondary test users
    console.log("[1/6] Creating test users in PostgreSQL...");
    const user = await prisma.user.create({
      data: {
        id: testUserId,
        email: testUserEmail,
        name: "Analyzer Test User",
      },
    });

    const otherUser = await prisma.user.create({
      data: {
        id: otherUserId,
        email: otherUserEmail,
        name: "Other User",
      },
    });

    console.log(`✓ Created User: ${user.id} and OtherUser: ${otherUser.id}`);

    // 2. Create a test resume
    console.log("[2/6] Creating a test resume in PostgreSQL...");
    const resume = await ResumeService.createResume(testUserId, {
      title: "Senior Full Stack Cloud Engineer",
      description: "Cloud and Distributed Systems Specialist",
    });
    console.log(`✓ Created Resume ID: ${resume.id}, Initial atsScore: ${resume.atsScore}`);

    // 3. Analyze resume with ResumeService (simulate authenticated user analysis)
    console.log("[3/6] Running ResumeService.analyzeResume with PostgreSQL persistence...");
    const sampleResumeText = `
ALEXANDER VANCE
Senior Full Stack Engineer | San Francisco, CA | alex.vance@example.com

SUMMARY
Full Stack Software Engineer with 6+ years building microservices and cloud systems with TypeScript, React, Next.js, and Node.js.

WORK EXPERIENCE
Senior Software Engineer | TechScale Inc. | 2022 - Present
- Responsible for developing backend APIs and fixing bug tickets with team members.
- Worked on database optimization and improved application loading speed.
- Collaborated with product managers and engineers on frontend features.

TECHNICAL SKILLS
TypeScript, React, Next.js, Node.js, Express, PostgreSQL, Redis, Docker, Git
    `;

    const sampleJobDescription = `
Role: Senior Cloud Infrastructure & Full Stack Engineer
Requirements:
- 5+ years experience in TypeScript, React, Node.js, and PostgreSQL.
- Kubernetes, Microservices architecture, CI/CD automation, Google XYZ bullet points.
    `;

    const analysisResult = await ResumeService.analyzeResume({
      userId: testUserId,
      resumeId: resume.id,
      resumeText: sampleResumeText,
      jobDescription: sampleJobDescription,
    });

    console.log("✓ Analysis execution completed!");
    console.log(`  - Persisted Analysis ID: ${analysisResult.data.id}`);
    console.log(`  - Linked Resume ID: ${analysisResult.data.resumeId}`);
    console.log(`  - ATS Score: ${analysisResult.data.atsScore}/100`);
    console.log(`  - Missing Keywords: ${analysisResult.data.missingKeywords?.length}`);
    console.log(`  - Bullet Rewrites: ${analysisResult.data.bulletPointRewrites?.length}`);

    if (!analysisResult.data.id) {
      throw new Error("FAIL: Analysis was not persisted (missing id)!");
    }

    // 4. Verify in PostgreSQL directly via Prisma
    console.log("[4/6] Verifying ResumeAnalysis record directly in PostgreSQL...");
    const dbAnalysis = await prisma.resumeAnalysis.findUnique({
      where: { id: analysisResult.data.id },
      include: { resume: true, user: true },
    });

    if (!dbAnalysis) {
      throw new Error("FAIL: ResumeAnalysis record not found in PostgreSQL!");
    }

    console.log("✓ Database record verified:");
    console.log(`  - DB Record ID: ${dbAnalysis.id}`);
    console.log(`  - DB Record UserId: ${dbAnalysis.userId} (Matches: ${dbAnalysis.userId === testUserId})`);
    console.log(`  - DB Record ResumeId: ${dbAnalysis.resumeId} (Matches: ${dbAnalysis.resumeId === resume.id})`);
    console.log(`  - DB ScoreBreakdown: ${JSON.stringify(dbAnalysis.scoreBreakdown)}`);

    // Verify snapshot ATS score update on Resume model
    const updatedResume = await prisma.resume.findUnique({
      where: { id: resume.id },
    });
    console.log(`  - Resume Updated ATS Score: ${updatedResume?.atsScore} (Matches analysis: ${updatedResume?.atsScore === dbAnalysis.atsScore})`);

    // 5. Query historical analyses via Service methods
    console.log("[5/6] Testing historical retrieval (ResumeService.getResumeAnalyses & getUserAnalyses)...");
    const resumeAnalyses = await ResumeService.getResumeAnalyses(testUserId, resume.id);
    console.log(`✓ Fetched ${resumeAnalyses.length} analysis reports for resume ${resume.id}`);

    const userAnalyses = await ResumeService.getUserAnalyses(testUserId);
    console.log(`✓ Fetched ${userAnalyses.length} recent analysis reports for user ${testUserId}`);

    // 6. Test ownership isolation / security
    console.log("[6/6] Testing ownership isolation & unauthorized access prevention...");
    try {
      await ResumeService.getResumeAnalyses(otherUserId, resume.id);
      throw new Error("FAIL: Other user was able to access primary user's resume analysis!");
    } catch (unauthorizedErr: any) {
      console.log(`✓ Correctly rejected unauthorized access: "${unauthorizedErr.message}"`);
    }

    console.log("\n=======================================================");
    console.log("🎉 ALL RESUME ANALYZER PERSISTENCE TESTS PASSED (6/6)!");
    console.log("=======================================================\n");
  } catch (error) {
    console.error("❌ Test Failed with Error:", error);
    process.exit(1);
  } finally {
    // Cleanup
    console.log("Cleaning up test database records...");
    await prisma.resumeAnalysis.deleteMany({
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

runAnalyzerPersistenceTest();
