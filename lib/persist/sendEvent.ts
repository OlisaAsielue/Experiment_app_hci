/**
 * persistEvent - the ONLY thing client code calls to (attempt to) persist
 * anything. Client-safe: no Supabase import, no credentials, nothing this file
 * could leak even if it wanted to. It always POSTs; whether anything is
 * actually written is decided entirely server-side by PERSIST_DATA
 * (lib/flags.ts) and enforced structurally in lib/supabase/client.ts. The
 * client's behaviour does not change based on the flag, only the server's does.
 *
 * Best-effort: errors are swallowed. Not-stored mode is this apparatus's
 * default and only currently-live mode, a failed or no-op network call must
 * never break the participant-facing UI.
 */
export type PersistTable =
  | "sessions"
  | "consent_records"
  | "calibration_events"
  | "task_events"
  | "interaction_state_log"
  | "editing_events"
  | "cursor_samples"
  | "nasa_tlx_responses"
  | "cit_responses";

export async function persistEvent(table: PersistTable, data: unknown): Promise<void> {
  try {
    await fetch("/api/persist", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ table, data }),
    });
  } catch {
    // Best-effort; see file header.
  }
}
