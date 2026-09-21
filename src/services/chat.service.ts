import { GoogleGenAI } from "@google/genai";
import { getGeminiApiKey } from "@/lib/gemini";
import { ChatRequestBody } from "@/types/chat";

const SYSTEM_PROMPT =
  "You are an expert Career Coach, Resume Advisor, and Technical Interview Strategist. Provide concise, direct, and actionable advice. Keep responses under 200 words unless explicitly asked for a detailed breakdown.";

export class ChatService {
  /**
   * Generates a streaming response for the chat conversation.
   */
  static async streamChat(body: ChatRequestBody): Promise<ReadableStream<Uint8Array>> {
    const rawMessages = body.messages || [];

    // Optimization: Chat history truncation - send only the last 6 messages to keep token usage low
    const truncatedMessages = rawMessages.slice(-6);

    const apiKey = getGeminiApiKey();
    const encoder = new TextEncoder();

    if (!apiKey) {
      console.warn("No GEMINI_API_KEY detected. Using simulated streaming response.");
      return this.createDemoStream(truncatedMessages);
    }

    try {
      const ai = new GoogleGenAI({ apiKey });

      // Transform messages to Gemini format (user -> 'user', assistant -> 'model')
      const formattedContents = truncatedMessages.map((msg) => ({
        role: msg.role === "assistant" ? "model" : "user",
        parts: [{ text: msg.content }],
      }));

      // In case the last message wasn't user, append a default prompt
      if (formattedContents.length === 0) {
        formattedContents.push({
          role: "user",
          parts: [{ text: "Hello! How can you assist my career today?" }],
        });
      }

      const responseStream = await ai.models.generateContentStream({
        model: "gemini-2.5-flash",
        contents: formattedContents,
        config: {
          systemInstruction: SYSTEM_PROMPT,
        },
      });

      return new ReadableStream({
        async start(controller) {
          try {
            for await (const chunk of responseStream) {
              const text = chunk.text || "";
              if (text) {
                controller.enqueue(encoder.encode(text));
              }
            }
            controller.close();
          } catch (err) {
            console.error("Error during stream iteration:", err);
            controller.error(err);
          }
        },
      });
    } catch (error: any) {
      console.error("Gemini stream initialization failed:", error);
      return this.createDemoStream(truncatedMessages);
    }
  }

  /**
   * Provides a smooth simulated stream if offline or no API key is supplied.
   */
  private static createDemoStream(
    messages: Array<{ role: string; content: string }>
  ): ReadableStream<Uint8Array> {
    const lastUserMessage =
      messages[messages.length - 1]?.content.toLowerCase() || "";

    let reply =
      "I'm here to help you optimize your resume, prepare for technical & behavioral interviews, and navigate your tech career roadmap. What specific role or challenge are you focusing on?";

    if (lastUserMessage.includes("resume") || lastUserMessage.includes("review")) {
      reply =
        "Here are 3 quick high-impact resume rules:\n\n1. **Google XYZ Formula:** Frame bullets as *Accomplished [X], as measured by [Y], by doing [Z]*.\n2. **Metrics Over Duties:** Replace 'worked on APIs' with 'engineered 12 microservices reducing latency by 35%'.\n3. **Keyword Alignment:** Match the exact tool names (e.g. Next.js, Redis, Docker) from your target job description.\n\nWould you like me to rewrite a specific bullet point for you?";
    } else if (lastUserMessage.includes("interview") || lastUserMessage.includes("prep")) {
      reply =
        "For technical & behavioral interviews, focus on the **STAR framework** (Situation, Task, Action, Result) with heavy emphasis on **quantifiable Action & Result**.\n\nFor technical rounds:\n- Clarify requirements & edge cases upfront.\n- Communicate trade-offs (e.g., Space vs. Time complexity).\n- Walk through your code with sample inputs.\n\nWhich company or role are you interviewing for?";
    } else if (lastUserMessage.includes("roadmap") || lastUserMessage.includes("career")) {
      reply =
        "To progress from Mid-Level to Staff/Lead Engineer:\n\n- **Deepen System Design:** Master distributed caching, event-driven architectures (Kafka), and database sharding.\n- **Drive Business Impact:** Tie technical decisions directly to revenue or latency metrics.\n- **Technical Leadership:** Lead RFC design reviews and cross-team architectural standards.\n\nWhat is your current tech stack?";
    } else if (lastUserMessage.includes("salary") || lastUserMessage.includes("offer")) {
      reply =
        "When negotiating an offer:\n\n1. **Never give the first number:** Ask for the approved salary band for the level.\n2. **Leverage Total Compensation:** Negotiate signing bonuses or equity refreshers if base salary is capped.\n3. **Use Multiple Anchors:** Cite verified market compensation data and competing timelines.";
    }

    const encoder = new TextEncoder();
    const words = reply.split(" ");

    return new ReadableStream({
      async start(controller) {
        for (let i = 0; i < words.length; i++) {
          const chunk = (i === 0 ? "" : " ") + words[i];
          controller.enqueue(encoder.encode(chunk));
          // Small realistic typewriter delay
          await new Promise((resolve) => setTimeout(resolve, 35));
        }
        controller.close();
      },
    });
  }
}
