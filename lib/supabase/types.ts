/**
 * Row shapes for the Supabase schema (PRD section 6). Mirrors schema.sql in this
 * directory. Kept separate from lib/telemetry/types.ts (the in-app session shape)
 * because a persisted row is not always a 1:1 copy of an in-memory sample, some
 * fields (session_code, computed values) are added at the write boundary.
 *
 * THREE SEPARATED STORES (paper section 4.8, non-negotiable):
 *  1. Consent & payment records - ConsentRecordRow (keyed by prolific_id + session_code)
 *  2. Pseudonymised research data - everything else here (keyed by session_code only)
 *  3. Session code <-> Prolific ID mapping - not implemented in this demo build (no
 *     deletion-request UI exists yet; the paper's deletion path is via emailing the
 *     researcher, already covered in the transcribed PIS/debrief text)
 */

import type { Condition } from "@/lib/types";

export interface SessionRow {
  session_code: string;
  condition: Condition;
  created_at: string;
  completed_at: string | null;
  status:
    | "consented"
    | "in_calibration"
    | "in_task"
    | "post_task"
    | "debriefed"
    | "completed"
    | "withdrawn";
}

/** Separate store. Prolific ID is a stub in this build (PRD section 8.8). */
export interface ConsentRecordRow {
  prolific_id: string | null;
  session_code: string;
  all_statements_agreed: boolean;
  consent_timestamp: string;
}

export interface CalibrationEventRow {
  session_code: string;
  abstract_word_count: number;
  time_to_continue_ms: number;
  reading_velocity_ms_per_word: number;
}

export interface TaskEventRow {
  session_code: string;
  output_word_count: number;
  output_visible_at_ms: number;
  submitted_at_ms: number;
  npoil_ms: number | null;
}

export interface InteractionStateLogRow {
  session_code: string;
  state: "Idle" | "Hovering" | "Modifying" | "Confirming";
  entered_at_ms: number;
  exited_at_ms: number | null;
}

export interface EditingEventRow {
  session_code: string;
  event_type: "corrective" | "additive" | "mandatory_click";
  at_ms: number;
}

/** Only the pre-submission tortuosity window is stored, not the full session (PRD §6). */
export interface CursorSampleRow {
  session_code: string;
  x: number;
  y: number;
  at_ms: number;
}

export interface NasaTlxResponseRow {
  session_code: string;
  mental_demand: number;
  physical_demand: number;
  temporal_demand: number;
  performance: number;
  effort: number;
  frustration: number;
}

/** Single free-text field per PRD section 8 resolved decision 6. */
export interface CitResponseRow {
  session_code: string;
  reflection_text: string;
}

export interface DeletionRequestRow {
  prolific_id: string;
  requested_at: string;
  fulfilled_at: string | null;
}
