"use client";

import { useState } from "react";
import {
  NASA_TLX_TITLE,
  NASA_TLX_INTRO_PARAGRAPHS,
  NASA_TLX_DIMENSIONS,
  type NasaTlxDimension,
} from "@/content/post-task-text";
import { Button } from "@/components/ui/Button";

export type NasaTlxResponses = Record<NasaTlxDimension["key"], number>;

/**
 * Raw NASA-TLX (Appendix H). Six dimensions, each a 21-point scale (0 to 100 in
 * 5-point increments) with descriptive endpoints, administered after the task and
 * before the CIT reflection. No pairwise weighting (that is what makes it "Raw").
 *
 * Each scale starts at the midpoint visually but is tracked as untouched until the
 * participant actually moves it, so Continue reflects a genuine response on all six
 * scales rather than six unexamined defaults.
 */
export function NasaTlx({
  onComplete,
}: {
  onComplete: (responses: NasaTlxResponses) => void;
}) {
  const [values, setValues] = useState<number[]>(() =>
    NASA_TLX_DIMENSIONS.map(() => 50),
  );
  const [touched, setTouched] = useState<boolean[]>(() =>
    NASA_TLX_DIMENSIONS.map(() => false),
  );
  const allTouched = touched.every(Boolean);

  function setValue(index: number, value: number) {
    setValues((prev) => prev.map((v, i) => (i === index ? value : v)));
    setTouched((prev) => prev.map((t, i) => (i === index ? true : t)));
  }

  function submit() {
    const responses = Object.fromEntries(
      NASA_TLX_DIMENSIONS.map((d, i) => [d.key, values[i]]),
    ) as NasaTlxResponses;
    onComplete(responses);
  }

  return (
    <main className="mx-auto w-full max-w-2xl px-4 py-12">
      <p className="text-sm font-medium uppercase tracking-wide text-neutral-500">
        After the task
      </p>
      <h1 className="mt-2 text-2xl font-semibold text-neutral-900">
        {NASA_TLX_TITLE}
      </h1>

      <div className="mt-5 space-y-3">
        {NASA_TLX_INTRO_PARAGRAPHS.map((p, i) => (
          <p key={i} className="text-[15px] leading-7 text-neutral-700">
            {p}
          </p>
        ))}
      </div>

      <div className="mt-8 space-y-8">
        {NASA_TLX_DIMENSIONS.map((dimension, i) => (
          <TlxScale
            key={dimension.key}
            dimension={dimension}
            value={values[i]}
            touched={touched[i]}
            onChange={(v) => setValue(i, v)}
          />
        ))}
      </div>

      <div className="mt-8 flex items-center justify-between">
        <p className="text-sm text-neutral-500">
          {touched.filter(Boolean).length} of {NASA_TLX_DIMENSIONS.length} scales
          answered.
        </p>
        <Button onClick={submit} disabled={!allTouched}>
          Continue
        </Button>
      </div>
    </main>
  );
}

function TlxScale({
  dimension,
  value,
  touched,
  onChange,
}: {
  dimension: NasaTlxDimension;
  value: number;
  touched: boolean;
  onChange: (value: number) => void;
}) {
  return (
    <div>
      <p className="font-medium text-neutral-900">{dimension.name}</p>
      <p className="mt-1 text-sm leading-6 text-neutral-600">
        {dimension.description}
      </p>

      <div className="mt-4">
        <input
          type="range"
          min={0}
          max={100}
          step={5}
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          className="w-full accent-neutral-900"
          aria-label={`${dimension.name}, ${dimension.lowEndpoint} to ${dimension.highEndpoint}`}
        />
        {/* 21 tick marks, purely visual, matching the paper's "21 tick marks" description. */}
        <div className="flex justify-between px-0.5" aria-hidden>
          {Array.from({ length: 21 }).map((_, i) => (
            <span key={i} className="h-1.5 w-px bg-neutral-300" />
          ))}
        </div>
        <div className="mt-1 flex justify-between text-xs font-medium text-neutral-500">
          <span>{dimension.lowEndpoint}</span>
          <span>{dimension.highEndpoint}</span>
        </div>
      </div>

      {!touched ? (
        <p className="mt-1.5 text-xs text-amber-600">
          Move the slider to record your response.
        </p>
      ) : null}
    </div>
  );
}
