type RecaptchaResponse = {
  action?: string;
  challenge_ts?: string;
  "error-codes"?: string[];
  hostname?: string;
  score?: number;
  success: boolean;
};

const RECAPTCHA_VERIFY_URL = "https://www.google.com/recaptcha/api/siteverify";
const RECAPTCHA_ACTION = "portfolio_chat";

export async function verifyRecaptchaToken(token: string | undefined) {
  const secret = process.env.RECAPTCHA_SECRET_KEY;

  if (!secret) {
    return { enabled: false, success: true };
  }

  if (!token) {
    return { enabled: true, success: false };
  }

  const minimumScore = Number(process.env.RECAPTCHA_MIN_SCORE ?? "0.5");
  const body = new URLSearchParams({
    response: token,
    secret,
  });

  const response = await fetch(RECAPTCHA_VERIFY_URL, {
    body,
    method: "POST",
  });
  const result = (await response.json()) as RecaptchaResponse;

  return {
    enabled: true,
    success:
      result.success &&
      result.action === RECAPTCHA_ACTION &&
      typeof result.score === "number" &&
      result.score >= minimumScore,
  };
}
