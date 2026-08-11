"use client";

import { useEffect, useRef, useState } from "react";
import { PLACEHOLDER_AI_OUTPUT } from "@/content/placeholder-stimuli";
import type { RevealProps } from "@/components/task/types";
import { ReadOnlyOutput } from "@/components/task/ReadOnlyOutput";

/**
 * Condition A - Low-Agency Automation reveal.
 *
 * Flow: participant sends one command → a hidden "processing" sequence plays
 * (the disclosed deception: it simulates live generation but the output is
 * pre-written) → the FULL output appears at once in a read-only container.
 *
 * The output container is read-only and given a subtle shade (not the editable
 * white of the response field) - enough to signal "display, not yours to edit"
 * without a loud lock affordance (see decisions.md Decision 4).
 *
 * Calls onOutputVisible() exactly once, when the full output first appears
 * (the NPOIL start point for Condition A).
 */

// The fake "AI working" steps. Purely cosmetic; total ~4.4s.
const PROCESSING_STEPS = [
  "Reading the source material…",
  "Identifying themes…",
  "Comparing across sources…",
  "Drafting the synthesis…",
];
const STEP_MS = 1100;

export function ConditionAReveal({ started, onOutputVisible }: RevealProps) {
  const [stepIndex, setStepIndex] = useState(0);
  const [revealed, setRevealed] = useState(false);
  const firedRef = useRef(false);

  // Drive the processing sequence once generation starts. The component mounts
  // fresh for each run (started=false → true only once), so no reset is needed here
  // and all setState happens inside async timeout callbacks, not synchronously.
  useEffect(() => {
    if (!started) return;
    const timers: ReturnType<typeof setTimeout>[] = [];
    let i = 0;
    const tick = () => {
      i += 1;
      if (i < PROCESSING_STEPS.length) {
        setStepIndex(i);
        timers.push(setTimeout(tick, STEP_MS));
      } else {
        setRevealed(true);
      }
    };
    timers.push(setTimeout(tick, STEP_MS));
    return () => timers.forEach(clearTimeout);
  }, [started]);

  // Fire the NPOIL start point exactly once, when the output first shows.
  useEffect(() => {
    if (revealed && !firedRef.current) {
      firedRef.current = true;
      onOutputVisible();
    }
  }, [revealed, onOutputVisible]);

  if (!started) {
    return (
      <p className="text-sm text-neutral-500">
        The assistant&rsquo;s synthesis will appear here after you send your
        request.
      </p>
    );
  }

  if (!revealed) {
    return (
      <div className="flex items-center gap-3 py-6 text-sm text-neutral-600">
        <Spinner />
        <span>{PROCESSING_STEPS[stepIndex]}</span>
      </div>
    );
  }

  return <ReadOnlyOutput condition="A">{PLACEHOLDER_AI_OUTPUT}</ReadOnlyOutput>;
}

function Spinner() {
  return (
    <span
      aria-hidden
      className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-neutral-300 border-t-neutral-700"
    />
  );
}
