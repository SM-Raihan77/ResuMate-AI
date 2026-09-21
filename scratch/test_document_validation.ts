import "dotenv/config";
import prisma from "../src/lib/prisma";
import { ResumeService } from "../src/services/resume.service";
import { validateResumeDocument } from "../src/lib/resume-validator";

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
  console.log("🧪 RUNNING RESUME VALIDATOR & ANALYZER TEST SUITE");
  console.log("=======================================================\n");

  // ─────────────────────────────────────────────────────────────────────────────
  // 1. DIRECT VALIDATOR UNIT TESTS
  // ─────────────────────────────────────────────────────────────────────────────

  // Test 1A: Valid Experienced Software Engineer Resume
  const validTechResume = `
ALEXANDER VANCE
Senior Full Stack Engineer | San Francisco, CA | alex.vance@example.com | (555) 234-5678 | github.com/avance

SUMMARY
Full Stack Software Engineer with 6+ years of experience building scalable web applications, microservices, and distributed cloud systems using TypeScript, React, Next.js, and Node.js.

WORK EXPERIENCE
Senior Software Engineer | TechScale Inc. | 2022 – Present
- Architected high-throughput RESTful microservices in Node.js & TypeScript, cutting p99 query latency by 42%.
- Optimized PostgreSQL schema indexing and integrated Redis caching layer.
- Collaborated with product managers and engineers on core web features.

Software Engineer | CloudMatrix Solutions | 2019 – 2022
- Maintained React and Node.js codebase for enterprise SaaS clients.
- Implemented authentication workflows and payment gateway integrations.

EDUCATION
Bachelor of Science in Computer Science | University of California, Berkeley | 2015 – 2019

TECHNICAL SKILLS
Languages: TypeScript, JavaScript, Python, SQL, HTML5, CSS3
Frameworks & Databases: React, Next.js, Node.js, Express, PostgreSQL, Redis, Docker, Git
`;

  const techVal = await validateResumeDocument(validTechResume);
  recordTest(
    "Valid Experienced Tech Resume",
    "Valid Resume",
    techVal.isValid === true,
    "isValid: true",
    `isValid: ${techVal.isValid}`,
    techVal.reason
  );

  // Test 1B: Valid Fresh-Graduate / Student Resume (NO Work Experience!)
  const validFreshGradResume = `
EMILY ZHANG
New York, NY | emily.zhang@columbia.edu | (212) 555-0198 | linkedin.com/in/emilyzhang | github.com/ezhang

EDUCATION
Columbia University | New York, NY
Bachelor of Science in Computer Science | Minor in Mathematics
Graduation: May 2026 | GPA: 3.85 / 4.00
Relevant Coursework: Data Structures & Algorithms, Operating Systems, Database Systems, Artificial Intelligence, Web Development

PROJECTS
ResuMate AI - Intelligent Career Suite (2025)
- Developed full-stack Next.js 15 application with TypeScript, PostgreSQL, and Prisma.
- Integrated Gemini AI for real-time document scoring and automated feedback generation.
- Designed responsive dark-mode UI with TailwindCSS and Lucide icons.

Distributed Key-Value Store (2024)
- Built Raft consensus algorithm implementation in Go with automated cluster failover.
- Benchmarked performance achieving 15,000 ops/sec across 5-node cluster.

TECHNICAL SKILLS
Languages: Python, TypeScript, Java, C++, Go, SQL
Frameworks & Tools: React, Next.js, FastAPI, Docker, Git, PostgreSQL, Linux
`;

  const freshGradVal = await validateResumeDocument(validFreshGradResume);
  recordTest(
    "Valid Fresh-Graduate Resume (No Work Experience, Has Education/Skills/Projects)",
    "Valid Resume",
    freshGradVal.isValid === true,
    "isValid: true",
    `isValid: ${freshGradVal.isValid}`,
    freshGradVal.reason
  );

  // Test 1C: Valid Product Manager Resume
  const validPmResume = `
SARAH CHEN
Lead Technical Product Manager | New York, NY | sarah.chen@example.com | linkedin.com/in/sarahchen

SUMMARY
Product Manager with 5+ years of experience driving B2B SaaS product roadmaps, user retention, and enterprise platform growth.

WORK EXPERIENCE
Product Manager | NexaFlow | 2021 – Present
- Led cross-functional team of 12 engineers and designers delivering enterprise analytics.
- Ran user discovery interviews and prioritized sprint backlogs.

EDUCATION
Master of Business Administration (MBA) | NYU Stern School of Business | 2019 – 2021
Bachelor of Arts in Economics | Boston University | 2014 – 2018

SKILLS
Product Strategy, Agile / Scrum, User Research, Amplitude, SQL, Jira, Roadmapping
`;

  const pmVal = await validateResumeDocument(validPmResume);
  recordTest(
    "Valid Product Manager Resume",
    "Valid Resume",
    pmVal.isValid === true,
    "isValid: true",
    `isValid: ${pmVal.isValid}`,
    pmVal.reason
  );

  // Test 1D: Bangladesh National ID (NID) Card
  const nidCardText = `
Government of the People's Republic of Bangladesh
National ID Card / জাতীয় পরিচয়পত্র

Name: Md. Rafiqul Islam
Father's Name: Md. Abdul Karim
Mother's Name: Begum Fatema Khatun
Date of Birth: 14 Aug 1994
NID No: 19942691234567890
Blood Group: B+
Address: Village: Radhanagar, Post: Pabna Sadar, District: Pabna
`;

  const nidVal = await validateResumeDocument(nidCardText);
  recordTest(
    "Bangladesh National ID (NID) Card",
    "Non-Resume ID",
    nidVal.isValid === false,
    "isValid: false",
    `isValid: ${nidVal.isValid}`,
    nidVal.reason
  );

  // Test 1E: Driving License / Passport Document
  const passportText = `
PASSPORT / PASSEPORT
REPUBLIC OF BANGLADESH
Passport No: EA0192834
Surname: CHOWDHURY
Given Names: TANVIR AHMED
Nationality: BANGLADESHI
Date of Birth: 05 MAR 1990
Sex: M
Place of Birth: DHAKA
Date of Issue: 12 JAN 2020
Date of Expiry: 11 JAN 2030
Authority: DIP / DHAKA
`;

  const passportVal = await validateResumeDocument(passportText);
  recordTest(
    "Passport Identification Document",
    "Non-Resume ID",
    passportVal.isValid === false,
    "isValid: false",
    `isValid: ${passportVal.isValid}`,
    passportVal.reason
  );

  // Test 1F: Commercial Invoice / Bill
  const invoiceText = `
TAX INVOICE #INV-2024-8849
Acme Cloud Services Inc.
100 Tech Blvd, Suite 400, Austin, TX

Bill To: Global Logistics Corp
Invoice Date: September 15, 2025
Payment Terms: Net 30
Due Date: October 15, 2025

Item 1: Enterprise Cloud Hosting Subscription - $2,400.00
Item 2: Dedicated IP & SSL Certificate - $150.00
Subtotal: $2,550.00
Tax (8.25%): $210.38
Total Amount Due: $2,760.38

Please send payments via wire transfer to Account No: 9876543210.
`;

  const invoiceVal = await validateResumeDocument(invoiceText);
  recordTest(
    "Commercial Invoice Document",
    "Non-Resume Financial",
    invoiceVal.isValid === false,
    "isValid: false",
    `isValid: ${invoiceVal.isValid}`,
    invoiceVal.reason
  );

  // Test 1G: Standalone Single Certificate of Completion
  const certText = `
CERTIFICATE OF COMPLETION
This is to certify that
JOHNATHAN SMITH
has successfully completed the 40-hour professional course in
Advanced Microservices Architecture and Kubernetes Orchestration
Issued by CloudTech Academy on March 10, 2025
Instructor Signature: Dr. Robert Miller
`;

  const certVal = await validateResumeDocument(certText);
  recordTest(
    "Standalone Single Course Certificate",
    "Non-Resume Certificate",
    certVal.isValid === false,
    "isValid: false",
    `isValid: ${certVal.isValid}`,
    certVal.reason
  );

  // Test 1H: Empty or Very Short Document
  const shortText = `Hello, this is just a quick note with 10 words total.`;
  const shortVal = await validateResumeDocument(shortText);
  recordTest(
    "Empty / Very Short Document (< 80 chars)",
    "Short Document",
    shortVal.isValid === false,
    "isValid: false",
    `isValid: ${shortVal.isValid}`,
    shortVal.reason
  );

  // Test 1I: Random Unrelated Text / Terms of Service
  const termsText = `
Terms of Service and End User License Agreement
1. Acceptance of Terms: By accessing this website and using the services provided, you agree to be bound by these terms.
2. Privacy Policy: We value your privacy and process user data in accordance with international regulations.
3. Limitation of Liability: In no event shall the company be liable for any indirect, incidental, special or consequential damages.
All rights reserved. Unauthorized copying or redistribution is strictly prohibited.
`;

  const termsVal = await validateResumeDocument(termsText);
  recordTest(
    "Terms of Service / Random Policy Document",
    "Non-Resume Legal",
    termsVal.isValid === false,
    "isValid: false",
    `isValid: ${termsVal.isValid}`,
    termsVal.reason
  );

  // ─────────────────────────────────────────────────────────────────────────────
  // 2. END-TO-END RESUME SERVICE & DATABASE PERSISTENCE TESTS
  // ─────────────────────────────────────────────────────────────────────────────

  console.log("\n--- Testing ResumeService.analyzeResume Pipeline Integration ---");
  const testUserId = `val-test-user-${Date.now()}`;

  try {
    // Setup test user
    await prisma.user.create({
      data: {
        id: testUserId,
        email: `val-tester-${Date.now()}@example.com`,
        name: "Validator Tester",
      },
    });

    // 2A: Valid Resume via ResumeService -> Should SUCCEED and return ATS Score + persist in DB
    try {
      const validResult = await ResumeService.analyzeResume({
        userId: testUserId,
        resumeText: validTechResume,
        jobDescription: "Full Stack Engineer with React and Node.js",
      });

      const hasAtsScore = typeof validResult.data.atsScore === "number" && validResult.data.atsScore > 0;
      const isPersisted = Boolean(validResult.data.id);

      recordTest(
        "ResumeService accepts valid resume & calculates ATS score",
        "E2E Valid Flow",
        validResult.success === true && hasAtsScore && isPersisted,
        "success: true, atsScore > 0, persisted",
        `success: ${validResult.success}, atsScore: ${validResult.data?.atsScore}, id: ${validResult.data?.id}`
      );
    } catch (e: any) {
      recordTest(
        "ResumeService accepts valid resume",
        "E2E Valid Flow",
        false,
        "success: true",
        `Threw error: ${e.message}`
      );
    }

    // 2B: Fresh Graduate Resume via ResumeService -> Should SUCCEED
    try {
      const freshGradResult = await ResumeService.analyzeResume({
        userId: testUserId,
        resumeText: validFreshGradResume,
      });

      const hasAtsScore = typeof freshGradResult.data.atsScore === "number" && freshGradResult.data.atsScore > 0;

      recordTest(
        "ResumeService accepts fresh-graduate resume without work experience",
        "E2E Fresh Grad Flow",
        freshGradResult.success === true && hasAtsScore,
        "success: true, atsScore > 0",
        `success: ${freshGradResult.success}, atsScore: ${freshGradResult.data?.atsScore}`
      );
    } catch (e: any) {
      recordTest(
        "ResumeService accepts fresh-graduate resume",
        "E2E Fresh Grad Flow",
        false,
        "success: true",
        `Threw error: ${e.message}`
      );
    }

    // 2C: NID Card via ResumeService -> MUST THROW ERROR & NOT PERSIST ANYTHING
    const countBeforeNid = await prisma.resumeAnalysis.count({
      where: { userId: testUserId },
    });

    let nidRejected = false;
    let nidErrorMsg = "";

    try {
      await ResumeService.analyzeResume({
        userId: testUserId,
        resumeText: nidCardText,
      });
    } catch (e: any) {
      nidRejected = true;
      nidErrorMsg = e.message;
    }

    const countAfterNid = await prisma.resumeAnalysis.count({
      where: { userId: testUserId },
    });

    const noNewDbRecords = countAfterNid === countBeforeNid;

    recordTest(
      "ResumeService rejects NID Card before ATS scoring & skips DB persistence",
      "E2E NID Flow",
      nidRejected && noNewDbRecords,
      "Throws validation error & DB record count unchanged",
      `nidRejected: ${nidRejected}, error: "${nidErrorMsg}", DB records added: ${countAfterNid - countBeforeNid}`
    );

    // 2D: Invoice via ResumeService -> MUST THROW ERROR & NOT PERSIST
    let invoiceRejected = false;
    let invoiceErrorMsg = "";

    try {
      await ResumeService.analyzeResume({
        userId: testUserId,
        resumeText: invoiceText,
      });
    } catch (e: any) {
      invoiceRejected = true;
      invoiceErrorMsg = e.message;
    }

    recordTest(
      "ResumeService rejects Invoice before ATS scoring",
      "E2E Invoice Flow",
      invoiceRejected,
      "Throws validation error",
      `invoiceRejected: ${invoiceRejected}, error: "${invoiceErrorMsg}"`
    );

    // 2E: Short text via ResumeService -> MUST THROW ERROR
    let shortRejected = false;
    let shortErrorMsg = "";

    try {
      await ResumeService.analyzeResume({
        userId: testUserId,
        resumeText: "Too short",
      });
    } catch (e: any) {
      shortRejected = true;
      shortErrorMsg = e.message;
    }

    recordTest(
      "ResumeService rejects short text gracefully",
      "E2E Short Flow",
      shortRejected,
      "Throws validation error",
      `shortRejected: ${shortRejected}, error: "${shortErrorMsg}"`
    );
  } finally {
    // Cleanup test data
    await prisma.resumeAnalysis.deleteMany({
      where: { userId: testUserId },
    });
    await prisma.resume.deleteMany({
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
    console.log("🎉 ALL RESUME VALIDATION & REJECTION TESTS PASSED!");
  } else {
    console.log(`⚠️ ${failedCount} TESTS FAILED`);
  }
  console.log("=======================================================\n");

  if (failedCount > 0) {
    process.exit(1);
  }
}

runTestSuite();
