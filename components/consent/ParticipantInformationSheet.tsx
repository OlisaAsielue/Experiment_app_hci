"use client";

import {
  PIS_TITLE,
  PIS_HEADER_FIELDS,
  PIS_INTRO,
  PIS_BLOCKS,
  PIS_CLOSING,
} from "@/content/study-text";
import { HeaderFields, TextBlocks } from "./LegalTextBlocks";
import { Button } from "@/components/ui/Button";

export function ParticipantInformationSheet({
  onContinue,
}: {
  onContinue: () => void;
}) {
  return (
    <main className="mx-auto w-full max-w-2xl px-4 py-12">
      <p className="text-sm font-medium uppercase tracking-wide text-neutral-500">
        Before you take part
      </p>
      <h1 className="mt-2 text-2xl font-semibold text-neutral-900">{PIS_TITLE}</h1>

      <div className="mt-5">
        <HeaderFields fields={PIS_HEADER_FIELDS} />
      </div>

      <p className="mt-6 text-[15px] leading-7 text-neutral-700">{PIS_INTRO}</p>

      <div className="mt-6">
        <TextBlocks blocks={PIS_BLOCKS} />
      </div>

      <p className="mt-6 text-[15px] leading-7 text-neutral-700">{PIS_CLOSING}</p>

      <div className="mt-8 flex justify-end">
        <Button onClick={onContinue}>I have read this, continue</Button>
      </div>
    </main>
  );
}
