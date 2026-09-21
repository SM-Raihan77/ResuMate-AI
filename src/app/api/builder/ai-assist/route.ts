import { NextRequest, NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";
import { getGeminiApiKey } from "@/lib/gemini";

export const maxDuration = 60;

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, payload } = body;

    if (!action) {
      return NextResponse.json({ error: "Missing required 'action' parameter." }, { status: 400 });
    }

    const apiKey = getGeminiApiKey();

    // 1. Action: Enhance Executive Summary
    if (action === "enhance-summary") {
      const { jobTitle, currentSummary } = payload || {};
      const role = jobTitle?.trim() || "Software Engineer";
      const draft = currentSummary?.trim() || "";

      if (!apiKey) {
        return NextResponse.json({
          success: true,
          suggestions: [
            `Results-driven ${role} with extensive experience architecting high-availability cloud platforms, distributed backend services, and high-conversion web frontends. Proven track record reducing API latency by 40% and leading cross-functional engineering pods to deliver enterprise solutions on schedule.`,
            `High-impact ${role} specializing in modern full-stack architectures, automated CI/CD deployment pipelines, and database optimization. Adept at translating complex product requirements into robust, secure code while mentoring junior engineers and elevating engineering excellence.`,
            `Forward-thinking ${role} with deep technical proficiency in scalable system design, low-latency microservices, and reactive user interfaces. Recognized for slashing infrastructure costs, enhancing application security, and driving measurable business outcomes.`,
          ],
        });
      }

      const ai = new GoogleGenAI({ apiKey });
      const prompt = `You are a Principal Technical Recruiter and Executive Resume Strategist at Google.
Target Job Title: "${role}"
Candidate's Current Summary Draft: "${draft || "Experienced engineer looking for high impact roles."}"

Task: Transform this draft into 3 distinct, compelling, ATS-optimized Executive Summary options.
Guidelines:
- 2 to 3 concise sentences packed with strong action verbs (Spearheaded, Architected, Engineered, Optimized).
- Include standard high-value metrics (% latency reduction, scale, uptime, business impact).
- Zero fluff or generic clichés ("hard worker", "team player").
- Return strictly valid JSON matching this schema:
{
  "suggestions": [
    "Summary option 1",
    "Summary option 2",
    "Summary option 3"
  ]
}`;

      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
        config: { responseMimeType: "application/json" },
      });

      const parsed = JSON.parse(response.text || "{}");
      return NextResponse.json({
        success: true,
        suggestions: parsed.suggestions || [],
      });
    }

    // 2. Action: Rewrite Bullet Point (Google XYZ Formula)
    if (action === "rewrite-bullet") {
      const { rawBullet, role, company } = payload || {};
      const targetRole = role?.trim() || "Software Engineer";
      const companyName = company?.trim() || "Tech Company";
      const bullet = rawBullet?.trim() || "";

      if (!bullet || bullet.length < 3) {
        return NextResponse.json(
          { error: "Please provide draft bullet text to enhance." },
          { status: 400 }
        );
      }

      if (!apiKey) {
        const cleaned = bullet.toLowerCase().replace(/^[-•*]\s*/, "");
        return NextResponse.json({
          success: true,
          improved: `Architected and executed ${cleaned}, resulting in a 38% improvement in system throughput and reducing average latency from 450ms to 120ms.`,
          alternatives: [
            `Spearheaded ${cleaned} across distributed microservices, elevating test coverage to 92% and preventing 40+ critical production regressions.`,
            `Engineered automated workflows for ${cleaned}, saving 15+ engineering hours per week and accelerating sprint release velocity by 30%.`,
          ],
        });
      }

      const ai = new GoogleGenAI({ apiKey });
      const prompt = `You are a Staff Technical Recruiter at FAANG and expert in the Google XYZ resume achievement formula:
"Accomplished [X], as measured by [Y], by doing [Z]".

Candidate Role: "${targetRole}" at "${companyName}"
Raw Bullet Draft: "${bullet}"

Task: Convert this draft into high-impact, quantified achievement bullet points.
Guidelines:
- Start with a powerful past-tense action verb (Architected, Spearheaded, Engineered, Orchestrated, Optimized, Accelerated).
- Explicitly integrate measurable quantifiable metrics (e.g. 35% latency drop, $150k annual savings, 99.9% uptime, 500k+ MAU).
- Ensure ATS-friendly phrasing with relevant technical keywords.
- Return strictly valid JSON:
{
  "improved": "Best single-sentence Google XYZ bullet rewrite",
  "alternatives": [
    "Alternative variation with different metric focus",
    "Alternative variation with architectural focus"
  ]
}`;

      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
        config: { responseMimeType: "application/json" },
      });

      const parsed = JSON.parse(response.text || "{}");
      return NextResponse.json({
        success: true,
        improved: parsed.improved || bullet,
        alternatives: parsed.alternatives || [],
      });
    }

    // 3. Action: Suggest High-Demand ATS Skills for Role
    if (action === "suggest-skills") {
      const { jobTitle } = payload || {};
      const targetRole = jobTitle?.trim() || "Full Stack Engineer";

      if (!apiKey) {
        return NextResponse.json({
          success: true,
          categories: [
            {
              categoryName: "Languages & Core",
              skills: ["TypeScript", "JavaScript (ESNext)", "Python", "Go", "SQL", "HTML5/CSS3"],
            },
            {
              categoryName: "Frameworks & Frontend",
              skills: ["React 19", "Next.js 15", "Tailwind CSS", "Redux Toolkit", "Vue.js"],
            },
            {
              categoryName: "Backend & Cloud Databases",
              skills: ["Node.js", "PostgreSQL", "Prisma ORM", "Redis", "Docker", "AWS ECS", "Kubernetes"],
            },
            {
              categoryName: "DevOps, Testing & Architecture",
              skills: ["CI/CD (GitHub Actions)", "System Design", "Microservices", "Jest", "Playwright", "GraphQL & REST"],
            },
          ],
        });
      }

      const ai = new GoogleGenAI({ apiKey });
      const prompt = `You are a Technical Sourcing Specialist.
Target Role: "${targetRole}"

Task: Return the top high-demand ATS keywords and skills required by Tier-1 companies for this role.
Group them into 3-4 standard categories (e.g. "Languages & Core", "Frameworks & Frontend", "Backend & Cloud Databases", "DevOps & Tools").
Return strictly valid JSON:
{
  "categories": [
    {
      "categoryName": "Category Name",
      "skills": ["Skill 1", "Skill 2", "Skill 3", "Skill 4", "Skill 5", "Skill 6"]
    }
  ]
}`;

      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
        config: { responseMimeType: "application/json" },
      });

      const parsed = JSON.parse(response.text || "{}");
      return NextResponse.json({
        success: true,
        categories: parsed.categories || [],
      });
    }

    return NextResponse.json({ error: `Unsupported action '${action}'.` }, { status: 400 });
  } catch (err: any) {
    console.error("AI Builder Assist error:", err);
    return NextResponse.json(
      { error: err.message || "Failed to process AI assist request." },
      { status: 500 }
    );
  }
}
