"use client";

import { useState } from "react";
import type { Condition } from "@/lib/types";
import { DemoBanner } from "@/components/DemoBanner";
import { ChatbotShell } from "@/components/shell/ChatbotShell";
import { Button } from "@/components/ui/Button";
import { PLACEHOLDER_AI_OUTPUT } from "@/content/placeholder-stimuli";

/**
 * DemoFlow — client-side orchestrator for the /demo apparatus.
 *
 * For now it has two steps: choose a condition, then run a bare shell for it.
 * Later steps insert PIS → consent → calibration → task(A/B) → NASA-TLX → CIT →
 * debrief → telemetry reveal between "choose" and "done".
 */
type Step = "choose" | "running";

export function DemoFlow() {
  const [step, setStep] = useState<Step>("choose");
  const [condition, setCondition] = useState<Condition | null>(null);

  // NOTE (random assignment is OUT OF SCOPE for this demo build):
  // In the real study, condition is assigned by server-side 50/50 randomisation and
  // locked to the participant's pseudonymised session (see the paper §4.5 / PRD §8.1).
  // Here on the public demo the VISITOR chooses their condition on purpose, so a funder
  // can try both versions. There is deliberately no randomisation mechanism in this
  // build; the choice below is the whole of it. This gap is surfaced to the visitor in
  // the copy on the choice screen, not hidden.
  function choose(next: Condition) {
    setCondition(next);
    setStep("running");
  }

  if (step === "choose") {
    return <ConditionChoice onChoose={choose} />;
  }

  return (
    <RunningPlaceholder
      condition={condition!}
      onRestart={() => {
        setCondition(null);
        setStep("choose");
      }}
    />
  );
}

function ConditionChoice({ onChoose }: { onChoose: (c: Condition) => void }) {
  return (
    <div className="flex min-h-screen flex-col">
      <DemoBanner />
      <main className="mx-auto flex w-full max-w-2xl flex-1 flex-col justify-center px-4 py-12">
        <p className="text-sm font-medium uppercase tracking-wide text-neutral-500">
          Interactive demonstration
        </p>
        <h1 className="mt-2 text-2xl font-semibold text-neutral-900">
          Two versions of the same AI research tool
        </h1>
        <p className="mt-3 text-neutral-600">
          You&rsquo;ll do a short reading-and-writing task with a built-in AI
          assistant. There are two versions of the assistant. They give the{" "}
          <em>same</em> answer &mdash; the only difference is how that answer is
          revealed to you and what you&rsquo;re asked to do with it.
        </p>

        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          <ChoiceCard
            title="Version A"
            blurb="The assistant works, then hands you a finished answer to read and accept."
            onClick={() => onChoose("A")}
          />
          <ChoiceCard
            title="Version B"
            blurb="The assistant reveals its work in stages and asks you to check each one before it continues."
            onClick={() => onChoose("B")}
          />
        </div>

        {/* Honest surfacing of the out-of-scope randomisation (see code comment in DemoFlow). */}
        <p className="mt-8 rounded-lg bg-neutral-100 px-4 py-3 text-sm text-neutral-600">
          For this demonstration you can choose your condition. In the real study,
          participants are randomly assigned.
        </p>
      </main>
    </div>
  );
}

function ChoiceCard({
  title,
  blurb,
  onClick,
}: {
  title: string;
  blurb: string;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="group flex flex-col rounded-xl border border-neutral-200 bg-white p-5 text-left transition-colors hover:border-neutral-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-neutral-400"
    >
      <span className="text-base font-semibold text-neutral-900">{title}</span>
      <span className="mt-1.5 text-sm text-neutral-600">{blurb}</span>
      <span className="mt-4 text-sm font-medium text-neutral-900 group-hover:underline">
        Start &rarr;
      </span>
    </button>
  );
}

/**
 * Temporary running view: renders the shared shell with placeholder AI output and a
 * response field, identical for both conditions. Steps 3–4 replace this with the real
 * Condition A (full/staged reveal) and Condition B (five gated stages) mechanics.
 */
function RunningPlaceholder({
  condition,
  onRestart,
}: {
  condition: Condition;
  onRestart: () => void;
}) {
  return (
    <div className="flex min-h-screen flex-col">
      <DemoBanner />
      <div className="flex flex-1 flex-col">
        <ChatbotShell
          statusSlot={<span>Demo &middot; reveal mechanics coming next</span>}
          outputSlot={
            <div className="space-y-3">
              <p className="text-xs font-medium uppercase tracking-wide text-neutral-400">
                Placeholder AI output ({`Condition ${condition}`})
              </p>
              <p className="whitespace-pre-wrap text-[15px] leading-7 text-neutral-800">
                {PLACEHOLDER_AI_OUTPUT}
              </p>
            </div>
          }
          responseSlot={
            <label className="block">
              <span className="mb-1.5 block text-sm font-medium text-neutral-700">
                Your verified summary brief
              </span>
              <textarea
                rows={4}
                placeholder="Write your summary here…"
                className="w-full resize-y rounded-lg border border-neutral-300 bg-white px-3 py-2 text-[15px] leading-6 text-neutral-900 placeholder:text-neutral-400 focus:border-neutral-500 focus:outline-none"
              />
            </label>
          }
          actionsSlot={
            <>
              <Button variant="secondary" onClick={onRestart}>
                Start over
              </Button>
              <Button variant="primary">Submit</Button>
            </>
          }
        />
      </div>
    </div>
  );
}
