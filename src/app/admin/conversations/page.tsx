import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { hasAdminSession } from "@/lib/server/admin-auth";
import { conversationRetentionDays, listConversations } from "@/lib/server/conversations";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { robots: { index: false, follow: false }, title: "Conversation inbox" };

export default async function ConversationsPage() {
  if (!(await hasAdminSession())) redirect("/admin/login");

  const conversations = await listConversations();
  const retentionDays = conversationRetentionDays();

  return (
    <main className="admin-inbox-shell">
      <header className="admin-inbox-header">
        <div>
          <span>Private portfolio workspace</span>
          <h1>Conversation inbox</h1>
          <p>{conversations.length} recent conversations. Stored for up to {retentionDays} days.</p>
        </div>
        <form action="/api/admin/logout" method="post"><button type="submit">Sign out</button></form>
      </header>

      {conversations.length === 0 ? (
        <section className="admin-empty-state">
          <h2>No saved conversations yet</h2>
          <p>Only chats where the visitor explicitly allowed storage will appear here.</p>
        </section>
      ) : (
        <section className="admin-conversation-list" aria-label="Saved chatbot conversations">
          {conversations.map((conversation) => (
            <article key={conversation.id}>
              <header>
                <div><strong>{conversation.visitor_name}</strong><span>{conversation.intent_category.replaceAll("_", " ")}</span></div>
                <time dateTime={new Date(conversation.created_at).toISOString()}>
                  {new Intl.DateTimeFormat("en-PH", { dateStyle: "medium", timeStyle: "short", timeZone: "Asia/Manila" }).format(new Date(conversation.created_at))}
                </time>
              </header>
              <div className="admin-message-pair">
                <section><span>Visitor</span><p>{conversation.visitor_message}</p></section>
                <section><span>Justin&apos;s assistant</span><p>{conversation.assistant_message}</p></section>
              </div>
            </article>
          ))}
        </section>
      )}
    </main>
  );
}
