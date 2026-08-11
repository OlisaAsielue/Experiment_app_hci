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
    <main className="mx-auto w-full max-w-[42rem] px-6 pb-24">
      {/* Hero - carries the one authored motion moment (.rwo-rise), reduced-motion safe */}
      <section className="rwo-rise pt-20 sm:pt-28">
        <h1 className="text-pretty text-[2rem] font-semibold leading-[1.1] tracking-[-0.02em] text-neutral-900 sm:text-[2.75rem] sm:leading-[1.06]">
          {c.hero.headline}
        </h1>
        <p className="mt-6 text-lg leading-8 text-neutral-600">
          <Placeholders text={c.hero.body} />
        </p>
        <div className="mt-9">
          <DemoButton>{c.hero.cta}</DemoButton>
        </div>
      </section>

      <Section heading={c.problem.heading} paragraphs={c.problem.paragraphs} />

      <Section heading={c.built.heading} paragraphs={c.built.paragraphs} />

      {/* How we measure it - the signals list sits on one quiet surface (single
          elevation: a hairline border, no competing shadow). */}
      <Section heading={c.measure.heading}>
        <p className="text-[1.0625rem] leading-8 text-neutral-700">
          {c.measure.intro}
        </p>
        <ul className="mt-6 space-y-3.5 rounded-2xl border border-neutral-200 bg-white p-6">
          {c.measure.bullets.map((b, i) => (
            <li
              key={i}
              className="flex gap-3.5 text-[0.95rem] leading-7 text-neutral-700"
            >
              <span
                aria-hidden
                className="mt-[0.7rem] h-1.5 w-1.5 shrink-0 rounded-full bg-neutral-900"
              />
              <span>{b}</span>
            </li>
          ))}
        </ul>
        <p className="mt-6 text-[1.0625rem] leading-8 text-neutral-700">
          {c.measure.outro}
        </p>
        <div className="mt-8">
          <DemoButton>{c.measure.cta}</DemoButton>
        </div>
      </Section>

      <Section heading={c.funding.heading} paragraphs={c.funding.paragraphs} />

      {/* Next step */}
      <Section heading={c.next.heading}>
        <DemoButton>{c.next.cta}</DemoButton>
        <p className="mt-6 text-[0.95rem] leading-7 text-neutral-500">
          <Placeholders text={c.next.contact} />
        </p>
      </Section>
    </main>
  );
}

/**
 * A section with a hairline top rule and generous space ABOVE the heading, tighter
 * below it (craft floor: more space above a heading than below). Accepts either a
 * `paragraphs` array or arbitrary `children`.
 */
function Section({
  heading,
  paragraphs,
  children,
}: {
  heading: string;
  paragraphs?: readonly string[];
  children?: ReactNode;
}) {
  return (
    <section className="mt-16 border-t border-neutral-200 pt-16 sm:mt-20 sm:pt-20">
      <h2 className="text-[1.35rem] font-semibold tracking-[-0.01em] text-neutral-900">
        {heading}
      </h2>
      <div className="mt-5">
        {paragraphs
          ? paragraphs.map((p, i) => (
              <p
                key={i}
                className="mt-4 text-[1.0625rem] leading-8 text-neutral-700 first:mt-0"
              >
                <Placeholders text={p} />
              </p>
            ))
          : children}
      </div>
    </section>
  );
}

function DemoButton({ children }: { children: ReactNode }) {
  return (
    <Link
      href="/demo"
      className="group inline-flex items-center gap-2 rounded-xl bg-neutral-900 px-5 py-3 text-sm font-medium text-white shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:bg-neutral-800 hover:shadow-md"
    >
      {children}
      <span
        aria-hidden
        className="transition-transform duration-200 group-hover:translate-x-0.5"
      >
        &rarr;
      </span>
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
