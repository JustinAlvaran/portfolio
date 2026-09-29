const EMAIL_PATTERN = /\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b/gi;
const PHONE_PATTERN = /(?<!\d)(?:\+?\d[\d\s().-]{7,}\d)(?!\d)/g;
const SECRET_PATTERN = /\b(?:sk|gsk|csk|pk|api)[-_][A-Za-z0-9_-]{16,}\b/gi;
const LABELED_SECRET_PATTERN = /\b(password|passcode|secret|api[_ -]?key|token)\s*[:=]\s*\S+/gi;

export function redactConversationText(value: string, maxLength: number) {
  return value
    .slice(0, maxLength)
    .replace(EMAIL_PATTERN, "[email redacted]")
    .replace(PHONE_PATTERN, "[phone redacted]")
    .replace(SECRET_PATTERN, "[credential redacted]")
    .replace(LABELED_SECRET_PATTERN, "$1: [credential redacted]")
    .trim();
}
