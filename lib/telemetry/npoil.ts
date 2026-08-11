/**
 * NPOIL — Normalised Post-Output Inactivity Latency.
 *
 * Pure math, matching the paper (§4.6 / §5.1). Kept side-effect-free so it can be
 * unit-tested and reused by both the calibration phase and the task.
 *
 *   1. reading velocity   = calibration_time_ms / calibration_word_count      (ms/word)
 *   2. expected reading   = velocity * output_word_count                       (ms)
 *   3. NPOIL              = actual_pause_ms - expected_reading_time_ms          (ms)
 *
 * Sign convention (paper): POSITIVE NPOIL = paused LONGER than reading speed
 * predicts (more evaluative processing). NEGATIVE NPOIL = moved on FASTER than
 * expected — a meaningful low-evaluation signal, NOT a data error. Callers must
 * preserve negatives, never clamp them.
 */

export interface CalibrationResult {
  /** Word count of the calibration abstract the participant read. */
  abstractWordCount: number;
  /** ms between the abstract appearing and the participant clicking "Continue". */
  timeToContinueMs: number;
  /** Derived baseline reading velocity, ms per word. */
  readingVelocityMsPerWord: number;
}

/** Step 1: baseline reading velocity (ms per word) from the calibration phase. */
export function computeReadingVelocity(
  timeToContinueMs: number,
  abstractWordCount: number,
): number {
  if (abstractWordCount <= 0) return 0;
  return timeToContinueMs / abstractWordCount;
}

/** Step 2: expected reading time (ms) for an output of the given word count. */
export function computeExpectedReadingTimeMs(
  velocityMsPerWord: number,
  outputWordCount: number,
): number {
  return velocityMsPerWord * outputWordCount;
}

/**
 * Step 3: NPOIL (ms). `actualPauseMs` is the interval between the output becoming
 * visible and the participant's next submit/proceed action. May be negative.
 */
export function computeNpoilMs(
  actualPauseMs: number,
  velocityMsPerWord: number,
  outputWordCount: number,
): number {
  return actualPauseMs - computeExpectedReadingTimeMs(velocityMsPerWord, outputWordCount);
}
