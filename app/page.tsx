import Link from "next/link";
import type { ReactNode } from "react";
import { RWO_COPY } from "@/content/rwo-copy";
import { Reveal } from "@/components/rwo/Reveal";

/**
 * "/" - the Real-World Output (RWO) funder explainer. A single scrollable,
 * professional page aimed at grant/funding readers, with the demo one click away.
 *
 * Order is deliberate: hook, then the ask, then the primary CTA, so a funder can
 * reach the amount and try the tool before reading any argument. "What we built /
 * how we measure" and "why it matters" support that, they do not gate it.
 *
 * All prose lives in content/rwo-copy.ts (sourced from the grant proposal); this
 * file is layout only. Motion is the reduced-motion-safe <Reveal> wrapper plus the
 * hero's one-shot .rwo-rise. Bracketed placeholders ([contact]) render as visibly
 * marked draft text (see Placeholders), matching the consent/PIS pattern.
 */
export default function Home() {
  const c = RWO_COPY;
  return (
    <main className="mx-auto w-full max-w-[42rem] px-6 pb-24">
      {/* Hero - carries the one authored load animation (.rwo-rise), reduced-motion safe */}
      <section className="rwo-rise pt-20 sm:pt-28">
        <h1 className="text-pretty text-[2rem] font-semibold leading-[1.1] tracking-[-0.02em] text-neutral-900 sm:text-[2.75rem] sm:leading-[1.06]">
          {c.hero.headline}
        </h1>
        <p className="mt-6 text-lg leading-8 text-neutral-600">{c.hero.body}</p>
        <div className="mt-9">
          <DemoButton>{c.hero.cta}</DemoButton>
        </div>
      </section>

      {/* The ask - promoted directly under the hero, real figures, amount pulled out large */}
      <Reveal>
        <Section heading={c.ask.heading}>
          <p className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
            <span className="text-[2.75rem] font-semibold leading-none tracking-[-0.02em] text-neutral-900 sm:text-[3.25rem]">
              {c.ask.amount}
            </span>
            <span className="text-[1.0625rem] leading-7 text-neutral-500">
              {c.ask.amountCaption}
            </span>
          </p>
          <div className="mt-6 space-y-3">
            {c.ask.lines.map((line, i) => (
              <p
                key={i}
                className="text-[1.0625rem] leading-8 text-neutral-700"
              >
                {line}
              </p>
            ))}
          </div>
        </Section>
      </Reveal>

      {/* Try it - primary CTA promoted high, immediately after the ask */}
      <Reveal>
        <Section heading={c.tryIt.heading}>
          <p className="text-[1.0625rem] leading-8 text-neutral-700">
            {c.tryIt.body}
          </p>
          <div className="mt-7">
            <DemoButton>{c.tryIt.cta}</DemoButton>
          </div>
        </Section>
      </Reveal>

      {/* What we built + how we measure it - merged, with the condition sketch */}
      <Reveal>
        <Section heading={c.system.heading}>
          {c.system.built.map((p, i) => (
            <p
              key={i}
              className="mt-4 text-[1.0625rem] leading-8 text-neutral-700 first:mt-0"
            >
              {p}
            </p>
          ))}

          <ConditionSketch comparison={c.system.comparison} />

          <p className="mt-8 text-[1.0625rem] leading-8 text-neutral-700">
            {c.system.measureIntro}
          </p>
          <ul className="mt-6 space-y-3.5 rounded-2xl border border-neutral-200 bg-white p-6">
            {c.system.signals.map((b, i) => (
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
            {c.system.measureOutro}
          </p>
        </Section>
      </Reveal>

      {/* Why it matters - shortened supporting context, points to the written proposal */}
      <Reveal>
        <Section
          heading={c.problem.heading}
          paragraphs={c.problem.paragraphs}
        />
      </Reveal>

      {/* Next step */}
      <Reveal>
        <Section heading={c.next.heading}>
          <DemoButton>{c.next.cta}</DemoButton>
          <p className="mt-6 text-[0.95rem] leading-7 text-neutral-500">
            <Placeholders text={c.next.contact} />
          </p>
        </Section>
      </Reveal>
    </main>
  );
}

/**
 * A section with a hairline top rule and generous space ABOVE the heading, tighter
 * below it (more space above a heading than below). Accepts either a `paragraphs`
 * array or arbitrary `children`.
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

/**
 * The one illustrative element on the page: a restrained, monochrome side-by-side
 * of the two versions, showing that the only difference is one step versus verify
 * at each stage. Kept in the app's fixed neutral palette (no colour, no icons) so
 * it reads as a diagram, not decoration. Labels come from content/rwo-copy.ts.
 */
function ConditionSketch({
  comparison,
}: {
  comparison: (typeof RWO_COPY)["system"]["comparison"];
}) {
  const { caption, conditionA, conditionB } = comparison;
  return (
    <figure className="mt-8">
      <div className="grid gap-4 sm:grid-cols-2">
        <SketchPanel condition={conditionA} />
        <SketchPanel condition={conditionB} />
      </div>
      <figcaption className="mt-3 text-center text-[0.8rem] text-neutral-500">
        {caption}
      </figcaption>
    </figure>
  );
}

function SketchPanel({
  condition,
}: {
  condition: {
    label: string;
    title: string;
    steps: readonly string[];
    note: string;
  };
}) {
  return (
    <div className="rounded-2xl border border-neutral-200 bg-white p-5">
      <p className="text-[0.7rem] font-medium uppercase tracking-wide text-neutral-400">
        {condition.label}
      </p>
      <p className="mt-1 text-[0.95rem] font-semibold text-neutral-900">
        {condition.title}
      </p>
      <div className="mt-4 flex flex-wrap items-center gap-x-2 gap-y-2">
        {condition.steps.map((step, i) => (
          <span key={i} className="flex items-center gap-2">
            {i > 0 && (
              <span aria-hidden className="text-neutral-300">
                &rarr;
              </span>
            )}
            <span className="rounded-md border border-neutral-200 bg-neutral-50 px-2.5 py-1 text-[0.8rem] text-neutral-700">
              {step}
            </span>
          </span>
        ))}
      </div>
      <p className="mt-4 text-[0.8rem] leading-6 text-neutral-500">
        {condition.note}
      </p>
    </div>
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
