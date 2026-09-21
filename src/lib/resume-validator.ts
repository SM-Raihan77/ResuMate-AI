import { GoogleGenAI, Type } from "@google/genai";
import { getGeminiApiKey } from "@/lib/gemini";

export interface ResumeValidationResult {
  isValid: boolean;
  reason?: string;
  isDeterministic?: boolean;
}

/**
 * Validates whether an extracted document text represents a genuine resume / CV.
 *
 * Evaluation Strategy:
 * 1. Length & Emptiness check (instant deterministic reject if < 80 chars or < 15 words).
 * 2. Obvious Non-Resume Signatures (instant deterministic reject for NID, Passport, Invoices, standalone Certificates, etc.).
 * 3. Deterministic Resume Structural Scoring (accepts experienced, fresh-grad, student, and career-changer resumes without AI tokens).
 * 4. Lightweight AI fallback (only for genuinely ambiguous cases using a small ~1200 char preview).
 */
export async function validateResumeDocument(
  text: string
): Promise<ResumeValidationResult> {
  const rawText = (text || "").trim();

  // ── Stage 1: Length & Emptiness Gate ─────────────────────────────────────────
  if (rawText.length < 80) {
    return {
      isValid: false,
      reason:
        "Unable to extract sufficient content. Please upload a valid resume with your experience, education, or skills.",
      isDeterministic: true,
    };
  }

  const words = rawText.split(/\s+/).filter(Boolean);
  if (words.length < 15) {
    return {
      isValid: false,
      reason:
        "The uploaded document contains too few words to be a resume. Please upload a complete resume.",
      isDeterministic: true,
    };
  }

  const lower = rawText.toLowerCase();

  // ── Stage 2: Obvious Non-Resume Signatures (Deterministic Rejection) ───────────

  // 2A. National ID / Government Identity / Passport / Driver's License
  const idSignatures = [
    "national id",
    "national identity",
    "national identity card",
    "nid no",
    "nid number",
    "nid :",
    "nid:",
    "voter id",
    "voter card",
    "driving licence",
    "driver's license",
    "driving license",
    "passport no",
    "passport number",
    "republic of bangladesh",
    "government of the people's republic",
    "government of bangladesh",
    "election commission",
    "aadhaar",
    "social security card",
    "pan card",
    "tax identification card",
  ];

  const hasIdSignature = idSignatures.some((sig) => lower.includes(sig));

  // Additional ID card field indicators (common on NIDs/passports)
  const idFieldMatches = [
    /\b(father(?:'s)?\s*name|mother(?:'s)?\s*name|husband(?:'s)?\s*name)\b/i,
    /\b(blood\s*group(?:\s*:\s*[a-z+-]+)?)\b/i,
    /\b(date\s*of\s*birth(?:\s*:\s*|\s+)\d{1,4}[-/.]\d{1,2}[-/.]\d{1,4})\b/i,
    /\b(id\s*no|pin\s*no|card\s*no)\b/i,
    /\b(place\s*of\s*birth|nationality|sex|gender)\b/i,
  ].filter((regex) => regex.test(lower)).length;

  // 2B. Financial / Invoices / Receipts / Bills
  const invoiceSignatures = [
    "tax invoice",
    "invoice no",
    "invoice #",
    "invoice number",
    "amount due",
    "bill to:",
    "bill to :",
    "ship to:",
    "subtotal",
    "payment terms",
    "purchase order",
    "receipt no",
    "bank statement",
    "account statement",
    "electricity bill",
    "utility bill",
    "total amount payable",
  ];
  const hasInvoiceSignature = invoiceSignatures.some((sig) =>
    lower.includes(sig)
  );

  // 2C. Standalone Single Certificate / Award / Diploma (without resume history)
  const certificateSignatures = [
    "certificate of completion",
    "this is to certify that",
    "has successfully completed the course",
    "certificate of appreciation",
    "certificate of attendance",
    "is hereby awarded this certificate",
    "in recognition of successful completion",
    "certificate of participation",
  ];
  const hasCertificateSignature = certificateSignatures.some((sig) =>
    lower.includes(sig)
  );

  // 2D. Legal / Terms / Policies
  const legalSignatures = [
    "terms of service",
    "privacy policy",
    "end user license agreement",
    "terms and conditions",
    "all rights reserved. unauthorized copying",
    "table of contents",
  ];
  const hasLegalSignature = legalSignatures.some((sig) => lower.includes(sig));

  // ── Stage 3: Structural Resume Category Detection ───────────────────────────
  // Contact
  const hasEmail = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/.test(
    rawText
  );
  const hasPhone = /(?:\+?\d{1,3}[-.\s]?)?\(?\d{2,4}\)?[-.\s]?\d{3,4}[-.\s]?\d{3,4}/.test(
    rawText
  );
  const hasLinks =
    /linkedin\.com|github\.com|portfolio|behance\.net|gitlab\.com|bitbucket\.org/i.test(
      rawText
    );
  const contactScore = (hasEmail ? 1 : 0) + (hasPhone ? 1 : 0) + (hasLinks ? 1 : 0);

  // Experience / Work History
  const experienceKeywords = [
    /\b(work\s+experience|professional\s+experience|employment\s+history|career\s+history|work\s+history|job\s+experience)\b/i,
    /\b(experience|employment|internship|internships|responsibilities|job\s+title)\b/i,
  ];
  const hasExperience = experienceKeywords.some((r) => r.test(rawText));

  // Education / Academic (crucial for students / fresh grads)
  const educationKeywords = [
    /\b(education|academic\s+background|educational\s+qualifications|educational\s+background|academics)\b/i,
    /\b(university|college|institute|degree|bachelor|bachelors|master|masters|phd|b\.?sc|m\.?sc|b\.?tech|m\.?tech|diploma|gpa|cgpa|graduated|major in)\b/i,
  ];
  const hasEducation = educationKeywords.some((r) => r.test(rawText));

  // Skills / Technical Competencies
  const skillsKeywords = [
    /\b(skills|technical\s+skills|core\s+competencies|technologies|tools\s*&?\s*technologies|programming\s+languages|frameworks|key\s+skills|expertise|proficiencies)\b/i,
  ];
  const hasSkills = skillsKeywords.some((r) => r.test(rawText));

  // Projects / Portfolio (crucial for students / career changers)
  const projectsKeywords = [
    /\b(projects|academic\s+projects|personal\s+projects|key\s+projects|project\s+experience|notable\s+projects)\b/i,
  ];
  const hasProjects = projectsKeywords.some((r) => r.test(rawText));

  // Summary / Profile / Objective
  const summaryKeywords = [
    /\b(summary|professional\s+summary|executive\s+summary|career\s+objective|objective|about\s+me|profile|personal\s+statement)\b/i,
  ];
  const hasSummary = summaryKeywords.some((r) => r.test(rawText));

  // Certifications / Awards / Additional
  const certKeywords = [
    /\b(certifications|certificates|licenses|honors|awards|extracurricular|achievements|publications)\b/i,
  ];
  const hasCertifications = certKeywords.some((r) => r.test(rawText));

  // Chronological / Date Indicators (e.g., 2018 - 2022, 2021 - Present, Jan 2020)
  const hasChronology =
    /\b(19\d{2}|20\d{2})\s*(?:-|–|to)\s*(?:19\d{2}|20\d{2}|present|current)\b/i.test(
      rawText
    ) ||
    /\b(jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)[a-z]*\s+(?:19\d{2}|20\d{2})\b/i.test(
      rawText
    );

  // Count detected core resume sections
  const coreResumeSections = [
    hasExperience,
    hasEducation,
    hasSkills,
    hasProjects,
    hasSummary,
    hasCertifications,
  ].filter(Boolean).length;

  // ── Stage 2 Evaluation: Immediate Rejection of Non-Resumes ────────────────────
  if (hasIdSignature || idFieldMatches >= 2) {
    // If it has ID signatures and does NOT have strong multi-section resume evidence (>= 3 sections)
    if (coreResumeSections < 3) {
      return {
        isValid: false,
        reason:
          "This document appears to be a National ID, Passport, or Government Identity card. Please upload a valid resume.",
        isDeterministic: true,
      };
    }
  }

  if (hasInvoiceSignature && coreResumeSections < 2) {
    return {
      isValid: false,
      reason:
        "This document appears to be an invoice or financial receipt. Please upload a valid resume.",
      isDeterministic: true,
    };
  }

  if (hasCertificateSignature && !hasExperience && !hasProjects && coreResumeSections < 2) {
    return {
      isValid: false,
      reason:
        "This document appears to be a single certificate or award, not a complete resume. Please upload a resume with your full profile.",
      isDeterministic: true,
    };
  }

  if (hasLegalSignature && coreResumeSections < 2) {
    return {
      isValid: false,
      reason:
        "This document doesn't appear to be a resume. Please upload a valid resume.",
      isDeterministic: true,
    };
  }

  // ── Stage 3 Evaluation: Deterministic Acceptance ─────────────────────────────
  // 1. Standard Experienced Resume: Experience + (Education or Skills or Projects)
  const isExperiencedResume =
    hasExperience && (hasEducation || hasSkills || hasProjects) && (contactScore > 0 || hasChronology);

  // 2. Fresh Graduate / Student Resume: Education + (Skills or Projects) + (Contact or Summary or Dates)
  const isFreshGradResume =
    hasEducation && (hasSkills || hasProjects) && (contactScore > 0 || hasSummary || hasChronology);

  // 3. Project / Portfolio-Focused / Self-Taught Resume: Projects + Skills + (Contact or Summary or Dates)
  const isProjectResume =
    hasProjects && hasSkills && (contactScore > 0 || hasSummary || hasChronology);

  // 4. Multi-section generic resume (at least 3 core sections + contact info or chronology)
  const isRichResume = coreResumeSections >= 3 && (contactScore > 0 || hasChronology);

  if (isExperiencedResume || isFreshGradResume || isProjectResume || isRichResume) {
    return {
      isValid: true,
      isDeterministic: true,
    };
  }

  // If document has absolutely 0 core resume sections and no contact details, reject deterministically
  if (coreResumeSections === 0 && contactScore === 0) {
    return {
      isValid: false,
      reason:
        "This document doesn't appear to be a resume. Please upload a valid resume containing your education, skills, projects, or work experience.",
      isDeterministic: true,
    };
  }

  // ── Stage 4: Token-Efficient AI Fallback (Ambiguous Gray Zone Only) ───────────
  const apiKey = getGeminiApiKey();

  if (apiKey) {
    try {
      const ai = new GoogleGenAI({ apiKey });
      const snippet = rawText.slice(0, 1200);

      const systemInstruction = `You are a strict automated document classifier.
Your task is to determine whether the provided document snippet is a Resume / CV (including student or fresh-graduate resumes) or a non-resume document (such as an ID card, certificate, bill, invoice, essay, article, homework, or random text).

Rules:
- Accept: Experienced resumes, student CVs, fresh-graduate resumes with education/skills/projects, technical resumes.
- Reject: ID cards, driver's licenses, passports, invoices, single standalone certificates/diplomas, news articles, receipts, random notes.

You must respond strictly with valid JSON.`;

      const prompt = `DOCUMENT PREVIEW SNIPPET:
"""
${snippet}
"""

Is this document a resume or CV?`;

      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
        config: {
          systemInstruction,
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              isResume: { type: Type.BOOLEAN },
              reason: { type: Type.STRING },
            },
            required: ["isResume", "reason"],
          },
        },
      });

      const parsed = JSON.parse(response.text || "{}");
      if (typeof parsed.isResume === "boolean") {
        if (!parsed.isResume) {
          return {
            isValid: false,
            reason:
              parsed.reason ||
              "This document doesn't appear to be a resume. Please upload a valid resume.",
            isDeterministic: false,
          };
        }
        return { isValid: true, isDeterministic: false };
      }
    } catch (aiErr) {
      console.warn("Gemini resume validation fallback failed, using heuristic:", aiErr);
    }
  }

  // Offline heuristic fallback for ambiguous documents
  if (coreResumeSections >= 2) {
    return { isValid: true, isDeterministic: true };
  }

  return {
    isValid: false,
    reason:
      "This document doesn't appear to be a resume. Please upload a valid resume containing your education, skills, or work history.",
    isDeterministic: true,
  };
}
