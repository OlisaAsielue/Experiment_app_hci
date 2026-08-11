import type { ReactNode } from "react";
import type { Condition } from "@/lib/types";

/**
 * ReadOnlyOutput - the shaded, read-only container that displays the FINAL AI
 * synthesis.
 *
 * SHARED ON PURPOSE: both Condition A (full output at once) and Condition B (the
 * fifth/final stage) render the final synthesis through THIS one component, so the
 * shading and styling are guaranteed identical - there is no second set of style
 * props that could quietly drift apart between the two conditions. If the look of
 * the read-only output needs to change, it changes here, for both conditions at once.
 *
 * `data-condition` is only a hook for telemetry/inspection; it carries no styling.
 */
export function ReadOnlyOutput({
  condition,
  label = "Assistant synthesis",
  children,
}: {
  condition: Condition;
  label?: string;
  children: ReactNode;
}) {
  return (
    <div className="space-y-2">
      <p className="text-xs font-medium uppercase tracking-wide text-neutral-400">
        {label}
      </p>
      <div
        aria-readonly="true"
        data-condition={condition}
        data-output-panel="true"
        className="select-text whitespace-pre-wrap rounded-lg bg-neutral-100 p-4 text-[15px] leading-7 text-neutral-800"
      >
        {children}
      </div>
    </div>
  );
}
