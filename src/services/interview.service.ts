import prisma from "@/lib/prisma";
import { SubscriptionService } from "./subscription.service";
import {
  generateInterviewQuestionsWithGemini,
  evaluateInterviewAnswerWithGemini,
  generateInterviewReportWithGemini,
} from "@/lib/gemini";
import {
  GenerateQuestionsRequest,
  GenerateQuestionsResponse,
  EvaluateAnswerRequest,
  EvaluateAnswerResponse,
  GenerateInterviewReportRequest,
  GenerateInterviewReportResponse,
} from "@/types/interview";

export class InterviewService {
  /**
   * Generates a calibrated set of interview questions and persists the session if authenticated.
   */
  static async generateQuestions(
    payload: GenerateQuestionsRequest
  ): Promise<GenerateQuestionsResponse> {
    if (!payload.role || payload.role.trim().length === 0) {
      throw new Error("Job role is required to generate interview questions.");
    }

    const count = Math.min(Math.max(payload.questionCount || 5, 3), 10);
    const difficulty = payload.difficulty || "senior";
    const interviewType = payload.interviewType || "mixed";

    let resumeText = payload.resumeText?.trim();

    // If resumeId is provided and resumeText is missing, load resume content from DB
    if (!resumeText && payload.resumeId && payload.userId) {
      const dbResume = await prisma.resume.findFirst({
        where: { id: payload.resumeId, userId: payload.userId },
      });
      if (dbResume) {
        resumeText = [
          dbResume.jobTitle ? `Target Title: ${dbResume.jobTitle}` : "",
          dbResume.summary ? `Summary: ${dbResume.summary}` : "",
          Array.isArray(dbResume.skills) && (dbResume.skills as unknown[]).length > 0
            ? `Skills: ${JSON.stringify(dbResume.skills)}`
            : "",
        ]
          .filter(Boolean)
          .join("\n");
      }
    }

    const { questions, isDemo } = await generateInterviewQuestionsWithGemini({
      role: payload.role.trim(),
      difficulty,
      interviewType,
      questionCount: count,
      jobDescription: payload.jobDescription?.trim(),
      resumeText,
    });

    let sessionId: string | undefined = undefined;

    // Persist session into PostgreSQL if user is authenticated and quota allows
    if (payload.userId) {
      const session = await SubscriptionService.executeWithQuotaCheck(
        payload.userId,
        "interview",
        async (tx) => {
          return await tx.interviewSession.create({
            data: {
              userId: payload.userId,
              resumeId: payload.resumeId || null,
              role: payload.role.trim(),
              difficulty,
              interviewType,
              status: "IN_PROGRESS",
              totalQuestions: questions.length,
              jobDescription: payload.jobDescription?.trim() || null,
              questions: {
                create: questions.map((q: any, idx: number) => ({
                  questionIndex: idx,
                  question: q.question,
                  category: q.category,
                  expectedKeywords: q.expectedKeywords || [],
                  context: q.context || null,
                  hint: q.hint || null,
                  sampleAnswer: q.sampleAnswer || null,
                })),
              },
            },
          });
        }
      );
      sessionId = session.id;
    }

    return {
      success: true,
      sessionId,
      role: payload.role.trim(),
      difficulty,
      interviewType,
      questions,
      isDemo,
    };
  }

