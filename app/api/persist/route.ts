import { NextResponse } from "next/server";
import { PERSIST_DATA } from "@/lib/flags";
import { insertRows } from "@/lib/supabase/writes";

/**
 * POST /api/persist - the ONLY endpoint the browser ever talks to for persistence.
 * The browser never holds Supabase credentials and never talks to Supabase directly
 * (server-side-only persistence); it POSTs an event here and this server-only route
 * decides what happens to it.
 *
 * The PERSIST_DATA check below is a fast defensive path so an off demo never even
 * parses the body, but it is NOT the sole safety mechanism: insertRows() calls
 * getSupabaseClient(), which returns null before ever constructing a client when the
 * flag is off (see lib/supabase/client.ts). Removing the check below would not open a
 * write path, only remove an optimisation.
 */

/** The tables the client is allowed to write to. Sole gate on the `table` value. */
const ALLOWED_TABLES = new Set([
  "sessions",
  "consent_records",
  "calibration_events",
  "task_events",
  "interaction_state_log",
  "editing_events",
  "cursor_samples",
  "nasa_tlx_responses",
  "cit_responses",
]);

export async function POST(request: Request) {
  if (!PERSIST_DATA) {
    return NextResponse.json({ persisted: false });
  }

  let body: { table?: unknown; data?: unknown };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "invalid JSON" }, { status: 400 });
  }

  const { table, data } = body;
  if (typeof table !== "string" || !ALLOWED_TABLES.has(table)) {
    return NextResponse.json({ error: "unknown table" }, { status: 400 });
  }

  try {
    // `sessions` is the only upsert (a run is created then updated); the rest insert.
    const result = await insertRows(
      table,
      data,
      table === "sessions" ? { upsertOn: "session_code" } : undefined,
    );
    return NextResponse.json(result);
  } catch (err) {
    return NextResponse.json(
      { persisted: false, error: err instanceof Error ? err.message : String(err) },
      { status: 500 },
    );
  }
}
