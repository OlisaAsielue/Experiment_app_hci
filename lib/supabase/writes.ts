import "server-only";
import { getSupabaseClient } from "./client";
import type {
  SessionRow,
  ConsentRecordRow,
  CalibrationEventRow,
  TaskEventRow,
  InteractionStateLogRow,
  EditingEventRow,
  CursorSampleRow,
  NasaTlxResponseRow,
  CitResponseRow,
} from "./types";

/**
 * One function per PRD section 6 table. EVERY function calls getSupabaseClient()
 * first and returns { persisted: false } immediately if it is null, no query is
 * ever built or sent when PERSIST_DATA is off. This file never imports
 * createClient directly and never holds a client of its own, client.ts is the
 * only place that exists, these functions only ever borrow it.
 */

type WriteResult = { persisted: boolean; error?: string };

export async function writeSession(row: SessionRow): Promise<WriteResult> {
  const client = getSupabaseClient();
  if (!client) return { persisted: false };
  const { error } = await client.from("sessions").upsert(row, {
    onConflict: "session_code",
  });
  return error ? { persisted: false, error: error.message } : { persisted: true };
}

/** Separate store from the research data (paper section 4.8). */
export async function writeConsentRecord(
  row: ConsentRecordRow,
): Promise<WriteResult> {
  const client = getSupabaseClient();
  if (!client) return { persisted: false };
  const { error } = await client.from("consent_records").insert(row);
  return error ? { persisted: false, error: error.message } : { persisted: true };
}

export async function writeCalibrationEvent(
  row: CalibrationEventRow,
): Promise<WriteResult> {
  const client = getSupabaseClient();
  if (!client) return { persisted: false };
  const { error } = await client.from("calibration_events").insert(row);
  return error ? { persisted: false, error: error.message } : { persisted: true };
}

export async function writeTaskEvent(row: TaskEventRow): Promise<WriteResult> {
  const client = getSupabaseClient();
  if (!client) return { persisted: false };
  const { error } = await client.from("task_events").insert(row);
  return error ? { persisted: false, error: error.message } : { persisted: true };
}

/** Bulk insert: one call per submission, many rows (the whole state-transition log). */
export async function writeInteractionStateLog(
  rows: InteractionStateLogRow[],
): Promise<WriteResult> {
  const client = getSupabaseClient();
  if (!client) return { persisted: false };
  if (rows.length === 0) return { persisted: true };
  const { error } = await client.from("interaction_state_log").insert(rows);
  return error ? { persisted: false, error: error.message } : { persisted: true };
}

export async function writeEditingEvents(
  rows: EditingEventRow[],
): Promise<WriteResult> {
  const client = getSupabaseClient();
  if (!client) return { persisted: false };
  if (rows.length === 0) return { persisted: true };
  const { error } = await client.from("editing_events").insert(rows);
  return error ? { persisted: false, error: error.message } : { persisted: true };
}

/** Only the pre-submission tortuosity window is written, not the full buffer (PRD §6). */
export async function writeCursorSamples(
  rows: CursorSampleRow[],
): Promise<WriteResult> {
  const client = getSupabaseClient();
  if (!client) return { persisted: false };
  if (rows.length === 0) return { persisted: true };
  const { error } = await client.from("cursor_samples").insert(rows);
  return error ? { persisted: false, error: error.message } : { persisted: true };
}

export async function writeNasaTlxResponse(
  row: NasaTlxResponseRow,
): Promise<WriteResult> {
  const client = getSupabaseClient();
  if (!client) return { persisted: false };
  const { error } = await client.from("nasa_tlx_responses").insert(row);
  return error ? { persisted: false, error: error.message } : { persisted: true };
}

export async function writeCitResponse(
  row: CitResponseRow,
): Promise<WriteResult> {
  const client = getSupabaseClient();
  if (!client) return { persisted: false };
  const { error } = await client.from("cit_responses").insert(row);
  return error ? { persisted: false, error: error.message } : { persisted: true };
}
