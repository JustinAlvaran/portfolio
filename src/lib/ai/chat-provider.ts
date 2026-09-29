import { createOpenAICompatible } from "@ai-sdk/openai-compatible";

import {
  createOpenRouterProvider,
  getOpenRouterChatModel,
} from "@/lib/ai/openrouter";

function normalizedBaseUrl(url: string) {
  return url.replace(/\/$/, "");
}

export function createPortfolioChatModel() {
  const routerBaseUrl = process.env.AI_ROUTER_BASE_URL?.trim();

  if (!routerBaseUrl) {
    return createOpenRouterProvider().chatModel(getOpenRouterChatModel());
  }

  const routerApiKey = process.env.AI_ROUTER_API_KEY?.trim();
  const routerModel = process.env.AI_ROUTER_CHAT_MODEL?.trim();

  if (!routerApiKey || !routerModel) {
    throw new Error(
      "AI_ROUTER_API_KEY and AI_ROUTER_CHAT_MODEL are required when AI_ROUTER_BASE_URL is configured.",
    );
  }

  const router = createOpenAICompatible({
    name: "9router",
    baseURL: normalizedBaseUrl(routerBaseUrl),
    apiKey: routerApiKey,
    includeUsage: true,
  });

  return router.chatModel(routerModel);
}
