import Link from "next/link";
import type { ReactNode } from "react";
import { RWO_COPY } from "@/content/rwo-copy";

/**
 * "/" - the Real-World Output (RWO) funder explainer (PRD sections 1a, 9). A single
 * scrollable, professional page aimed at grant/funding readers, with the demo one
 * click away. All prose lives in content/rwo-copy.ts; this file is layout only, so
 * the final prose pass edits copy without touching the page.
 *
 * Bracketed placeholders ([named PI], [contact]) render as visible, clearly-marked
 * placeholder text (see Placeholders below), matching the consent/PIS pattern.
 */
export default function Home() {
  const c = RWO_COPY;
  return (
    <main className="mx-auto w-full max-w-3xl px-6 py-16 sm:py-24">
      {/* Hero */}
      <section>
        <p className="text-sm font-medium uppercase tracking-wide text-neutral-500">
          Research proposal
        </p>
        <h1 className="mt-3 text-3xl font-semibold leading-tight tracking-tight text-neutral-900 sm:text-4xl">
          <Placeholders text={c.hero.headline} />
        </h1>
        <p className="mt-5 text-lg leading-8 text-neutral-600">
          <Placeholders text={c.hero.body} />
        </p>
        <div className="mt-8">
          <DemoButton>{c.hero.cta}</DemoButton>
        </div>
      </section>

      <Section heading={c.problem.heading} paragraphs={c.problem.paragraphs} />

      <Section heading={c.built.heading} paragraphs={c.built.paragraphs} />

      {/* How we measure it - the bullets get a card to stand out */}
      <section className="mt-14 border-t border-neutral-200 pt-14">
        <h2 className="text-xl font-semibold text-neutral-900">
          {c.measure.heading}
        </h2>
        <p className="mt-4 text-[17px] leading-8 text-neutral-700">
          {c.measure.intro}
        </p>
        <ul className="mt-5 space-y-2.5 rounded-xl border border-neutral-200 bg-white p-5">
          {c.measure.bullets.map((b, i) => (
            <li key={i} className="flex gap-3 text-[15px] leading-7 text-neutral-700">
              <span aria-hidden className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-neutral-400" />
              <span>{b}</span>
            </li>
          ))}
        </ul>
        <p className="mt-5 text-[17px] leading-8 text-neutral-700">
          {c.measure.outro}
        </p>
        <div className="mt-7">
          <DemoButton>{c.measure.cta}</DemoButton>
        </div>
      </section>

      <Section heading={c.funding.heading} paragraphs={c.funding.paragraphs} />

      {/* Next step */}
      <section className="mt-14 border-t border-neutral-200 pt-14">
        <h2 className="text-xl font-semibold text-neutral-900">{c.next.heading}</h2>
        <div className="mt-5">
          <DemoButton>{c.next.cta}</DemoButton>
        </div>
        <p className="mt-5 text-[15px] leading-7 text-neutral-600">
          <Placeholders text={c.next.contact} />
        </p>
      </section>
    </main>
  );
}

function Section({
  heading,
  paragraphs,
}: {
  heading: string;
  paragraphs: readonly string[];
}) {
  return (
    <section className="mt-14 border-t border-neutral-200 pt-14">
      <h2 className="text-xl font-semibold text-neutral-900">{heading}</h2>
      <div className="mt-4 space-y-4">
        {paragraphs.map((p, i) => (
          <p key={i} className="text-[17px] leading-8 text-neutral-700">
            <Placeholders text={p} />
          </p>
        ))}
      </div>
    </section>
  );
}

function DemoButton({ children }: { children: ReactNode }) {
  return (
    <Link
      href="/demo"
      className="inline-flex items-center justify-center rounded-lg bg-neutral-900 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-neutral-800"
    >
      {children} &rarr;
    </Link>
  );
}

/**
 * Renders text, styling any [bracketed] placeholder as visibly-marked draft text so
 * a funder reads it as an intentional gap to be filled, not a typo. The final prose
 * pass replaces the placeholders in content/rwo-copy.ts.
 */
function Placeholders({ text }: { text: string }) {
  const parts = text.split(/(\[[^\]]+\])/g);
  return (
    <>
      {parts.map((part, i) =>
        /^\[[^\]]+\]$/.test(part) ? (
          <span
            key={i}
            className="rounded bg-amber-100 px-1 italic text-amber-800"
            title="Placeholder - to be filled in the final prose pass"
          >
            {part}
          </span>
        ) : (
          part
        ),
      )}
    </>
  );
}
