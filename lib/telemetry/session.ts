import { SessionClock } from "./clock";
import type {
  CursorSample,
  EditingEvent,
  InteractionState,
  StateTransition,
} from "./types";
import type { Condition } from "@/lib/types";
import type { CalibrationResult } from "./npoil";

/** Rolling cursor buffer window (ms). Covers the 3s tortuosity window with headroom. */
export const CURSOR_BUFFER_MS = 4000;

/** A lightweight, DEMO-ONLY entropy estimate (D5) — NOT the offline Appendix A.2 calc. */
export interface LiveEntropyEstimate {
  /** Proportion of observed state-time spent in each state (empirical π estimate). */
  stateProportions: Record<InteractionState, number>;
  /** A simple normalised entropy of those proportions, 0..1. Display only. */
  normalisedStateEntropy: number;
  /** Number of state transitions observed (a crude variety signal). */
  transitionCount: number;
}

/**
 * TelemetrySession — the ONE place all four streams write to, sharing one clock.
 *
 * Plain class (no React) so 60Hz writes never trigger re-renders; a React context
 * (TelemetryProvider) hands the instance to the tree. Held for the whole run
 * (calibration through submit).
 *
 * D5 is enforced structurally here: `stateLog` (raw transitions, the input to the
 * REAL offline Shannon entropy) and `liveEntropyEstimate` (the demo-only estimate)
 * are SEPARATE fields, populated by separate code paths — never one derived from the
 * other's function, so a discrepancy between them stays visible.
 */
export class TelemetrySession {
  readonly clock = new SessionClock();
  readonly sessionCode: string;
  condition: Condition | null = null;
  calibration: CalibrationResult | null = null;

  // Stream 1 — interaction states (entropy). Raw, correctly-precedenced (D1, D5a).
  readonly stateLog: StateTransition[] = [];

  // Stream 2 — editing events (volatility, D4).
  readonly editingEvents: EditingEvent[] = [];

  // Stream 3 — cursor samples (tortuosity, D3). Rolling buffer, last ~CURSOR_BUFFER_MS.
  readonly cursorBuffer: CursorSample[] = [];
  tortuosity: number | null = null;

  // Stream 4 — NPOIL timing.
  outputVisibleAt: number | null = null;
  submittedAt: number | null = null;
  npoilMs: number | null = null;

  // D5b — demo-only live entropy estimate, set at reveal time by its own function.
  liveEntropyEstimate: LiveEntropyEstimate | null = null;

  constructor(sessionCode?: string) {
    this.sessionCode =
      sessionCode ??
      (globalThis.crypto?.randomUUID
        ? globalThis.crypto.randomUUID()
        : `sess-${Math.floor(performance.now())}`);
  }

  // --- Run identity ----------------------------------------------------------
  setCondition(condition: Condition | null): void {
    this.condition = condition;
  }
  setCalibration(calibration: CalibrationResult | null): void {
    this.calibration = calibration;
  }

  // --- Stream 4: NPOIL timing ------------------------------------------------
  /** NPOIL start point — output first fully visible (session-clock ms). */
  markOutputVisible(at: number): void {
    this.outputVisibleAt = at;
  }
  /** NPOIL end point + computed value, at final Submit. */
  recordSubmission(submittedAt: number, npoilMs: number | null): void {
    this.submittedAt = submittedAt;
    this.npoilMs = npoilMs;
  }

  // --- Stream 1: interaction-state transitions -------------------------------
  /**
   * Record the interaction state for a frame. Only appends when the state actually
   * CHANGES, closing the previous open transition. Produces the clean transition
   * sequence the offline entropy calc consumes (Appendix A.2).
   */
  recordState(state: InteractionState, at: number): void {
    const last = this.stateLog[this.stateLog.length - 1];
    if (last && last.exitedAt === null) {
      if (last.state === state) return; // unchanged — nothing to record
      last.exitedAt = at;
    }
    this.stateLog.push({ state, enteredAt: at, exitedAt: null });
  }

  /** Close the final open transition (call when the state machine stops). */
  finalizeStates(at: number): void {
    const last = this.stateLog[this.stateLog.length - 1];
    if (last && last.exitedAt === null) last.exitedAt = at;
  }

  // --- Stream 2: editing events (used when that module is built) --------------
  addEditingEvent(event: EditingEvent): void {
    this.editingEvents.push(event);
  }

  // --- Stream 3: cursor samples (used when that module is built) --------------
  pushCursorSample(sample: CursorSample): void {
    this.cursorBuffer.push(sample);
    const cutoff = sample.at - CURSOR_BUFFER_MS;
    // Trim from the front; buffer stays ~CURSOR_BUFFER_MS long.
    while (this.cursorBuffer.length && this.cursorBuffer[0].at < cutoff) {
      this.cursorBuffer.shift();
    }
  }
}