  /**
   * Evaluates a single candidate answer in real-time and persists evaluation if sessionId is provided.
   */
  static async evaluateAnswer(
    payload: EvaluateAnswerRequest & { userId?: string }
  ): Promise<EvaluateAnswerResponse> {
    if (!payload.question || !payload.question.question) {
      throw new Error("Valid question object is required.");
    }

    if (!payload.userAnswer || payload.userAnswer.trim().length < 2) {
      throw new Error("Please provide a more substantive answer to receive accurate AI feedback.");
    }

    const evaluation = await evaluateInterviewAnswerWithGemini({
      question: payload.question,
      userAnswer: payload.userAnswer.trim(),
      role: payload.role || "Software Engineer",
      difficulty: payload.difficulty || "senior",
      interviewType: payload.interviewType || "technical",
    });

    // Update database question evaluation if sessionId is available
    if (payload.sessionId) {
      try {
        const questionFilter: any = {
          sessionId: payload.sessionId,
        };

        if (payload.questionIndex !== undefined) {
          questionFilter.questionIndex = payload.questionIndex;
        }

        const existingQuestion = await prisma.interviewQuestion.findFirst({
          where: questionFilter,
        });

        if (existingQuestion) {
          await prisma.interviewQuestion.update({
            where: { id: existingQuestion.id },
            data: {
              userAnswer: payload.userAnswer.trim(),
              score: evaluation.score,
              strengths: evaluation.strengths || [],
              weaknesses: evaluation.weaknesses || [],
              idealAnswer: evaluation.idealAnswer || null,
              starCompliance: (evaluation.starCompliance as any) || null,
            },
          });
        }
      } catch (dbErr) {
        console.error("Failed to update interview question evaluation in DB:", dbErr);
      }
    }

    return {
      success: true,
      evaluation,
    };
  }

  /**
   * Generates a final aggregate report for the completed interview session and marks session COMPLETED in PostgreSQL.
   */
  static async generateFinalReport(
    payload: GenerateInterviewReportRequest
  ): Promise<GenerateInterviewReportResponse> {
    if (!payload.evaluations || payload.evaluations.length === 0) {
      throw new Error("At least one evaluated answer is required to generate a final report.");
    }

    const report = await generateInterviewReportWithGemini({
      role: payload.role || "Software Engineer",
      difficulty: payload.difficulty || "senior",
      interviewType: payload.interviewType || "mixed",
      evaluations: payload.evaluations,
    });

    // If sessionId is provided, update the session in PostgreSQL
    if (payload.sessionId) {
      try {
        await prisma.interviewSession.update({
          where: { id: payload.sessionId },
          data: {
            status: "COMPLETED",
            overallScore: report.overallScore,
            grade: report.grade,
            categoryScores: report.categoryScores as any,
            keyStrengths: report.keyStrengths || [],
            criticalImprovements: report.criticalImprovements || [],
            detailedFeedback: report.detailedFeedback || null,
            readinessRecommendation: report.readinessRecommendation || null,
          },
        });
      } catch (dbErr) {
        console.error("Failed to mark interview session as completed in DB:", dbErr);
      }
    }

    return {
      success: true,
      sessionId: payload.sessionId,
      report,
    };
  }

  /**
   * Retrieves all completed or in-progress interview sessions for a user.
   */
  static async getUserInterviewSessions(userId: string, limit: number = 20) {
    return await prisma.interviewSession.findMany({
      where: {
        userId,
      },
      include: {
        resume: {
          select: {
            id: true,
            title: true,
          },
        },
        questions: {
          orderBy: {
            questionIndex: "asc",
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
      take: limit,
    });
  }

  /**
   * Retrieves a single interview session by ID, verifying user ownership.
   */
  static async getInterviewSessionById(userId: string, sessionId: string) {
    const session = await prisma.interviewSession.findFirst({
      where: {
        id: sessionId,
        userId,
      },
      include: {
        resume: true,
        questions: {
          orderBy: {
            questionIndex: "asc",
          },
        },
      },
    });

    if (!session) {
      throw new Error("Interview session not found or unauthorized.");
    }

    return session;
  }

  /**
   * Deletes an interview session with ownership verification.
   */
  static async deleteInterviewSession(userId: string, sessionId: string) {
    const session = await prisma.interviewSession.findFirst({
      where: {
        id: sessionId,
        userId,
      },
    });

    if (!session) {
      throw new Error("Interview session not found or unauthorized.");
    }

    return await prisma.interviewSession.delete({
      where: {
        id: sessionId,
      },
    });
  }
}
