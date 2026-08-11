"use client";

import { useEffect, useRef } from "react";
import {
  PLACEHOLDER_CALIBRATION_ABSTRACT,
  CALIBRATION_WORD_COUNT,
} from "@/content/placeholder-stimuli";
import { Button } from "@/components/ui/Button";
import {
  computeReadingVelocity,
  type CalibrationResult,
} from "@/lib/telemetry/npoil";

/**
 * Baseline calibration phase (PRD §5.1 / paper §4.6).
 *
 * The participant reads an unrelated abstract of comparable length to the AI output,
 * then clicks "Continue". We time the interval between the abstract appearing and the
 * click (time_to_continue_ms) and derive their baseline reading velocity (ms/word),
 * which normalises NPOIL later.
 *
 * TIMING RIGOUR: the start time is captured in a mount effect (fires right after the
 * abstract paints - the closest client-side proxy for "the abstract appears"); the
 * click time is performance.now() at the Continue handler. This is the same
 * disciplined timing the telemetry uses - calibration is a first-class measured step,
 * not an untracked lead-in.
 *
 * NOTE: the Continue button intentionally does NOT get `data-mandatory-click`. That
 * tag exists only to exclude clicks from Input & Editing Volatility, which is scoped
 * to the response field. Continue is outside the response field and irrelevant to
 * volatility, so tagging it would be wrong - but its timing is still captured rigorously.
 */
export function Calibration({
  onComplete,
}: {
  onComplete: (result: CalibrationResult) => void;
}) {
  // "Abstract appears" ≈ just after first paint. Captured once, in a mount effect.
  const startRef = useRef<number | null>(null);
  useEffect(() => {
    startRef.current = performance.now();
  }, []);

  function onContinue() {
    // Fallback to now() only in the impossible case the effect hasn't run yet.
    const startedAt = startRef.current ?? performance.now();
    const timeToContinueMs = performance.now() - startedAt;
    onComplete({
      abstractWordCount: CALIBRATION_WORD_COUNT,
      timeToContinueMs,
      readingVelocityMsPerWord: computeReadingVelocity(
        timeToContinueMs,
        CALIBRATION_WORD_COUNT,
      ),
    });
  }

  return (
    <main className="mx-auto flex w-full max-w-2xl flex-1 flex-col justify-center px-4 py-12">
      <p className="text-sm font-medium uppercase tracking-wide text-neutral-500">
        Before you start
      </p>
      <h1 className="mt-2 text-2xl font-semibold text-neutral-900">
        Read the passage below
      </h1>
      <p className="mt-2 text-neutral-600">
        Read it at your natural pace, as you normally would. When you have finished
        reading, click <span className="font-medium">Continue</span>. This helps us
        understand your normal reading speed.
      </p>

      <article className="mt-6 whitespace-pre-line rounded-xl border border-neutral-200 bg-white p-5 text-[15px] leading-7 text-neutral-800">
        {PLACEHOLDER_CALIBRATION_ABSTRACT}
      </article>

      <div className="mt-6 flex justify-end">
        <Button onClick={onContinue}>Continue</Button>
      </div>
    </main>
  );
}
