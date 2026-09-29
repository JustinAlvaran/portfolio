import { NextResponse } from "next/server";

import { ADMIN_COOKIE_NAME, adminCookieOptions } from "@/lib/server/admin-auth";
import { isSameOrigin } from "@/lib/server/request-security";

export async function POST(request: Request) {
  if (!isSameOrigin(request)) return new NextResponse("Forbidden", { status: 403 });

  const response = NextResponse.redirect(new URL("/admin/login", request.url), 303);
  response.cookies.set(ADMIN_COOKIE_NAME, "", { ...adminCookieOptions, maxAge: 0 });
  return response;
}
