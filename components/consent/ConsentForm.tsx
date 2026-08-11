"use client";

import { useState } from "react";
import {
  CONSENT_TITLE,
  CONSENT_HEADER_FIELDS,
  CONSENT_INTRO,
  CONSENT_STATEMENTS,
  CONSENT_FOOTER,
} from "@/content/study-text";
import { HeaderFields } from "./LegalTextBlocks";
import { Button } from "@/components/ui/Button";

/**
 * Consent Form (Appendix E). All 8 statements are INDIVIDUALLY tickable, never
 * collapsed into a single "select all" checkbox (PRD section 3 step 4). Agree is
 * disabled until every box is checked. Decline is
 * always available, independent of how many boxes are ticked, so a participant who
 * will not tick all 8 has a real, working exit rather than a dead end.
 */
export function ConsentForm({
  onAgree,
  onDecline,
}: {
  onAgree: () => void;
  onDecline: () => void;
}) {
  const [checked, setChecked] = useState<boolean[]>(
    () => new Array(CONSENT_STATEMENTS.length).fill(false),
  );
  const allChecked = checked.every(Boolean);

  function toggle(index: number) {
    setChecked((prev) => prev.map((v, i) => (i === index ? !v : v)));
  }

  return (
    <main className="mx-auto w-full max-w-2xl px-4 py-12">
      <p className="text-sm font-medium uppercase tracking-wide text-neutral-500">
        Before you take part
      </p>
      <h1 className="mt-2 text-2xl font-semibold text-neutral-900">
        {CONSENT_TITLE}
      </h1>

      <div className="mt-5">
        <HeaderFields fields={CONSENT_HEADER_FIELDS} />
      </div>

      <p className="mt-6 text-[15px] leading-7 text-neutral-700">{CONSENT_INTRO}</p>

      <fieldset className="mt-6 space-y-3">
        <legend className="sr-only">Consent statements</legend>
        {CONSENT_STATEMENTS.map((statement, i) => (
          <label
            key={i}
            className="flex cursor-pointer items-start gap-3 rounded-lg border border-neutral-200 bg-white p-4 hover:border-neutral-300"
          >
            <input
              type="checkbox"
              checked={checked[i]}
              onChange={() => toggle(i)}
              className="mt-0.5 h-4 w-4 shrink-0 rounded border-neutral-400 text-neutral-900 focus:ring-neutral-500"
            />
            <span className="text-[15px] leading-6 text-neutral-800">
              <span className="font-medium text-neutral-500">{i + 1}. </span>
              {statement}
            </span>
          </label>
        ))}
      </fieldset>

      <p className="mt-4 text-sm text-neutral-500">
        {checked.filter(Boolean).length} of {CONSENT_STATEMENTS.length} statements
        agreed.
      </p>

      <p className="mt-4 text-[15px] leading-7 text-neutral-700">{CONSENT_FOOTER}</p>

      <div className="mt-8 flex items-center justify-between">
        <button
          onClick={onDecline}
          className="text-sm font-medium text-neutral-500 underline-offset-2 hover:text-neutral-800 hover:underline"
        >
          I do not wish to continue
        </button>
        <Button onClick={onAgree} disabled={!allChecked}>
          Agree and continue
        </Button>
      </div>
    </main>
  );
}
