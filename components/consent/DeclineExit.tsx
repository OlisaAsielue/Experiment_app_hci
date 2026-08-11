"use client";

import { Button } from "@/components/ui/Button";

/**
 * Decline/exit screen (PRD section 8.5): reached when a participant chooses not to
 * continue past consent. Thanks them, states plainly that they cannot proceed
 * without full consent, and confirms nothing was collected. Not a disabled button
 * with no explanation, a real screen with a real way back.
 */
export function DeclineExit({ onRestart }: { onRestart: () => void }) {
  return (
    <main className="mx-auto flex w-full max-w-2xl flex-1 flex-col justify-center px-4 py-12">
      <p className="text-sm font-medium uppercase tracking-wide text-neutral-500">
        You have not agreed to take part
      </p>
      <h1 className="mt-2 text-2xl font-semibold text-neutral-900">Thank you</h1>
      <p className="mt-3 text-[15px] leading-7 text-neutral-700">
        Thank you for considering this study. Because not all of the consent
        statements were agreed to, you cannot proceed further. This is expected and
        entirely fine, taking part is voluntary.
      </p>
      <p className="mt-3 text-[15px] leading-7 text-neutral-700">
        Nothing about you or your responses has been recorded or stored. You may
        close this page at any time.
      </p>
      <div className="mt-8">
        <Button variant="secondary" onClick={onRestart}>
          Start again
        </Button>
      </div>
    </main>
  );
}
