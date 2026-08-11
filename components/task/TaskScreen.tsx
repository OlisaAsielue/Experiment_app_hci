"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type ComponentType,
} from "react";
import type { Condition } from "@/lib/types";
import { ChatbotShell } from "@/components/shell/ChatbotShell";
import { Button } from "@/components/ui/Button";
import { SourcePanel } from "./SourcePanel";
import type { RevealProps } from "./types";
import { AI_OUTPUT_WORD_COUNT } from "@/content/placeholder-stimuli";
import { computeNpoilMs, type CalibrationResult } from "@/lib/telemetry/npoil";
import { useTelemetry } from "@/lib/telemetry/TelemetryProvider";
import { useInteractionStateMachine } from "@/lib/telemetry/useInteractionStateMachine";
import { useEditingEvents } from "@/lib/telemetry/useEditingEvents";
import { useCursorBuffer } from "@/lib/telemetry/useCursorBuffer";
import {
  tortuosityWindow,
  computeTortuosityValue,
} from "@/lib/telemetry/tortuosity";
import { computeLiveActivitySwitching } from "@/lib/telemetry/liveEntropy";
import { persistEvent } from "@/lib/persist/sendEvent";

/**
 * TaskScreen - the shared task surface for BOTH conditions.
 *
 * Owns the shell, the (shared) source panel, and the bottom input. It delegates the
 * output-reveal to a condition-specific `reveal` render-prop, which is the ONLY part
 * that differs between A and B. The bottom input runs a small phase machine that is
 * identical across conditions:
 *   command    -> participant types/sends one command
 *   generating -> the reveal is playing; input disabled
 *   output     -> participant writes their verified summary brief, then submits
 *   done       -> brief submitted; onFinish advances the flow to NASA-TLX
 *
 * On submit, all four telemetry streams are computed/consolidated onto the shared
 * session and the run's rows are persisted (a no-op unless PERSIST_DATA is on).
 */
type Phase = "command" | "generating" | "output" | "done";

const DEFAULT_COMMAND =
  "Synthesise the four source excerpts into a short, verified summary brief.";

