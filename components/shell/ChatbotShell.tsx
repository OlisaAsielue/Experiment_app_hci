import type { ReactNode } from "react";

/**
 * ChatbotShell - THE single shared shell for both experimental conditions.
 *
 * HARD REQUIREMENT (PRD §2, §4): Condition A and Condition B must share ONE
 * identical shell. The only visible difference between conditions is what goes
 * into `outputSlot` (the AI output-reveal mechanism). The response field and the
 * action row are structurally identical across conditions, so nothing about the
 * frame itself can leak which condition a participant is in.
 *
 * Styling is a NEUTRAL, generic modern-chatbot pattern (centred column, AI output
 * above, participant input below, clean neutral palette). It deliberately does NOT
 * clone any single provider's branding (ChatGPT/Claude/Gemini/DeepSeek).
 *
 * Purely presentational (slots only, no state/hooks) so it can be rendered from
 * either a Server or Client parent.
 */

export interface ChatbotShellProps {
  /** Generic tool name shown in the header. Neutral by design. */
  toolName?: string;
  /** Optional right-aligned header content (e.g. a step/stage indicator). */
  statusSlot?: ReactNode;
  /**
   * The AI output region - the ONLY part that differs between conditions.
   * Condition A: full read-only output at once. Condition B: staged reveal.
   */
  outputSlot: ReactNode;
  /** The participant's response area (identical structure across conditions). */
  responseSlot: ReactNode;
  /** Action row, e.g. the Submit button (identical structure across conditions). */
  actionsSlot?: ReactNode;
}

export function ChatbotShell({
  toolName = "Research Assistant",
  statusSlot,
  outputSlot,
  responseSlot,
  actionsSlot,
}: ChatbotShellProps) {
  return (
    <div className="mx-auto flex w-full max-w-3xl flex-1 flex-col px-4 py-8">
      {/* Single elevation: a soft layered shadow (offset + blur) carries the depth;
          the hairline border is a crisp edge, not a second halo. */}
      <div className="flex flex-1 flex-col overflow-hidden rounded-2xl border border-neutral-200/80 bg-white shadow-[0_1px_2px_rgba(28,25,23,0.04),0_16px_40px_-24px_rgba(28,25,23,0.18)]">
        {/* Header - neutral, no brand marks */}
        <header className="flex items-center justify-between border-b border-neutral-200 px-6 py-3.5">
          <div className="flex items-center gap-2.5">
            <span
              aria-hidden
              className="grid h-7 w-7 place-items-center rounded-lg bg-neutral-900 text-[13px] font-semibold text-white ring-1 ring-inset ring-white/10"
            >
              R
            </span>
            <span className="text-sm font-medium tracking-tight text-neutral-800">
              {toolName}
            </span>
          </div>
          {statusSlot ? (
            <div className="text-xs font-medium text-neutral-500">{statusSlot}</div>
          ) : null}
        </header>

        {/* AI output region - differs between conditions.
            data-output-container is the Hovering hit-test target (Appendix A.1); it is
            the same stable, condition-identical region in both A and B. */}
        <section
          aria-label="AI output"
          data-output-container="true"
          className="flex-1 overflow-y-auto px-6 py-6"
        >
          {outputSlot}
        </section>

        {/* Participant response + actions - identical across conditions */}
        <footer className="border-t border-neutral-200 bg-neutral-50/70 px-6 py-5">
          {responseSlot}
          {actionsSlot ? (
            <div className="mt-3 flex items-center justify-end gap-2">
              {actionsSlot}
            </div>
          ) : null}
        </footer>
      </div>
    </div>
  );
}
