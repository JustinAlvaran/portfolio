import { createOpenAICompatible } from "@ai-sdk/openai-compatible";

const OPENROUTER_BASE_URL = "https://openrouter.ai/api/v1";

export function getOpenRouterApiKey() {
  return process.env.OPENROUTER_API_KEY?.trim();
}

export function getOpenRouterChatModel() {
  return process.env.OPENROUTER_CHAT_MODEL || "nvidia/nemotron-nano-9b-v2:free";
}

export function getOpenRouterRerankModel() {
  return (
    process.env.OPENROUTER_RERANK_MODEL ||
    "nvidia/llama-nemotron-rerank-vl-1b-v2:free"
  );
}

export function createOpenRouterProvider() {
  const apiKey = getOpenRouterApiKey();

  if (!apiKey) {
    throw new Error("OPENROUTER_API_KEY is required for portfolio chat.");
  }

  return createOpenAICompatible({
    name: "openrouter",
    baseURL: OPENROUTER_BASE_URL,
    apiKey,
    headers: {
      "HTTP-Referer": process.env.OPENROUTER_SITE_URL || "http://localhost:3000",
      "X-Title": process.env.OPENROUTER_SITE_NAME || "Justin Alvaran Portfolio",
    },
    includeUsage: true,
    transformRequestBody: (body) => ({
      ...body,
      reasoning: { exclude: true },
    }),
  });
}

export function openRouterHeaders() {
  const apiKey = getOpenRouterApiKey();

  if (!apiKey) {
    throw new Error("OPENROUTER_API_KEY is required for OpenRouter requests.");
  }

  return {
    Authorization: `Bearer ${apiKey}`,
    "Content-Type": "application/json",
    "HTTP-Referer": process.env.OPENROUTER_SITE_URL || "http://localhost:3000",
    "X-Title": process.env.OPENROUTER_SITE_NAME || "Justin Alvaran Portfolio",
  };
}
