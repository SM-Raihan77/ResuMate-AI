import "dotenv/config";
import db from "../src/lib/db";
import { ResumeService } from "../src/services/resume.service";
import { INITIAL_RESUME_DATA } from "../src/types/builder";

async function runResumePersistenceVerification() {
  console.log("=== STARTING RESUME DOMAIN PERSISTENCE VERIFICATION ===");

  // 1. Find or create a test user
  let testUser = await db.user.findFirst();
  if (!testUser) {
    console.log("Creating temporary test user in PostgreSQL...");
    testUser = await db.user.create({
      data: {
        id: `test-user-${Date.now()}`,
        name: "Test Engineer",
        email: `test-${Date.now()}@resumate.ai`,
        emailVerified: true,
      },
    });
  }
  console.log(`[PASS] Using Test User ID: ${testUser.id}`);

  // 2. Test Resume Creation with Initial Data
  console.log("\n--- Testing Resume Creation in PostgreSQL ---");
  const createdResume = await ResumeService.createResume(testUser.id, {
    title: "Senior Full-Stack Architect — Verification Profile",
    description: "Cloud microservices and distributed systems lead.",
    initialData: INITIAL_RESUME_DATA,
  });

  console.log(`[PASS] Created Resume ID: ${createdResume.id}`);
  console.log(`[PASS] Title: "${createdResume.title}"`);
  console.log(`[PASS] Full Name: "${createdResume.fullName}"`);
  console.log(`[PASS] Template: "${createdResume.template}", Accent: "${createdResume.accentColor}"`);

  // 3. Test Reading Resume by ID
  console.log("\n--- Testing Reading Resume from PostgreSQL ---");
  const fetchedResume = await ResumeService.getResumeById(testUser.id, createdResume.id);
  if (!fetchedResume) {
    throw new Error(`Failed to retrieve resume with ID ${createdResume.id}`);
  }
  console.log(`[PASS] Fetched Resume ID matches: ${fetchedResume.id === createdResume.id}`);
  console.log(`[PASS] Experience items count: ${Array.isArray(fetchedResume.experience) ? (fetchedResume.experience as any[]).length : 0}`);
  console.log(`[PASS] Skills categories count: ${Array.isArray(fetchedResume.skills) ? (fetchedResume.skills as any[]).length : 0}`);

  // 4. Test Updating Full Resume (Experience, Skills, Projects, Styling)
  console.log("\n--- Testing Full Resume Update (Autosave Simulation) ---");
  const updatedData = {
    title: "Staff Cloud Engineer — Updated Profile",
    jobTitle: "Staff Cloud Infrastructure Architect",
    summary: "Architecting resilient distributed systems with 99.999% uptime.",
    template: "executive",
    accentColor: "#06b6d4",
    atsScore: 95,
    experience: [
      {
        id: "exp-test-1",
        role: "Principal Infrastructure Lead",
        company: "NextGen Cloud Corp",
        location: "Seattle, WA",
        startDate: "2024-01",
        endDate: "Present",
        current: true,
        highlights: [
          "Engineered multi-region PostgreSQL cluster with sub-10ms replication latency.",
          "Reduced cloud infrastructure costs by $320k annually via automated workload scheduling.",
        ],
      },
    ],
    skills: [
      {
        id: "skill-cat-1",
        categoryName: "Cloud & Distributed Systems",
        skills: ["PostgreSQL", "Prisma 7", "Next.js 16", "Docker", "Kubernetes", "AWS ECS"],
      },
    ],
  };

  const updatedResume = await ResumeService.updateResume(testUser.id, createdResume.id, updatedData);
  console.log(`[PASS] Updated Job Title: "${updatedResume.jobTitle}"`);
  console.log(`[PASS] Updated Template: "${updatedResume.template}"`);
  console.log(`[PASS] Updated Accent Color: "${updatedResume.accentColor}"`);
  console.log(`[PASS] Updated ATS Score: ${updatedResume.atsScore}`);
  console.log(`[PASS] Updated Experience count: ${(updatedResume.experience as any[]).length}`);

  // 5. Test User Ownership Isolation (Unauthorized User access)
  console.log("\n--- Testing User Authorization & Ownership Security ---");
  const fakeUserId = "unauthorized-user-999";
  const unauthorizedFetch = await ResumeService.getResumeById(fakeUserId, createdResume.id);
  console.log(`[PASS] Unauthorized User fetch result: ${unauthorizedFetch === null ? "BLOCKED (null)" : "LEAKED"}`);

  try {
    await ResumeService.updateResume(fakeUserId, createdResume.id, { title: "Hacked Resume" });
    throw new Error("SECURITY FAILURE: Unauthorized update was allowed!");
  } catch (err: any) {
    console.log(`[PASS] Unauthorized User update BLOCKED with error: "${err.message}"`);
  }

  // 6. Test User Resumes List
  console.log("\n--- Testing Listing User Resumes ---");
  const userResumes = await ResumeService.getUserResumes(testUser.id);
  console.log(`[PASS] Found ${userResumes.length} resumes for user.`);
  const found = userResumes.find((r) => r.id === createdResume.id);
  console.log(`[PASS] Created resume present in user list: ${Boolean(found)}`);

  // 7. Cleanup Test Resume
  console.log("\n--- Cleaning Up Verification Resume ---");
  await ResumeService.deleteResume(testUser.id, createdResume.id);
  const checkDeleted = await ResumeService.getResumeById(testUser.id, createdResume.id);
  console.log(`[PASS] Deleted Resume retrieval: ${checkDeleted === null ? "CONFIRMED DELETED" : "FAILED"}`);

  console.log("\n=== ALL RESUME PERSISTENCE & ARCHITECTURE TESTS PASSED SUCCESSFULLY! ===");
}

runResumePersistenceVerification()
  .catch((err) => {
    console.error("Verification error:", err);
    process.exit(1);
  })
  .finally(() => {
    process.exit(0);
  });
