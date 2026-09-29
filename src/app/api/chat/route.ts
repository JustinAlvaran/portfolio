import { convertToModelMessages, streamText, type UIMessage } from "ai";
import { z } from "zod";

import { createPortfolioChatModel } from "@/lib/ai/chat-provider";
import { buildPortfolioSystemPrompt } from "@/lib/ai/portfolio-rules";
import { retrievePortfolioContext } from "@/lib/ai/retrieval";
import { moderateInput } from "@/lib/moderation";
import { limitChat } from "@/lib/rate-limit";
import { verifyRecaptchaToken } from "@/lib/recaptcha";
import { saveConversation } from "@/lib/server/conversations";

export const maxDuration = 60;
export const runtime = "nodejs";

const requestSchema = z.object({
  messages: z.array(z.custom<UIMessage>()).max(12),
  recaptchaToken: z.string().optional(),
  visitorName: z.string().max(28).optional(),
  storageConsent: z.boolean().optional().default(false),
  chatSessionId: z.string().uuid().optional(),
  intentCategory: z.string().regex(/^[a-z_]{2,40}$/).optional().default("other"),
});

function getClientIdentifier(request: Request) {
  const forwardedFor = request.headers.get("x-forwarded-for");
  const realIp = request.headers.get("x-real-ip");
  const session = request.headers.get("x-vercel-id");
  return forwardedFor?.split(",")[0]?.trim() || realIp || session || "local";
}

function getMessageText(message: UIMessage) {
  return message.parts
    .filter((part) => part.type === "text")
    .map((part) => part.text)
    .join("\n")
    .trim();
}

export async function POST(request: Request) {
  const identifier = getClientIdentifier(request);
  const limit = await limitChat(identifier);

  if (!limit.success) {
    return Response.json(
      {
        error: "Rate limit reached. Please try again in a few minutes.",
      },
      {
        status: 429,
        headers: {
          "X-RateLimit-Limit": String(limit.limit),
          "X-RateLimit-Remaining": String(limit.remaining),
          "X-RateLimit-Reset": String(limit.reset),
        },
      }
    );
  }

  const parsed = requestSchema.safeParse(await request.json());

  if (!parsed.success) {
    return Response.json({ error: "Invalid chat request." }, { status: 400 });
  }

  const recaptcha = await verifyRecaptchaToken(parsed.data.recaptchaToken);

  if (!recaptcha.success) {
    return Response.json(
      { error: "reCAPTCHA verification failed. Please try again." },
      { status: 403 }
    );
  }

  const latestUserMessage = [...parsed.data.messages]
    .reverse()
    .find((message) => message.role === "user");
  const latestText = latestUserMessage ? getMessageText(latestUserMessage) : "";

  if (!latestText || latestText.length > 1000) {
    return Response.json(
      { error: "Please keep the message between 1 and 1000 characters." },
      { status: 400 }
    );
  }

  const moderation = await moderateInput(latestText);

  if (!moderation.allowed) {
    return Response.json(
      { error: "That message is outside the assistant safety policy." },
      { status: 400 }
    );
  }

  const retrieval = await retrievePortfolioContext(latestText);
  const result = streamText({
    model: createPortfolioChatModel(),
    system: buildPortfolioSystemPrompt(retrieval.context),
    messages: await convertToModelMessages(parsed.data.messages),
    maxOutputTokens: 900,
    temperature: 0.3,
    maxRetries: 1,
    timeout: { totalMs: 55_000, chunkMs: 30_000 },
    onError: ({ error }) => {
      console.error("Portfolio chat provider error", error);
    },
    onFinish: async ({ text }) => {
      if (!parsed.data.storageConsent || !parsed.data.chatSessionId || !parsed.data.visitorName || !text) {
        return;
      }

      try {
        await saveConversation({
          assistantMessage: text,
          intentCategory: parsed.data.intentCategory,
          sessionId: parsed.data.chatSessionId,
          visitorMessage: latestText,
          visitorName: parsed.data.visitorName,
        });
      } catch {
        console.error("Conversation storage failed");
      }
    },
  });

  return result.toUIMessageStreamResponse({
    headers: {
      "X-RateLimit-Limit": String(limit.limit),
      "X-RateLimit-Remaining": String(limit.remaining),
      "X-RateLimit-Reset": String(limit.reset),
    },
  });
}
