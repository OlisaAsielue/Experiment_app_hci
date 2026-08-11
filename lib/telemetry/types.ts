/**
 * ============================================================================
 *  TELEMETRY SPECIFICATION - locked decisions (source of truth in code)
 * ============================================================================
 * Four streams, all timestamped against ONE session clock (SessionClock) so
 * cross-metric analysis is possible (PRD §5 "cross-cutting"). Paper references
 * point to docs/capstone-paper.md.
 *
 * The following five decisions are SPEC, not implementation detail - implemented in
 * the module named against each and cross-referenced back here:
 *
 * D1 - Interaction-state catch-all (Appendix A.1). Idle is the DEFAULT/REST state for
 *      any frame where none of Modifying, Confirming, or Hovering are triggered. The
 *      Appendix's 2000ms rule is the formal definition of *sustained inactivity* and
 *      re-entering Idle after defined activity; treating Idle as the general rest
 *      state (e.g. cursor in blank space) is a minor, DOCUMENTED extension of
 *      Appendix A.1, not something it states explicitly.
 *      → implemented in useInteractionStateMachine.ts
 *
 * D2 - Confirming hit-test reuses the SAME `[data-mandatory-click]` tagging used for
 *      volatility exclusion - one source of truth for "this is a mandatory control"
 *      across both entropy state detection (Confirming) and volatility exclusion.
 *      → implemented in useInteractionStateMachine.ts (Confirming) + editingEvents (exclusion)
 *
 * D3 - Cursor Trajectory Tortuosity is scoped to the 3s immediately preceding the
 *      FINAL Submit only (PRD §5.4). Its capture-and-compute trigger fires ONCE, on
 *      final Submit - never on Verify & Proceed or any other mandatory click.
 *      → implemented in cursorBuffer.ts (built later)
 *
 * D4 - Input & Editing Volatility classification (PRD §5.2): every backspace/delete is
 *      always corrective; a typed character is corrective iff it occurs within 5000ms
 *      of the most recent deletion in that field AND the field's current length has not
 *      yet recovered past its length immediately before that deletion - reverting to
 *      additive once length recovers past that point, until the next deletion. Mandatory
 *      clicks never count, regardless of timing.
 *      → implemented in editingEvents.ts (built later)
 *
 * D5 - Entropy has TWO separate computations kept visibly distinct in the store:
 *      (a) the raw, correctly-precedenced state-transition log (`stateLog`) - the input
 *          to the REAL Shannon entropy-rate calculation done OFFLINE (Appendix A.2),
 *          not in this app; and
 *      (b) a separate lightweight LIVE estimate used only for the demo-reveal screen
 *          (`liveEntropyEstimate`), computed by its own function.
 *      They must never share a code path, so a future discrepancy is easy to spot.
 *      → stateLog here + session.ts; live estimate in liveEntropy.ts
 *
 * KNOWN LIMITATION (documented, not fixed for this build): the interaction-state
 * machine is driven by requestAnimationFrame, which browsers PAUSE while the tab is
 * backgrounded. If a participant switches away mid-task, state sampling pauses and the
 * hidden interval is not counted toward the stationary distribution. This is accepted
 * for the demonstration build under the best-effort rAF sampling the PRD permits
 * (PRD section 8.4); a visibilitychange safeguard would be added only for real,
 * fully-powered data collection, which is out of scope here.
 * ============================================================================
 */

/** The four mutually exclusive interaction states (Appendix A.1). */
export type InteractionState = "Idle" | "Hovering" | "Modifying" | "Confirming";

/**
 * Precedence order, HIGHEST first (Appendix A.1): Modifying > Confirming > Hovering >
 * Idle. Higher precedence wins when triggers overlap, so active input is never masked
 * by cursor position.
 */
export const STATE_PRECEDENCE: InteractionState[] = [
  "Modifying",
  "Confirming",
  "Hovering",
  "Idle",
];

/** One entry in the raw state-transition log (input to offline entropy, Appendix A.2). */
export interface StateTransition {
  state: InteractionState;
  /** ms on the session clock when this state was entered. */
  enteredAt: number;
  /** ms on the session clock when it was exited; null while still current. */
  exitedAt: number | null;
}

/** Editing-event classification for Input & Editing Volatility (D4, PRD §5.2). */
export type EditingEventType = "corrective" | "additive" | "mandatory_click";

export interface EditingEvent {
  type: EditingEventType;
  /** ms on the session clock. */
  at: number;
  /** For key events: the key involved (for auditability); omitted for mandatory clicks. */
  key?: string;
}

/** A single cursor position sample (D3, PRD §5.4). */
export interface CursorSample {
  x: number;
  y: number;
  /** ms on the session clock. */
  at: number;
}
