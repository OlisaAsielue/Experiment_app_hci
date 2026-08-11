/**
 * "Demonstration only — not a live study" banner.
 *
 * Per PRD §8.12 this must appear on the participant-facing screens of the public
 * demo (the condition-choice screen and the consent/PIS screens), making clear that
 * no real data is being collected and no real ethics approval is in force here.
 * Purely presentational — no interactivity, so it stays a Server Component.
 */
export function DemoBanner() {
  return (
    <div
      role="note"
      className="w-full border-b border-amber-300/70 bg-amber-50 px-4 py-2 text-center text-sm text-amber-900"
    >
      <span className="font-semibold">Demonstration only</span> — not a live study.
      Nothing you do here is stored.
    </div>
  );
}
