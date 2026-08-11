"use client";

import { useState } from "react";
import type { Condition } from "@/lib/types";
import { DemoBanner } from "@/components/DemoBanner";
import { ParticipantInformationSheet } from "@/components/consent/ParticipantInformationSheet";
import { ConsentForm } from "@/components/consent/ConsentForm";
import { DeclineExit } from "@/components/consent/DeclineExit";
import { Calibration } from "@/components/flow/Calibration";
import { TaskScreen } from "@/components/task/TaskScreen";
import { ConditionAReveal } from "@/components/conditionA/ConditionAReveal";
import { ConditionBReveal } from "@/components/conditionB/ConditionBReveal";
import type { CalibrationResult } from "@/lib/telemetry/npoil";
import { TelemetryProvider } from "@/lib/telemetry/TelemetryProvider";
import { NasaTlx } from "@/components/nasatlx/NasaTlx";
import { CriticalIncident } from "@/components/cit/CriticalIncident";
import { Debrief } from "@/components/debrief/Debrief";
import { TelemetryReveal } from "@/components/reveal/TelemetryReveal";
import { persistEvent } from "@/lib/persist/sendEvent";

/**
 * DemoFlow - client-side orchestrator for the /demo apparatus.
 *
 * Full sequence: PIS -> consent (-> decline, a real exit, not a dead end) -> choose a
 * condition -> baseline calibration -> run the task -> Raw NASA-TLX -> CIT reflection
 * -> debrief -> telemetry reveal. This mirrors the paper's canonical order (consent
 * precedes assignment, NASA-TLX precedes CIT precedes debrief) even though
 * "assignment" here is the visitor's own choice rather than randomisation.
 *
 * The "Demonstration only" banner is rendered ONCE, unconditionally, at the top of
 * every step, so it is visible no matter which step a visitor lands on (PRD section
 * 8.12; a shared link could point partway into the flow).
 */
type Step =
  | "pis"
  | "consent"
  | "declined"
  | "choose"
  | "calibration"
  | "running"
  | "nasatlx"
  | "cit"
  | "debrief"
  | "reveal";

export function DemoFlow() {
  const [step, setStep] = useState<Step>("pis");
  const [condition, setCondition] = useState<Condition | null>(null);
  const [calibration, setCalibration] = useState<CalibrationResult | null>(null);

  // Pseudonymised session code, generated once at entry (before PIS), per the paper's
  // "pseudonymisation on entry" requirement (section 4.8) and PRD flow step 2. Reused
  // as the session_code FK for every persisted row and passed into TelemetryProvider
  // so the in-memory streams share the same code. Every persistEvent() call below is
  // fire-and-forget: PERSIST_DATA off (the default) means the server no-ops on every
  // one of them, this demo never depends on any of them succeeding.
  const [sessionCode] = useState(() =>
    typeof crypto !== "undefined" && crypto.randomUUID
      ? crypto.randomUUID()
      : `sess-${Date.now()}-${Math.random().toString(36).slice(2)}`,
  );

  // NOTE (random assignment is OUT OF SCOPE for this demo build):
  // In the real study, condition is assigned by server-side 50/50 randomisation and
  // locked to the participant's pseudonymised session (see the paper §4.5 / PRD §8.1).
  // Here on the public demo the VISITOR chooses their condition on purpose, so a funder
  // can try both versions. There is deliberately no randomisation mechanism in this
  // build; the choice below is the whole of it. This gap is surfaced to the visitor in
  // the copy on the choice screen, not hidden.
  function choose(next: Condition) {
    setCondition(next);
    persistEvent("sessions", {
      session_code: sessionCode,
      condition: next,
      created_at: new Date().toISOString(),
      completed_at: null,
      status: "in_calibration",
    });
    setStep("calibration");
  }

  // Back to condition choice: used after finishing a run (consent already given this
  // session, no need to repeat it) or from the task's own "Start over" affordance.
  const restart = () => {
    setCondition(null);
    setCalibration(null);
    setStep("choose");
  };

  // Back to the very start: used when someone declines consent and wants to
  // reconsider. They have not agreed to anything yet, so this re-shows the PIS.
  const restartFromDecline = () => setStep("pis");

  return (
    <div className="flex min-h-screen flex-col">
      <DemoBanner />

      {step === "pis" && (
        <ParticipantInformationSheet onContinue={() => setStep("consent")} />
      )}

      {step === "consent" && (
        <ConsentForm
          onAgree={() => {
            persistEvent("consent_records", {
              prolific_id: null, // Prolific integration is a stub (PRD section 8.8)
              session_code: sessionCode,
              all_statements_agreed: true,
              consent_timestamp: new Date().toISOString(),
            });
            setStep("choose");
          }}
          onDecline={() => setStep("declined")}
        />
      )}

      {step === "declined" && <DeclineExit onRestart={restartFromDecline} />}

      {step === "choose" && <ConditionChoice onChoose={choose} />}

      {(step === "calibration" ||
        step === "running" ||
        step === "nasatlx" ||
        step === "cit" ||
        step === "debrief" ||
        step === "reveal") && (
        // ONE TelemetryProvider spans the whole run (calibration through submit) so
        // every stream shares a single session + clock. NASA-TLX/CIT stay inside this
        // block too so the provider does not unmount before the reveal reads it, even
        // though neither instrument itself is part of telemetry capture.
        <TelemetryProvider sessionCode={sessionCode}>
          <div className="flex flex-1 flex-col">
            {step === "calibration" && (
              <Calibration
                onComplete={(result) => {
                  setCalibration(result);
                  persistEvent("calibration_events", {
                    session_code: sessionCode,
                    abstract_word_count: result.abstractWordCount,
                    time_to_continue_ms: result.timeToContinueMs,
                    reading_velocity_ms_per_word: result.readingVelocityMsPerWord,
                  });
                  setStep("running");
                }}
              />
            )}
            {step === "running" && (
              <TaskScreen
                condition={condition!}
                calibration={calibration}
                onRestart={restart}
                reveal={condition === "A" ? ConditionAReveal : ConditionBReveal}
                onFinish={() => setStep("nasatlx")}
              />
            )}
            {step === "nasatlx" && (
              <NasaTlx
                onComplete={(responses) => {
                  persistEvent("nasa_tlx_responses", {
                    session_code: sessionCode,
                    ...responses,
                  });
                  setStep("cit");
                }}
              />
            )}
            {step === "cit" && (
              <CriticalIncident
                onComplete={(text) => {
                  persistEvent("cit_responses", {
                    session_code: sessionCode,
                    reflection_text: text,
                  });
                  setStep("debrief");
                }}
              />
            )}
            {step === "debrief" && (
              <Debrief onFinish={() => setStep("reveal")} />
            )}
            {step === "reveal" && <TelemetryReveal onRestart={restart} />}
          </div>
        </TelemetryProvider>
      )}
    </div>
  );
}

function ConditionChoice({ onChoose }: { onChoose: (c: Condition) => void }) {
  return (
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
        <em>same</em> answer - the only difference is how that answer is
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
