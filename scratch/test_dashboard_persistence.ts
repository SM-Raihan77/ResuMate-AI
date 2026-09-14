import "dotenv/config";
import prisma from "../src/lib/prisma";
import { DashboardService } from "../src/services/dashboard.service";

async function main() {
  console.log("🚀 Starting Phase 4: Candidate Dashboard PostgreSQL Data Layer Verification...\n");

  const testUserId = `test-user-dash-${Date.now()}`;
  const testEmail = `test-dashboard-${Date.now()}@resumate-ai.test`;

  try {
    // 1. Create Test Candidate
    const testUser = await prisma.user.create({
      data: {
        id: testUserId,
        name: "Devon Candidate",
        email: testEmail,
        emailVerified: true,
      },
    });
    console.log(`✅ [1/5] Created test candidate: ${testUser.name} (${testUser.id})`);

    // 2. Create Test Cloud Resumes
    const resume1 = await prisma.resume.create({
      data: {
        userId: testUser.id,
        title: "Senior Full Stack Cloud Resume",
        jobTitle: "Senior Staff Engineer",
        atsScore: 92,
        summary: "Specialized in distributed systems, PostgreSQL, and high-throughput microservices.",
        skills: [{ name: "Languages", skills: ["TypeScript", "Go", "Python", "SQL"] }],
        experience: [
          {
            company: "Apex Scale Cloud",
            role: "Senior Systems Architect",
            startDate: "2022",
            current: true,
            highlights: [
              "Architected low-latency distributed event mesh handling 15k RPS.",
              "Reduced DB query p99 latency from 140ms to 18ms.",
            ],
          },
        ],
        education: [
          {
            institution: "Tech University",
            degree: "B.S. Computer Engineering",
            endDate: "2021",
          },
        ],
      },
    });

    const resume2 = await prisma.resume.create({
      data: {
        userId: testUser.id,
        title: "AI & ML Platform Engineer Resume",
        jobTitle: "Lead AI Engineer",
        atsScore: 84,
        summary: "Lead Engineer deploying scalable LLM pipelines.",
      },
    });
    console.log(`✅ [2/5] Created 2 cloud resumes (ATS Scores: 92, 84).`);

    // 3. Create Test Resume Analysis Record
    const analysis = await prisma.resumeAnalysis.create({
      data: {
        userId: testUser.id,
        resumeId: resume1.id,
        targetRoleIdentified: "Staff Backend Engineer",
        atsScore: 92,
        matchedKeywords: ["PostgreSQL", "TypeScript", "Microservices", "Distributed Systems"],
        missingKeywords: ["Kafka", "eBPF"],
        scoreBreakdown: {
          keywordMatch: 95,
          formattingQuality: 90,
          experienceRelevance: 91,
        },
        formattingIssues: [],
        bulletPointRewrites: [
          {
            original: "Built APIs for the application.",
            improved: "Architected low-latency gRPC APIs handling 25k RPS with sub-15ms p99 latency.",
            impactAnalysis: "Quantified throughput and latency.",
          },
        ],
      },
    });
    console.log(`✅ [3/5] Created Resume Analysis record (ATS: ${analysis.atsScore}/100).`);

    // 4. Create Test Mock Interview Sessions (1 Completed, 1 In Progress)
    const completedSession = await prisma.interviewSession.create({
      data: {
        userId: testUser.id,
        resumeId: resume1.id,
        role: "Senior Distributed Systems Engineer",
        interviewType: "technical",
        difficulty: "senior",
        status: "COMPLETED",
        totalQuestions: 3,
        overallScore: 88,
        grade: "Senior Hire",
        categoryScores: {
          technicalProficiency: 90,
          communicationClarity: 86,
          problemSolving: 88,
          cultureAndSTAR: 88,
        },
        keyStrengths: [
          "Demonstrated deep understanding of distributed transactions and 2PC.",
          "Clear explanation of database replication lag and trade-offs.",
        ],
        criticalImprovements: [
          "Quantify the exact dollar cost savings of caching optimizations.",
        ],
        questions: {
          create: [
            {
              questionIndex: 0,
              question: "How do you handle distributed locking in high concurrency systems?",
              userAnswer: "I implement Redis Redlock with fencing tokens to prevent split-brain conditions.",
              score: 90,
              strengths: ["Excellent mention of fencing tokens and distributed locking strategy."],
              weaknesses: [],
            },
          ],
        },
      },
    });

    const inProgressSession = await prisma.interviewSession.create({
      data: {
        userId: testUser.id,
        role: "System Architecture Simulation",
        interviewType: "system-design",
        difficulty: "senior",
        status: "IN_PROGRESS",
        totalQuestions: 4,
      },
    });
    console.log(`✅ [4/5] Created interview sessions (1 COMPLETED score: 88%, 1 IN_PROGRESS).`);

    // 5. Test DashboardService Aggregation
    console.log(`\n🔍 [5/5] Invoking DashboardService.getDashboardData for userId: ${testUser.id}...`);
    const dashboardResult = await DashboardService.getDashboardData(testUser.id);

    if (!dashboardResult.success || !dashboardResult.data) {
      throw new Error("DashboardService did not return success or data payload.");
    }

    const { stats, resumes, interviews, analyticsData, milestones, recentActivities } =
      dashboardResult.data;

    console.log("\n📊 --- Aggregated Dashboard Metrics ---");
    console.log(`• Total Resumes Mapped: ${resumes.length} (Expected: 2)`);
    console.log(`• Active Resume Title: "${resumes[0].title}" (ATS: ${stats.atsScore}/100)`);
    console.log(`• Average ATS Score: ${stats.averageAtsScore}/100`);
    console.log(`• Completed Interviews: ${stats.interviewsCompleted} (Expected: 1)`);
    console.log(`• Average Interview Score: ${stats.averageInterviewScore}% (Expected: 88%)`);
    console.log(`• Readiness Level: "${stats.readinessLevel}"`);
    console.log(`• Career Goal Progress: ${stats.careerGoalProgress}%`);
    console.log(`• Analytics Data Points: ${analyticsData.length}`);
    console.log(`• Active Milestones: ${milestones.length} (Completed: ${milestones.filter(m => m.completed).length})`);
    console.log(`• Recent Activity Feed Entries: ${recentActivities.length}`);

    recentActivities.forEach((act, i) => {
      console.log(`   [${i + 1}] [${act.type.toUpperCase()}] ${act.title} -> ${act.link}`);
    });

    // Assertions
    if (resumes.length !== 2) throw new Error(`Expected 2 resumes, got ${resumes.length}`);
    if (stats.interviewsCompleted !== 1) throw new Error(`Expected 1 completed interview, got ${stats.interviewsCompleted}`);
    if (stats.averageInterviewScore !== 88) throw new Error(`Expected 88% avg score, got ${stats.averageInterviewScore}%`);
    if (recentActivities.length < 3) throw new Error(`Expected at least 3 recent activities, got ${recentActivities.length}`);

    console.log("\n🎉 ALL PHASE 4 CANDIDATE DASHBOARD PERSISTENCE CHECKS PASSED SUCCESSFULLY!");
  } catch (error) {
    console.error("❌ Test failed:", error);
    process.exit(1);
  } finally {
    // Clean up test data
    console.log(`\n🧹 Cleaning up test database records for user ${testUserId}...`);
    await prisma.interviewQuestion.deleteMany({
      where: { session: { userId: testUserId } },
    }).catch(() => {});
    await prisma.interviewSession.deleteMany({
      where: { userId: testUserId },
    }).catch(() => {});
    await prisma.resumeAnalysis.deleteMany({
      where: { userId: testUserId },
    }).catch(() => {});
    await prisma.resume.deleteMany({
      where: { userId: testUserId },
    }).catch(() => {});
    await prisma.user.delete({ where: { id: testUserId } }).catch(() => {});
    console.log("✅ Cleanup complete.");
    await prisma.$disconnect();
  }
}

main();

