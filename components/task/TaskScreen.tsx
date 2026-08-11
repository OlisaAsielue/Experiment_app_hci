"use client";

import { useCallback, useRef, useState, type ComponentType } from "react";
import type { Condition } from "@/lib/types";
import { ChatbotShell } from "@/components/shell/ChatbotShell";
import { Button } from "@/components/ui/Button";
import { SourcePanel } from "./SourcePanel";
import type { RevealProps } from "./types";

/**
 * TaskScreen — the shared task surface for BOTH conditions.
 *
 * Owns the shell, the (shared) source panel, and the bottom input. It delegates the
 * output-reveal to a condition-specific `reveal` render-prop, which is the ONLY part
 * that differs between A and B. The bottom input runs a small phase machine that is
 * identical across conditions:
 *   command   → participant types/sends one command
 *   generating→ the reveal is playing; input disabled
 *   output    → participant writes their verified summary brief, then submits
 *   done      → confirmation (Step-3 placeholder; later this hands off to NASA-TLX)
 *
 * Timestamps captured here (outputVisibleAt, submittedAt) feed NPOIL once telemetry
 * is wired in Step 6. For now they are reported via onFinish / logged.
 */
type Phase = "command" | "generating" | "output" | "done";

const DEFAULT_COMMAND =
  "Synthesise the four source excerpts into a short, verified summary brief.";

export interface TaskFinishData {
  condition: Condition;
  outputVisibleAt: number | null;
  submittedAt: number;
  responseText: string;
}

export function TaskScreen({
  condition,
  reveal: RevealComponent,
  onRestart,
  onFinish,
}: {
  condition: Condition;
  /** Condition-specific output-reveal component (the ONLY part that differs). */
  reveal: ComponentType<RevealProps>;
  onRestart?: () => void;
  onFinish?: (data: TaskFinishData) => void;
}) {
  const [phase, setPhase] = useState<Phase>("command");
  const [command, setCommand] = useState(DEFAULT_COMMAND);
  const [response, setResponse] = useState("");
  const outputVisibleAtRef = useRef<number | null>(null);

  const onOutputVisible = useCallback(() => {
    // NPOIL start point. Guarded to fire once by the reveal component itself.
    outputVisibleAtRef.current = performance.now();
    setPhase("output");
  }, []);

  function send() {
    if (command.trim()) setPhase("generating");
  }

  function submit() {
    const submittedAt = performance.now();
    const data: TaskFinishData = {
      condition,
      outputVisibleAt: outputVisibleAtRef.current,
      submittedAt,
      responseText: response,
    };
    onFinish?.(data);
    // Step-3 placeholder: telemetry + NASA-TLX/CIT/debrief come in later steps.
    console.log("[task] submitted", {
      ...data,
      rawPauseMs:
        outputVisibleAtRef.current != null
          ? submittedAt - outputVisibleAtRef.current
          : null,
    });
    setPhase("done");
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
          // Final brief submission — a MANDATORY click (excluded from volatility).
          <Button mandatory onClick={submit} disabled={!response.trim()}>
            Submit
          </Button>
        ) : (
          // Initial "send one command" — a MANDATORY click (excluded from volatility).
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
        className="w-full resize-y rounded-lg border border-neutral-300 bg-white px-3 py-2 text-[15px] leading-6 text-neutral-900 placeholder:text-neutral-400 focus:border-neutral-500 focus:outline-none disabled:bg-neutral-100 disabled:text-neutral-500"
      />
    </label>
  );
}
