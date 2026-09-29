const FLAGGED_CATEGORIES = new Set([
  "sexual/minors",
  "hate/threatening",
  "harassment/threatening",
  "self-harm/intent",
  "self-harm/instructions",
  "violence/graphic",
]);

type ModerationCategoryScores = Record<string, number>;

type ModerationResult = {
  flagged: boolean;
  category_scores?: ModerationCategoryScores;
};

export async function moderateInput(input: string) {
  const apiKey = process.env.OPENAI_API_KEY;

  if (!apiKey) {
    return { allowed: true, checked: false };
  }

  const response = await fetch("https://api.openai.com/v1/moderations", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: "omni-moderation-latest",
      input,
    }),
  });

  if (!response.ok) {
    return { allowed: true, checked: false };
  }

  const data = (await response.json()) as { results?: ModerationResult[] };
  const result = data.results?.[0];

  if (!result?.flagged || !result.category_scores) {
    return { allowed: true, checked: true };
  }

  const blocked = Object.entries(result.category_scores).some(
    ([category, score]) => FLAGGED_CATEGORIES.has(category) && score > 0.35
  );

  return { allowed: !blocked, checked: true };
}
