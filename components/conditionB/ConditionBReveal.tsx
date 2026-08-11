"use client";

import type { RevealProps } from "@/components/task/types";

/**
 * Condition B — High-Agency Collaborator reveal.
 *
 * PLACEHOLDER for Step 3. The real five-stage gated reveal (source extraction →
 * thematic clustering → cross-source comparison → synthesis drafting → final
 * verification, each behind a mandatory "Verify & Proceed" click) is built in
 * Step 4. For now this renders a notice so Condition B is runnable end-to-end.
 */
export function ConditionBReveal({ started, onOutputVisible }: RevealProps) {
  void onOutputVisible; // wired up in Step 4
  if (!started) {
    return (
      <p className="text-sm text-neutral-500">
        The assistant&rsquo;s synthesis will appear here, revealed in stages, after
        you send your request.
      </p>
    );
  }
  return (
    <div className="rounded-lg border border-dashed border-neutral-300 bg-neutral-50 p-4 text-sm text-neutral-600">
      <p className="font-medium text-neutral-700">
        Five-stage reveal coming next (Step 4).
      </p>
      <p className="mt-1">
        This is where the staged “Verify &amp; Proceed” mechanics will render.
      </p>
    </div>
  );
}
