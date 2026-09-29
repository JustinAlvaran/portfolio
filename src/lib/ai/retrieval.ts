import { ragDocuments, type RagDocument } from "@/lib/ai/rag-documents";
import { getOpenRouterRerankModel, openRouterHeaders } from "@/lib/ai/openrouter";

type RetrievedDocument = RagDocument & {
  score: number;
  rerankScore?: number;
};

type RerankResponse = {
  results?: Array<{
    index?: number;
    relevance_score?: number;
    score?: number;
  }>;
};

const STOP_WORDS = new Set([
  "a",
  "an",
  "and",
  "are",
  "as",
  "at",
  "be",
  "can",
  "for",
  "from",
  "has",
  "how",
  "i",
  "in",
  "is",
  "it",
  "of",
  "on",
  "or",
  "the",
  "to",
  "what",
  "with",
  "you",
]);

function tokenize(value: string) {
  return value
    .toLowerCase()
    .replaceAll(/[^a-z0-9+#.]+/g, " ")
    .split(/\s+/)
    .filter((token) => token.length > 1 && !STOP_WORDS.has(token));
}

function lexicalScore(queryTokens: string[], document: RagDocument) {
  const titleTokens = tokenize(document.title);
  const contentTokens = tokenize(document.content);
  const sourceTokens = tokenize(document.source);
  const haystack = new Set([...titleTokens, ...contentTokens, ...sourceTokens]);

  return queryTokens.reduce((score, token) => {
    if (titleTokens.includes(token)) {
      return score + 4;
    }

    if (haystack.has(token)) {
      return score + 1.7;
    }

    const fuzzyHit = contentTokens.some(
      (contentToken) => contentToken.includes(token) || token.includes(contentToken)
    );

    return fuzzyHit ? score + 0.5 : score;
  }, 0);
}

function fallbackRetrieve(query: string, limit: number): RetrievedDocument[] {
  const queryTokens = tokenize(query);

  if (queryTokens.length === 0) {
    return ragDocuments.slice(0, limit).map((document) => ({ ...document, score: 0 }));
  }

  return ragDocuments
    .map((document) => ({
      ...document,
      score: lexicalScore(queryTokens, document),
    }))
    .sort((left, right) => right.score - left.score)
    .slice(0, limit);
}

async function rerankWithOpenRouter(query: string, documents: RetrievedDocument[]) {
  if (!process.env.OPENROUTER_API_KEY) {
    return documents;
  }

  try {
    const response = await fetch("https://openrouter.ai/api/v1/rerank", {
      method: "POST",
      headers: openRouterHeaders(),
      signal: AbortSignal.timeout(4000),
      body: JSON.stringify({
        model: getOpenRouterRerankModel(),
        query,
        documents: documents.map(
          (document) => `${document.title}\nSource: ${document.source}\n${document.content}`
        ),
        top_n: Math.min(5, documents.length),
      }),
    });

    if (!response.ok) {
      return documents;
    }

    const data = (await response.json()) as RerankResponse;

    if (!data.results?.length) {
      return documents;
    }

    const rankedDocuments: Array<RetrievedDocument | null> = data.results.map((result) => {
        const index = result.index ?? -1;
        const document = documents[index];

        if (!document) {
          return null;
        }

        return {
          ...document,
          rerankScore: result.relevance_score ?? result.score,
        };
      });

    return rankedDocuments.filter(
      (document): document is RetrievedDocument => Boolean(document)
    );
  } catch {
    return documents;
  }
}

export async function retrievePortfolioContext(query: string) {
  const candidates = fallbackRetrieve(query, 10);
  const reranked = await rerankWithOpenRouter(query, candidates);
  const queryTokens = new Set(tokenize(query));
  const requiredCategories = new Set<RagDocument["category"]>();

  if (queryTokens.has("project") || queryTokens.has("projects") || queryTokens.has("built")) {
    requiredCategories.add("project");
  }

  if (
    queryTokens.has("stack") ||
    queryTokens.has("skill") ||
    queryTokens.has("skills") ||
    queryTokens.has("strongest")
  ) {
    requiredCategories.add("skills");
  }

  const requiredDocuments = candidates.filter((document) =>
    requiredCategories.has(document.category)
  );
  const selectedMap = new Map<string, RetrievedDocument>();

  [...requiredDocuments, ...reranked].forEach((document) => {
    if (selectedMap.size < 6) {
      selectedMap.set(document.id, document);
    }
  });

  const selected = Array.from(selectedMap.values()).slice(0, 6);

  return {
    documents: selected,
    context: selected
      .map(
        (document, index) =>
          `[${index + 1}] ${document.title}\nCategory: ${document.category}\nSource: ${document.source}\n${document.content}`
      )
      .join("\n\n"),
  };
}
