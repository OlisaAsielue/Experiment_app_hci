import type { HeaderField, TextBlock } from "@/content/study-text";

/**
 * Shared renderer for the PIS and Debrief content (content/study-text.ts). Purely
 * presentational: renders the transcribed text as given, adding no wording of its
 * own beyond layout structure.
 */
export function HeaderFields({ fields }: { fields: HeaderField[] }) {
  return (
    <dl className="space-y-1 rounded-lg border border-neutral-200 bg-neutral-50 p-4 text-sm">
      {fields.map((f) => (
        <div key={f.label} className="flex flex-col sm:flex-row sm:gap-2">
          <dt className="shrink-0 font-medium text-neutral-500">{f.label}:</dt>
          <dd className="text-neutral-700">{f.value}</dd>
        </div>
      ))}
    </dl>
  );
}

export function TextBlocks({ blocks }: { blocks: TextBlock[] }) {
  return (
    <div className="space-y-6">
      {blocks.map((b, i) => (
        <section key={i}>
          {b.heading ? (
            <h2 className="text-base font-semibold text-neutral-900">{b.heading}</h2>
          ) : null}
          {b.paragraphs?.map((p, j) => (
            <p key={j} className="mt-2 text-[15px] leading-7 text-neutral-700">
              {p}
            </p>
          ))}
          {b.bullets ? (
            <ul className="mt-2 list-disc space-y-1.5 pl-5">
              {b.bullets.map((item, j) => (
                <li key={j} className="text-[15px] leading-7 text-neutral-700">
                  {item}
                </li>
              ))}
            </ul>
          ) : null}
          {b.afterBullets?.map((p, j) => (
            <p key={`a${j}`} className="mt-2 text-[15px] leading-7 text-neutral-700">
              {p}
            </p>
          ))}
        </section>
      ))}
    </div>
  );
}
