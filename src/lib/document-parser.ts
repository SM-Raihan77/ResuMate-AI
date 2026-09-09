import { extractText, getDocumentProxy } from "unpdf";
import mammoth from "mammoth";

/**
 * Extracts plain text from an uploaded file Buffer / ArrayBuffer based on its MIME type or extension.
 */
export async function extractTextFromFile(
  fileBuffer: Buffer | ArrayBuffer | Uint8Array,
  fileName: string,
  mimeType?: string
): Promise<string> {
  const extension = fileName.split(".").pop()?.toLowerCase() || "";
  const buffer = Buffer.isBuffer(fileBuffer)
    ? fileBuffer
    : Buffer.from(new Uint8Array(fileBuffer));

  let extracted = "";

  try {
    if (
      mimeType === "application/pdf" ||
      extension === "pdf"
    ) {
      const uint8Array = new Uint8Array(buffer);
      const pdf = await getDocumentProxy(uint8Array);
      const { text } = await extractText(pdf, { mergePages: true });
      extracted = Array.isArray(text) ? text.join("\n") : text;
    } else if (
      mimeType ===
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
      mimeType === "application/msword" ||
      extension === "docx"
    ) {
      const result = await mammoth.extractRawText({ buffer });
      extracted = result.value || "";
    } else {
      // Treat as plain text UTF-8
      extracted = buffer.toString("utf-8");
    }
  } catch (error: any) {
    console.error(`Error extracting text from ${fileName}:`, error);
    throw new Error(
      `Failed to parse document "${fileName}". Please ensure the file is not corrupted or password-protected.`
    );
  }

  // Clean and normalize text
  return cleanExtractedText(extracted);
}

/**
 * Normalizes and strips unwanted artifacts or extreme whitespace from extracted resume text.
 */
export function cleanExtractedText(rawText: string): string {
  if (!rawText) return "";

  return rawText
    // Remove null bytes and non-printable control characters (except tabs and newlines)
    .replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, "")
    // Normalize Windows/Mac line endings
    .replace(/\r\n/g, "\n")
    .replace(/\r/g, "\n")
    // Replace multiple spaces with a single space
    .replace(/[ \t]+/g, " ")
    // Replace 3+ consecutive newlines with double newlines
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}
