"use client";

import {
  DEBRIEF_TITLE,
  DEBRIEF_HEADER_FIELDS,
  DEBRIEF_BLOCKS_BEFORE_DECEPTION,
  DEBRIEF_DECEPTION_BLOCK,
  DEBRIEF_BLOCKS_AFTER_DECEPTION,
  DEBRIEF_FINISH_NOTE,
} from "@/content/study-text";
import { HeaderFields, TextBlocks } from "@/components/consent/LegalTextBlocks";
import { Button } from "@/components/ui/Button";

/**
 * Debrief (Appendix F). The deception disclosure block is rendered from its own
 * dedicated constant (see content/study-text.ts) and given a visually distinct
 * treatment here so it cannot be mistaken for ordinary body copy, without altering
 * a single word of it.
 *
 * DEBRIEF_FINISH_NOTE ("Please click [Finish / Complete] to return to Prolific...")
 * is shown verbatim as written in the paper, since it is transcribed content. It is
 * NOT the interactive control here, the demo has no real Prolific redirect, so a
 * separate, clearly-labelled demo continue button sits below it.
 */
export function Debrief({ onFinish }: { onFinish: () => void }) {
  return (
    <main className="mx-auto w-full max-w-2xl px-4 py-12">
      <p className="text-sm font-medium uppercase tracking-wide text-neutral-500">
        The study is complete
      </p>
      <h1 className="mt-2 text-2xl font-semibold text-neutral-900">
        {DEBRIEF_TITLE}
      </h1>

      <div className="mt-5">
        <HeaderFields fields={DEBRIEF_HEADER_FIELDS} />
      </div>

      <div className="mt-6">
        <TextBlocks blocks={DEBRIEF_BLOCKS_BEFORE_DECEPTION} />
      </div>

      <div className="mt-6 rounded-lg border-2 border-amber-300 bg-amber-50 p-5">
        <TextBlocks blocks={[DEBRIEF_DECEPTION_BLOCK]} />
      </div>

      <div className="mt-6">
        <TextBlocks blocks={DEBRIEF_BLOCKS_AFTER_DECEPTION} />
      </div>

      <p className="mt-6 text-[15px] leading-7 text-neutral-700">
        {DEBRIEF_FINISH_NOTE}
      </p>

      <div className="mt-8 flex items-center justify-between rounded-lg bg-neutral-100 px-4 py-4">
        <p className="text-sm text-neutral-600">
          This is a demonstration, so there is no real Prolific redirect. Continue to
          see what the apparatus captured during your run.
        </p>
        <Button onClick={onFinish}>Continue</Button>
      </div>
    </main>
  );
}
