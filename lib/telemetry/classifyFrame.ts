import type { InteractionState } from "./types";

/**
 * Pure per-frame interaction-state classifier (Appendix A.1).
 *
 * Extracted from the rAF loop so the precedence + hit-test logic is unit-testable
 * without a running animation frame. Given the frame's inputs, returns exactly one
 * state, applying precedence Modifying > Confirming > Hovering > Idle.
 *
 * Idle is the catch-all/rest state, returned whenever none of Modifying,
 *     Confirming, or Hovering trigger (a documented extension of Appendix A.1).
 * Confirming is driven by the caller's `mandatoryRects`, which come from the
 *     single `[data-mandatory-click]` source of truth - plus a recent mandatory click.
 */

/** Minimal rectangle shape (structurally compatible with DOMRect). */
export interface Rect {
  left: number;
  right: number;
  top: number;
  bottom: number;
}

export interface FrameInputs {
  /** Session-clock ms for this frame. */
  now: number;
  /** Cursor position in viewport coords, or null if no movement seen yet. */
  cursor: { x: number; y: number } | null;
  /** Session-clock ms of the last keystroke targeting the response field. */
  lastResponseKeystrokeAt: number;
  /** Session-clock ms of the last click on a mandatory control. */
  lastMandatoryClickAt: number;
  /** Bounds of the AI output container (Hovering target), or null if absent. */
  outputRect: Rect | null;
  /** Bounds of every [data-mandatory-click] control (Confirming targets). */
  mandatoryRects: Rect[];
  /** How long after a keystroke the frame still counts as Modifying. */
  modifyingActiveMs: number;
  /** How long after a mandatory click the frame still counts as Confirming. */
  confirmingClickMs: number;
}

export function pointInRect(x: number, y: number, r: Rect): boolean {
  return x >= r.left && x <= r.right && y >= r.top && y <= r.bottom;
}

export function classifyFrame(i: FrameInputs): InteractionState {
  // Modifying - active keystroke input in the response field (highest precedence).
  if (i.now - i.lastResponseKeystrokeAt < i.modifyingActiveMs) return "Modifying";

  // Confirming - recent click on, or cursor within, a mandatory control.
  if (i.now - i.lastMandatoryClickAt < i.confirmingClickMs) return "Confirming";
  if (i.cursor) {
    for (const r of i.mandatoryRects) {
      if (pointInRect(i.cursor.x, i.cursor.y, r)) return "Confirming";
    }
    // Hovering - cursor within the AI output container.
    if (i.outputRect && pointInRect(i.cursor.x, i.cursor.y, i.outputRect)) {
      return "Hovering";
    }
  }

  // Catch-all rest state.
  return "Idle";
}
