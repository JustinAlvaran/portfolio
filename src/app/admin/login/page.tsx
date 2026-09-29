import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { hasAdminSession } from "@/lib/server/admin-auth";

export const metadata: Metadata = { robots: { index: false, follow: false }, title: "Admin login" };

export default async function AdminLoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  if (await hasAdminSession()) redirect("/admin/conversations");
  const { error } = await searchParams;

  return (
    <main className="admin-auth-shell">
      <section className="admin-auth-panel">
        <span>Private portfolio workspace</span>
        <h1>Conversation inbox</h1>
        <p>Sign in to review consented, redacted chatbot conversations.</p>
        <form action="/api/admin/login" method="post">
          <label htmlFor="password">Admin password</label>
          <input autoComplete="current-password" id="password" name="password" required type="password" />
          {error && <p className="admin-form-error">That password was not accepted.</p>}
          <button type="submit">Sign in</button>
        </form>
      </section>
    </main>
  );
}
