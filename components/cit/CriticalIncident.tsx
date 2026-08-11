"use client";

import { useState } from "react";
import { CIT_TITLE, CIT_INTRO, CIT_PLACEHOLDER } from "@/content/post-task-text";
import { Button } from "@/components/ui/Button";

/**
 * Critical Incident Technique reflection (Flanagan 1954), administered after the
 * NASA-TLX and before the debrief. Every participant completes this at collection
 * time; quartile selection by NPOIL/Interaction Entropy happens later at analysis
 * time, not as a live gate (PRD section 3 step 9, paper section 4.7).
 *
 * A single free-text box, not three enforced fields. The antecedent/incident/outcome
 * structure Flanagan's technique needs is given as guidance INSIDE the placeholder
 * text, per PRD section 8.6, rather than three separate inputs.
 */
export function CriticalIncident({
  onComplete,
}: {
  onComplete: (text: string) => void;
}) {
  const [text, setText] = useState("");
  const canSubmit = text.trim().length > 0;

  return (
    <main className="mx-auto w-full max-w-2xl px-4 py-12">
      <p className="text-sm font-medium uppercase tracking-wide text-neutral-500">
        Almost done
      </p>
      <h1 className="mt-2 text-2xl font-semibold text-neutral-900">{CIT_TITLE}</h1>
      <p className="mt-3 text-[15px] leading-7 text-neutral-700">{CIT_INTRO}</p>

      <textarea
        rows={8}
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder={CIT_PLACEHOLDER}
        className="mt-6 w-full resize-y rounded-lg border border-neutral-300 bg-white px-3 py-2.5 text-[15px] leading-6 text-neutral-900 placeholder:whitespace-pre-line placeholder:text-neutral-400 focus:border-neutral-500 focus:outline-none"
      />

      <div className="mt-8 flex justify-end">
        <Button onClick={() => onComplete(text)} disabled={!canSubmit}>
          Continue
        </Button>
      </div>
    </main>
  );
}
