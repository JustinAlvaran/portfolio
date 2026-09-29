import "server-only";

import { neon } from "@neondatabase/serverless";

import { redactConversationText } from "@/lib/server/conversation-redaction";

const DEFAULT_RETENTION_DAYS = 30;
const MAX_RETENTION_DAYS = 90;

export type StoredConversation = {
  id: string;
  session_id: string;
  visitor_name: string;
  visitor_message: string;
  assistant_message: string;
  intent_category: string;
  created_at: Date;
};

type SaveConversationInput = {
  sessionId: string;
  visitorName: string;
  visitorMessage: string;
  assistantMessage: string;
  intentCategory: string;
};

function getDatabaseUrl() {
  return process.env.DATABASE_URL || process.env.POSTGRES_URL;
}

function getRetentionDays() {
  const parsed = Number(process.env.CONVERSATION_RETENTION_DAYS);
  if (!Number.isInteger(parsed) || parsed < 1) return DEFAULT_RETENTION_DAYS;
  return Math.min(parsed, MAX_RETENTION_DAYS);
}

async function prepareDatabase() {
  const databaseUrl = getDatabaseUrl();
  if (!databaseUrl) return null;

  const sql = neon(databaseUrl);
  await sql`
    CREATE TABLE IF NOT EXISTS portfolio_conversations (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      session_id UUID NOT NULL,
      visitor_name TEXT NOT NULL,
      visitor_message TEXT NOT NULL,
      assistant_message TEXT NOT NULL,
      intent_category TEXT NOT NULL,
      consent_version TEXT NOT NULL,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `;
  await sql`
    CREATE INDEX IF NOT EXISTS portfolio_conversations_created_at_idx
    ON portfolio_conversations (created_at DESC)
  `;
  return sql;
}

async function deleteExpired(sql: NonNullable<Awaited<ReturnType<typeof prepareDatabase>>>) {
  const retentionDays = getRetentionDays();
  await sql`DELETE FROM portfolio_conversations WHERE created_at < NOW() - (${retentionDays} * INTERVAL '1 day')`;
}

export async function saveConversation(input: SaveConversationInput) {
  const sql = await prepareDatabase();
  if (!sql) return false;

  await deleteExpired(sql);
  await sql`
    INSERT INTO portfolio_conversations (
      session_id, visitor_name, visitor_message, assistant_message,
      intent_category, consent_version
    ) VALUES (
      ${input.sessionId},
      ${redactConversationText(input.visitorName, 28)},
      ${redactConversationText(input.visitorMessage, 1000)},
      ${redactConversationText(input.assistantMessage, 6000)},
      ${input.intentCategory.slice(0, 40)},
      '2026-06-23'
    )
  `;
  return true;
}

export async function listConversations(limit = 100) {
  const sql = await prepareDatabase();
  if (!sql) return [];

  await deleteExpired(sql);
  const safeLimit = Math.min(Math.max(limit, 1), 200);
  const rows = await sql`
    SELECT id, session_id, visitor_name, visitor_message, assistant_message,
           intent_category, created_at
    FROM portfolio_conversations
    ORDER BY created_at DESC
    LIMIT ${safeLimit}
  `;
  return rows as StoredConversation[];
}

export function conversationRetentionDays() {
  return getRetentionDays();
}
