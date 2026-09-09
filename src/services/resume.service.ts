import { extractTextFromFile } from "@/lib/document-parser";
import { analyzeResumeWithGemini, getGeminiApiKey } from "@/lib/gemini";
import { ResumeAnalysisResult } from "@/types/analyzer";

export interface AnalyzeResumeServiceParams {
  file?: {
    buffer: Buffer | ArrayBuffer;
    fileName: string;
    mimeType?: string;
    size?: number;
  };
  resumeText?: string;
  jobDescription?: string;
}

export interface AnalyzeResumeServiceResult {
  success: boolean;
  sourceFileName: string;
  hasApiKey: boolean;
  data: ResumeAnalysisResult;
}

export class ResumeService {
  /**
   * Analyzes an uploaded resume document or raw text against an optional Job Description.
   */
  static async analyzeResume(
    params: AnalyzeResumeServiceParams
  ): Promise<AnalyzeResumeServiceResult> {
    let extractedText = "";
    let sourceFileName = "Pasted Text";

    // 1. Extract text from uploaded document file if present
    if (params.file) {
      sourceFileName = params.file.fileName;
      if (params.file.size && params.file.size > 10 * 1024 * 1024) {
        throw new Error("File size exceeds 10MB limit. Please upload a smaller file.");
      }

      extractedText = await extractTextFromFile(
        params.file.buffer,
        params.file.fileName,
        params.file.mimeType
      );
    } else if (params.resumeText && params.resumeText.trim().length > 0) {
      extractedText = params.resumeText.trim();
    }

    if (!extractedText || extractedText.trim().length < 50) {
      throw new Error(
        "Unable to extract sufficient resume content to analyze. Please provide at least 50 characters of resume text."
      );
    }

    // 2. Execute AI ATS evaluation with Google Gemini
    const analysis = await analyzeResumeWithGemini(
      extractedText,
      params.jobDescription?.trim()
    );

    return {
      success: true,
      sourceFileName,
      hasApiKey: Boolean(getGeminiApiKey()),
      data: analysis,
    };
  }
}
