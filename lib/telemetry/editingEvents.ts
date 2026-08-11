import type { EditingEventType } from "./types";

/**
 * Input & Editing Volatility classifier (PRD section 5.2). Pure and
 * unit-testable, mirroring classifyFrame for the state machine.
 *
 * The exact rule (code only, not in the paper):
 *  - Every backspace/delete (any length-reducing edit) is ALWAYS corrective.
 *  - A typed character is corrective iff BOTH:
 *      (a) it occurs within CORRECTIVE_WINDOW_MS of the most recent deletion in the
 *          field, AND
 *      (b) the field's resulting length has NOT yet recovered PAST the length it had
 *          immediately before that deletion (i.e. resultingLength <=
 *          lengthBeforeLastDeletion).
 *    Once the length recovers past that point, typing reverts to additive until the
 *    next deletion.
 *  - Mandatory clicks never count (they never reach this classifier; they are logged
 *    separately as `mandatory_click` and excluded from the corrective count).
 *
 * Volatility = the number of `corrective` events.
 */

export const CORRECTIVE_WINDOW_MS = 5000;

export interface VolatilityState {
  /** Length of the field after the previous edit (starts at 0). */
  prevLength: number;
  /** Session-clock ms of the most recent deletion (-Infinity if none yet). */
  lastDeletionAt: number;
  /** Field length immediately before that most recent deletion. */
  lengthBeforeLastDeletion: number;
}

export function initialVolatilityState(): VolatilityState {
  return { prevLength: 0, lastDeletionAt: -Infinity, lengthBeforeLastDeletion: 0 };
}

/**
 * Classify a single edit given the running state and the field's new length.
 * Returns the corrective/additive type and the next state. `mandatory_click` is not
 * produced here (see module doc).
 */
export function classifyEdit(
  state: VolatilityState,
  newLength: number,
  at: number,
  windowMs: number = CORRECTIVE_WINDOW_MS,
): { type: Exclude<EditingEventType, "mandatory_click">; next: VolatilityState } {
  const delta = newLength - state.prevLength;

  if (delta < 0) {
    // Length-reducing edit (backspace/delete): always corrective. Record the length
    // immediately before this deletion as the recovery threshold.
    return {
      type: "corrective",
      next: {
        prevLength: newLength,
        lastDeletionAt: at,
        lengthBeforeLastDeletion: state.prevLength,
      },
    };
  }

  // Insertion (or same-length replacement): corrective only inside the window AND
  // before the length recovers past the pre-deletion length.
  const withinWindow = at - state.lastDeletionAt <= windowMs;
  const notYetRecovered = newLength <= state.lengthBeforeLastDeletion;
  const type = withinWindow && notYetRecovered ? "corrective" : "additive";
  return { type, next: { ...state, prevLength: newLength } };
}
