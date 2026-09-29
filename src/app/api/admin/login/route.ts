import { NextResponse } from "next/server";
import { z } from "zod";

import {
  ADMIN_COOKIE_NAME,
  adminCookieOptions,
  createAdminSessionToken,
  verifyAdminPassword,
} from "@/lib/server/admin-auth";
import { isSameOrigin } from "@/lib/server/request-security";

export const runtime = "nodejs";

const loginSchema = z.object({ password: z.string().min(1).max(256) });
const attempts = new Map<string, { count: number; reset: number }>();

function isRateLimited(request: Request) {
  const key = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "local";
  const now = Date.now();
  const current = attempts.get(key);
  if (!current || current.reset < now) {
    attempts.set(key, { count: 1, reset: now + 15 * 60 * 1000 });
    return false;
  }
  current.count += 1;
  return current.count > 8;
}

export async function POST(request: Request) {
  if (!isSameOrigin(request)) return new NextResponse("Forbidden", { status: 403 });
  if (isRateLimited(request)) return new NextResponse("Too many attempts", { status: 429 });

  const formData = await request.formData();
  const parsed = loginSchema.safeParse({ password: formData.get("password") });
  if (!parsed.success || !verifyAdminPassword(parsed.data.password)) {
    return NextResponse.redirect(new URL("/admin/login?error=invalid", request.url), 303);
  }

  const response = NextResponse.redirect(new URL("/admin/conversations", request.url), 303);
  response.cookies.set(ADMIN_COOKIE_NAME, createAdminSessionToken(), adminCookieOptions);
  return response;
}
