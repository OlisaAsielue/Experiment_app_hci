import { NextResponse } from "next/server";
import { PERSIST_DATA } from "@/lib/flags";
import {
  writeSession,
  writeConsentRecord,
  writeCalibrationEvent,
  writeTaskEvent,
  writeInteractionStateLog,
  writeEditingEvents,
  writeCursorSamples,
  writeNasaTlxResponse,
  writeCitResponse,
} from "@/lib/supabase/writes";

/**
 * POST /api/persist - the ONLY endpoint the browser ever talks to for
 * persistence. The browser never holds Supabase credentials and never talks to
 * Supabase directly (decisions.md Decision 8); it POSTs an event here and this
 * server-only route decides what happens to it.
 *
 * The PERSIST_DATA check below is a fast defensive path, useful so an off demo
 * never even parses the body, but it is NOT the sole safety mechanism: every
 * writer in lib/supabase/writes.ts calls getSupabaseClient(), which itself
 * returns null before ever constructing a client when the flag is off (see
 * lib/supabase/client.ts). Removing the check below would not open a write
 * path, it would only remove an optimisation.
 */
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
    const result = await dispatch(table, data);
    return NextResponse.json(result);
  } catch (err) {
    return NextResponse.json(
      { persisted: false, error: err instanceof Error ? err.message : String(err) },
      { status: 500 },
    );
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function dispatch(table: string, data: any) {
  switch (table) {
    case "sessions":
      return writeSession(data);
    case "consent_records":
      return writeConsentRecord(data);
    case "calibration_events":
      return writeCalibrationEvent(data);
    case "task_events":
      return writeTaskEvent(data);
    case "interaction_state_log":
      return writeInteractionStateLog(data);
    case "editing_events":
      return writeEditingEvents(data);
    case "cursor_samples":
      return writeCursorSamples(data);
    case "nasa_tlx_responses":
      return writeNasaTlxResponse(data);
    case "cit_responses":
      return writeCitResponse(data);
    default:
      // Unreachable: `table` is already validated against ALLOWED_TABLES above.
      throw new Error(`unhandled table: ${table}`);
  }
}
