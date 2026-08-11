import type { StateTransition } from "./types";

/**
 * The DEMO-ONLY live "activity switching" estimate.
 *
 * This is NOT the Interaction Entropy Rate. The real metric (Appendix A.2) is the
 * Shannon entropy of a first-order transition matrix weighted by the empirical
 * stationary distribution, computed OFFLINE from the raw stateLog. This function is a
 * deliberately simple, legible approximation for the funder-facing demo reveal only,
 * kept in its own module so it can never share a code path with the real calculation.
 * On screen it must be labelled an estimate and never called "entropy rate".
 *
 * Formula: switches per second = (number of state changes whose entry falls in the
 * window) / (window length in seconds). A higher value means the participant moved
 * between reading, editing, and confirming more often; a lower value means more
 * settled, repetitive behaviour. Simple, monotone with "variety", and obviously not
 * the weighted-entropy figure.
 */

export interface LiveActivitySwitching {
  switchesPerSecond: number;
  /** Raw count of state changes counted in the window. */
  switchCount: number;
  /** Window length used (ms). */
  windowMs: number;
}

/**
 * @param stateLog raw transition log (each entry is one state span)
 * @param fromMs   window start on the session clock (e.g. outputVisibleAt)
 * @param toMs     window end on the session clock (e.g. submittedAt)
 */
export function computeLiveActivitySwitching(
  stateLog: StateTransition[],
  fromMs: number,
  toMs: number,
): LiveActivitySwitching {
  const windowMs = Math.max(0, toMs - fromMs);
  // A "switch" is a state span that was ENTERED inside the window (the first span,
  // typically entered before the window, is the state we were already in).
  const switchCount = stateLog.filter(
    (t) => t.enteredAt > fromMs && t.enteredAt <= toMs,
  ).length;
  const seconds = windowMs / 1000;
  const switchesPerSecond = seconds > 0 ? switchCount / seconds : 0;
  return { switchesPerSecond, switchCount, windowMs };
}