export function TaskScreen({
  condition,
  reveal: RevealComponent,
  calibration,
  onRestart,
  onFinish,
}: {
  condition: Condition;
  /** Condition-specific output-reveal component (the ONLY part that differs). */
  reveal: ComponentType<RevealProps>;
  /** Baseline reading velocity from the calibration phase; needed to compute NPOIL. */
  calibration?: CalibrationResult | null;
  onRestart?: () => void;
  /** Called once the brief is submitted and all streams are persisted. */
  onFinish?: () => void;
}) {
  const session = useTelemetry();
  // Stream 1 (entropy): run the interaction-state machine for the task's lifetime.
  useInteractionStateMachine();
  // Stream 2 (volatility): classify edits in the response field.
  useEditingEvents();
  // Stream 3 (tortuosity): sample the cursor into the rolling buffer.
  useCursorBuffer();

  const [phase, setPhase] = useState<Phase>("command");
  const [command, setCommand] = useState(DEFAULT_COMMAND);
  const [response, setResponse] = useState("");
  const outputVisibleAtRef = useRef<number | null>(null);

  // Record run identity onto the shared session (kept in sync with the props).
  useEffect(() => {
    session.setCondition(condition);
    session.setCalibration(calibration ?? null);
  }, [session, condition, calibration]);

  const onOutputVisible = useCallback(() => {
    // NPOIL start point (session clock, shared with the state log). Guarded to fire once.
    const at = session.clock.now();
    outputVisibleAtRef.current = at;
    session.markOutputVisible(at);
    setPhase("output");
  }, [session]);

  function send() {
    if (command.trim()) setPhase("generating");
  }

  function submit() {
    const submittedAt = session.clock.now();

    // Compute + store ALL stream values on the session BEFORE onFinish, so anything
    // downstream (e.g. the reveal) reads a fully-populated session.
    const rawPauseMs =
      outputVisibleAtRef.current != null
        ? submittedAt - outputVisibleAtRef.current
        : null;
    const npoilMs =
      calibration && rawPauseMs != null
        ? computeNpoilMs(
            rawPauseMs,
            calibration.readingVelocityMsPerWord,
            AI_OUTPUT_WORD_COUNT,
          )
        : null;
    // Consolidate NPOIL timing onto the shared session (stream 4).
    session.recordSubmission(submittedAt, npoilMs);

    // Tortuosity: computed ONCE here, on final Submit only. Slice the window ONCE and
    // store it, so the demo cursor-path sketch renders from exactly the same samples
    // the number was scored over. V&P exclusion passed as insurance.
    const win = tortuosityWindow({
      samples: session.cursorBuffer,
      submitAt: submittedAt,
      excludeTimestamps: session.verifyProceedAt,
    });
    const tortuosity = computeTortuosityValue(win);
    session.setTortuosity(tortuosity);
    session.setTortuosityWindow(win);

    // Live activity-switching estimate for the demo reveal, over the SAME post-output
    // window the other values use (outputVisibleAt -> submit). Its own function; this
    // is never the real offline entropy rate.
    if (outputVisibleAtRef.current != null) {
      session.setLiveEntropyEstimate(
        computeLiveActivitySwitching(
          session.stateLog,
          outputVisibleAtRef.current,
          submittedAt,
        ),
      );
    }

    // Fire-and-forget persistence of everything gathered this run. Each call is a
    // no-op server-side unless PERSIST_DATA is on (lib/flags.ts); the demo's
    // behaviour here is identical whether the flag is on or off. response_text is the
    // participant's own written brief, retained as their primary work product.
    persistEvent("task_events", {
      session_code: session.sessionCode,
      output_word_count: AI_OUTPUT_WORD_COUNT,
      output_visible_at_ms: outputVisibleAtRef.current,
      submitted_at_ms: submittedAt,
      npoil_ms: npoilMs,
      response_text: response,
    });
    persistEvent(
      "interaction_state_log",
      session.stateLog.map((t) => ({
        session_code: session.sessionCode,
        state: t.state,
        entered_at_ms: t.enteredAt,
        exited_at_ms: t.exitedAt,
      })),
    );
    persistEvent(
      "editing_events",
      session.editingEvents.map((e) => ({
        session_code: session.sessionCode,
        event_type: e.type,
        at_ms: e.at,
      })),
    );
    // Only the pre-submission tortuosity window is persisted, not the full buffer
    // (PRD §6 schema comment on cursor_samples).
    persistEvent(
      "cursor_samples",
      win.map((s) => ({
        session_code: session.sessionCode,
        x: s.x,
        y: s.y,
        at_ms: s.at,
      })),
    );

    setPhase("done");
    onFinish?.(); // last: the session is fully populated by this point.
  }

  const statusSlot = onRestart ? (
    <button
      onClick={onRestart}
      className="text-xs font-medium text-neutral-500 underline-offset-2 hover:text-neutral-800 hover:underline"
    >
      Start over
    </button>
  ) : undefined;

  return (
    <ChatbotShell
      statusSlot={statusSlot}
      outputSlot={
        <div className="space-y-4">
          <SourcePanel />
          <div>
            <RevealComponent
              started={phase !== "command"}
              onOutputVisible={onOutputVisible}
            />
          </div>
        </div>
      }
      responseSlot={
        phase === "output" || phase === "done" ? (
          <ResponseField
            value={response}
            onChange={setResponse}
            disabled={phase === "done"}
          />
        ) : (
          <CommandField
            value={command}
            onChange={setCommand}
            disabled={phase === "generating"}
          />
        )
      }
      actionsSlot={
        phase === "done" ? (
          <span className="text-sm font-medium text-neutral-500">
            Submitted ✓
          </span>
        ) : phase === "output" ? (
          // Final brief submission - a MANDATORY click (excluded from volatility).
          <Button mandatory onClick={submit} disabled={!response.trim()}>
            Submit
          </Button>
        ) : (
          // Initial "send one command" - a MANDATORY click (excluded from volatility).
          <Button
            mandatory
            onClick={send}
            disabled={phase === "generating" || !command.trim()}
          >
            {phase === "generating" ? "Working…" : "Send"}
          </Button>
        )
      }
    />
  );
}

function CommandField({
  value,
  onChange,
  disabled,
}: {
  value: string;
  onChange: (v: string) => void;
  disabled: boolean;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-medium text-neutral-700">
        Your request to the assistant
      </span>
      <textarea
        rows={2}
        value={value}
        disabled={disabled}
        onChange={(e) => onChange(e.target.value)}
        className="w-full resize-y rounded-lg border border-neutral-300 bg-white px-3 py-2 text-[15px] leading-6 text-neutral-900 placeholder:text-neutral-400 focus:border-neutral-500 focus:outline-none disabled:bg-neutral-100 disabled:text-neutral-400"
      />
    </label>
  );
}

function ResponseField({
  value,
  onChange,
  disabled,
}: {
  value: string;
  onChange: (v: string) => void;
  disabled: boolean;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-medium text-neutral-700">
        Your verified summary brief
      </span>
      <textarea
        rows={4}
        value={value}
        disabled={disabled}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Write your summary here…"
        // The participant's response field: Modifying-state target (A.1) and the scope
        // of Input & Editing Volatility (PRD §5.2). The command field is NOT tagged.
        data-response-field="true"
        className="w-full resize-y rounded-lg border border-neutral-300 bg-white px-3 py-2 text-[15px] leading-6 text-neutral-900 placeholder:text-neutral-400 focus:border-neutral-500 focus:outline-none disabled:bg-neutral-100 disabled:text-neutral-500"
      />
    </label>
  );
}
