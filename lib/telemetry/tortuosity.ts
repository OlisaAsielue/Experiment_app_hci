import type { CursorSample } from "./types";

/**
 * Cursor Trajectory Tortuosity (D3, PRD section 5.4). Pure and unit-testable.
 *
 *   Tortuosity = L / D
 *     L = cumulative distance across consecutive sampled positions in the window
 *     D = straight-line distance between the FIRST and LAST sample in the window
 *   1.0 = a perfectly straight path; higher = more deviation.
 *
 * The window is the 3.000s immediately preceding the final Submit. This is computed
 * ONCE, on final Submit only (never on Verify & Proceed) - see useCursorBuffer /
 * TaskScreen for where it is triggered.
 *
 * Three edge cases are handled EXPLICITLY (not left to implicit divide-by-zero):
 *  (1) D below TORTUOSITY_D_EPSILON (e.g. the cursor was essentially still before
 *      submit) -> return 1.0, rather than Infinity/NaN from dividing by ~0.
 *  (2) Too few samples in the window (< TORTUOSITY_MIN_SAMPLES, e.g. Submit fired
 *      very soon after output appeared, or rAF was throttled) -> return null rather
 *      than a distorted ratio from too few points.
 *  (3) Exact window slicing: only samples in [submitAt - 3000, submitAt] are used, so
 *      L is not inflated by the extra ~1s the rolling buffer holds by design.
 *
 * Verify & Proceed exclusion: samples within excludeAroundMs of any excluded
 * timestamp are dropped. NOTE: by construction this should be unreachable - Submit
 * only becomes available after stage 5, and Verify & Proceed only fires at earlier
 * stage boundaries, so the final 3s window should never contain a V&P click. The
 * exclusion is kept anyway as cheap insurance matching the paper's wording; it is not
 * load-bearing.
 */

/** Exactly 3 seconds, per the metric definition. */
export const TORTUOSITY_WINDOW_MS = 3000;
/**
 * Minimum samples required to compute a meaningful path ratio. At best-effort 60Hz a
 * full 3s window yields ~180 samples, so this conservative floor only rejects
 * genuinely degenerate cases (very short pre-submit interval or heavy rAF throttling).
 */
export const TORTUOSITY_MIN_SAMPLES = 10;
/** If D is below this (px), treat the path as straight and return 1.0. */
export const TORTUOSITY_D_EPSILON = 1e-6;
/** Half-width (ms) of the exclusion around a Verify & Proceed timestamp. */
export const TORTUOSITY_EXCLUDE_AROUND_MS = 150;

export interface TortuosityInputs {
  samples: CursorSample[];
  submitAt: number;
  windowMs?: number;
  minSamples?: number;
  epsilon?: number;
  excludeAroundMs?: number;
  /** Verify & Proceed click times (expected empty in the final window; see note). */
  excludeTimestamps?: number[];
}

function dist(ax: number, ay: number, bx: number, by: number): number {
  return Math.hypot(bx - ax, by - ay);
}

/** Returns tortuosity (>= ~1.0), 1.0 for a still/straight path, or null if too few samples. */
export function computeTortuosity(inputs: TortuosityInputs): number | null {
  const {
    minSamples = TORTUOSITY_MIN_SAMPLES,
    epsilon = TORTUOSITY_D_EPSILON,
  } = inputs;
  return computeTortuosityValue(tortuosityWindow(inputs), { minSamples, epsilon });
}

/**
 * The exact sample slice tortuosity scores: [submitAt - windowMs, submitAt] with the
 * V&P exclusion applied. Exported so the demo cursor-path sketch renders from the
 * SAME window as the number (the picture and the value must match). Preserves the
 * buffer's chronological order.
 */
export function tortuosityWindow(inputs: TortuosityInputs): CursorSample[] {
  const {
    samples,
    submitAt,
    windowMs = TORTUOSITY_WINDOW_MS,
    excludeAroundMs = TORTUOSITY_EXCLUDE_AROUND_MS,
    excludeTimestamps = [],
  } = inputs;

  // (3) Exact window: only the 3.000s ending at submit.
  const start = submitAt - windowMs;
  let win = samples.filter((s) => s.at >= start && s.at <= submitAt);

  // V&P exclusion (insurance; unreachable by construction).
  if (excludeTimestamps.length) {
    win = win.filter(
      (s) => !excludeTimestamps.some((t) => Math.abs(s.at - t) <= excludeAroundMs),
    );
  }
  return win;
}

/** Compute L/D from an already-sliced window, with the two numeric guards. */
export function computeTortuosityValue(
  win: CursorSample[],
  opts: { minSamples?: number; epsilon?: number } = {},
): number | null {
  const { minSamples = TORTUOSITY_MIN_SAMPLES, epsilon = TORTUOSITY_D_EPSILON } = opts;

  // (2) Sample-count floor.
  if (win.length < minSamples) return null;

  let L = 0;
  for (let i = 1; i < win.length; i++) {
    L += dist(win[i - 1].x, win[i - 1].y, win[i].x, win[i].y);
  }
  const D = dist(win[0].x, win[0].y, win[win.length - 1].x, win[win.length - 1].y);

  // (1) Divide-by-zero guard.
  if (D < epsilon) return 1.0;

  return L / D;
}
