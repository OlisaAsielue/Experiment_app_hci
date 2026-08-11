import { SessionClock } from "./clock";
import type {
  CursorSample,
  EditingEvent,
  InteractionState,
  StateTransition,
} from "./types";
import type { Condition } from "@/lib/types";
import type { CalibrationResult } from "./npoil";
import type { LiveActivitySwitching } from "./liveEntropy";

/** Rolling cursor buffer window (ms). Covers the 3s tortuosity window with headroom. */
export const CURSOR_BUFFER_MS = 4000;


/**
 * TelemetrySession - the ONE place all four streams write to, sharing one clock.
 *
 * Plain class (no React) so 60Hz writes never trigger re-renders; a React context
 * (TelemetryProvider) hands the instance to the tree. Held for the whole run
 * (calibration through submit).
 *
 * The two-computation separation is enforced structurally here: `stateLog` (raw
 * REAL offline Shannon entropy) and `liveEntropyEstimate` (the demo-only estimate)
 * are SEPARATE fields, populated by separate code paths - never one derived from the
 * other's function, so a discrepancy between them stays visible.
 */
export class TelemetrySession {
  readonly clock = new SessionClock();
  readonly sessionCode: string;
  condition: Condition | null = null;
  calibration: CalibrationResult | null = null;

  // Stream 1 - interaction states (entropy). Raw, correctly-precedenced.
  readonly stateLog: StateTransition[] = [];

  // Stream 2 - editing events (volatility).
  readonly editingEvents: EditingEvent[] = [];

  // Stream 3 - cursor samples (tortuosity). Rolling buffer, last ~CURSOR_BUFFER_MS.
  readonly cursorBuffer: CursorSample[] = [];
  tortuosity: number | null = null;
  /** Exact window tortuosity scored, snapshotted at submit (for the matching sketch). */
  tortuosityWindow: CursorSample[] | null = null;
  /** Verify & Proceed click times (Condition B). Used only for the tortuosity V&P exclusion. */
  readonly verifyProceedAt: number[] = [];

  // Stream 4 - NPOIL timing.
  outputVisibleAt: number | null = null;
  submittedAt: number | null = null;
  npoilMs: number | null = null;

  // Demo-only live activity-switching estimate, set at submit by its own
  // function (liveEntropy.ts). Kept structurally separate from stateLog.
  liveEntropyEstimate: LiveActivitySwitching | null = null;

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
  /** NPOIL start point - output first fully visible (session-clock ms). */
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
      if (last.state === state) return; // unchanged - nothing to record
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

  // --- Stream 3: cursor samples + tortuosity ---------------------------------
  pushCursorSample(sample: CursorSample): void {
    this.cursorBuffer.push(sample);
    const cutoff = sample.at - CURSOR_BUFFER_MS;
    // Trim from the front; buffer stays ~CURSOR_BUFFER_MS long.
    while (this.cursorBuffer.length && this.cursorBuffer[0].at < cutoff) {
      this.cursorBuffer.shift();
    }
  }

  /** Record a Verify & Proceed click time (Condition B stage boundary). */
  recordVerifyProceed(at: number): void {
    this.verifyProceedAt.push(at);
  }

  /** Store the tortuosity computed once at final Submit (may be null; see tortuosity.ts guards). */
  setTortuosity(value: number | null): void {
    this.tortuosity = value;
  }

  /** Snapshot the exact window tortuosity scored, so the sketch matches the number. */
  setTortuosityWindow(win: CursorSample[]): void {
    this.tortuosityWindow = win;
  }

  /** Store the demo-only live activity-switching estimate. */
  setLiveEntropyEstimate(estimate: LiveActivitySwitching): void {
    this.liveEntropyEstimate = estimate;
  }
}
