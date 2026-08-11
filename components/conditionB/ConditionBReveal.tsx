"use client";

import { useEffect, useRef, useState } from "react";
import { CONDITION_B_STAGE_CONTENT } from "@/content/placeholder-stimuli";
import { ReadOnlyOutput } from "@/components/task/ReadOnlyOutput";
import { Button } from "@/components/ui/Button";
import type { RevealProps } from "@/components/task/types";

/**
 * Condition B - High-Agency Collaborator reveal.
 *
 * The same fixed output is revealed across five sequential stages (source
 * extraction → thematic clustering → cross-source comparison → synthesis drafting →
 * final verification). At each boundary the participant must click "Verify &
 * Proceed" before the next stage is shown. Those clicks are MANDATORY (marked with
 * `mandatory` so telemetry excludes them from volatility and tortuosity).
 *
 * Reveal model (documented so it can be adjusted): stages are shown one at a time.
 * There are four "Verify & Proceed" clicks (boundaries 1→2→3→4→5). The FINAL stage
 * (stage 5) is the complete synthesis, identical to the Condition A output, and is
 * rendered through the SHARED ReadOnlyOutput component so its shading exactly matches
 * Condition A. When the final stage first appears, onOutputVisible() fires once (the
 * NPOIL start point per PRD §5.1) and TaskScreen opens the brief-writing phase - the
 * final stage itself has no Verify & Proceed; the participant's next mandatory action
 * is the brief Submit. (If a fifth confirm click is wanted, add it here.)
 */
export function ConditionBReveal({ started, onOutputVisible }: RevealProps) {
  const [stageIndex, setStageIndex] = useState(0);
  const firedRef = useRef(false);

  const total = CONDITION_B_STAGE_CONTENT.length; // 5
  const stage = CONDITION_B_STAGE_CONTENT[stageIndex];
  const isFinal = stage.isFinal;

  // Fire the NPOIL start point exactly once, when the final stage first appears.
  useEffect(() => {
    if (started && isFinal && !firedRef.current) {
      firedRef.current = true;
      onOutputVisible();
    }
  }, [started, isFinal, onOutputVisible]);

  if (!started) {
    return (
      <p className="text-sm text-neutral-500">
        The assistant&rsquo;s synthesis will appear here, revealed in stages, after
        you send your request.
      </p>
    );
  }

  return (
    <div className="space-y-3">
      <StageProgress current={stageIndex} total={total} title={stage.title} />

      {isFinal ? (
        <ReadOnlyOutput condition="B">{stage.body}</ReadOnlyOutput>
      ) : (
        <IntermediateStage body={stage.body} />
      )}

      {!isFinal && (
        <div className="flex justify-end">
          <Button
            mandatory
            onClick={() => setStageIndex((i) => Math.min(i + 1, total - 1))}
          >
            Verify &amp; Proceed &rarr;
          </Button>
        </div>
      )}
    </div>
  );
}

function StageProgress({
  current,
  total,
  title,
}: {
  current: number;
  total: number;
  title: string;
}) {
  return (
    <div className="flex items-center justify-between">
      <p className="text-xs font-medium uppercase tracking-wide text-neutral-400">
        Stage {current + 1} of {total} · {title}
      </p>
      <div className="flex gap-1.5" aria-hidden>
        {Array.from({ length: total }).map((_, i) => (
          <span
            key={i}
            className={`h-1.5 w-5 rounded-full ${
              i <= current ? "bg-neutral-800" : "bg-neutral-200"
            }`}
          />
        ))}
      </div>
    </div>
  );
}

function IntermediateStage({ body }: { body: string }) {
  return (
    <div className="whitespace-pre-wrap rounded-lg border border-neutral-200 bg-white p-4 text-[15px] leading-7 text-neutral-800">
      {body}
    </div>
  );
}
