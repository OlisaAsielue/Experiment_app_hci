import "server-only";
import { getSupabaseClient } from "./client";

/**
 * The SINGLE server-side write path. Every persisted row goes through here.
 *
 * When PERSIST_DATA is off, getSupabaseClient() returns null before any client is
 * ever constructed (the structural gate in client.ts), so this returns
 * {persisted:false} without building a query - identical behaviour to before this
 * was collapsed from nine per-table functions. This file never imports createClient
 * and never holds a client of its own; client.ts is the only place one exists.
 *
 * `sessions` upserts on session_code (a run can be created then updated); every other
 * table inserts. The caller (app/api/persist/route.ts) validates the table name
 * against its ALLOWED_TABLES allow-list before calling this.
 */

export type WriteResult = { persisted: boolean; error?: string };

export async function insertRows(
  table: string,
  rows: unknown,
  opts?: { upsertOn?: string },
): Promise<WriteResult> {
  const client = getSupabaseClient();
  if (!client) return { persisted: false };

  const payload = Array.isArray(rows) ? rows : [rows];
  if (payload.length === 0) return { persisted: true };

  const query = opts?.upsertOn
    ? client.from(table).upsert(payload, { onConflict: opts.upsertOn })
    : client.from(table).insert(payload);

  const { error } = await query;
  return error ? { persisted: false, error: error.message } : { persisted: true };
}
