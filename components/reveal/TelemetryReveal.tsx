"use client";

import { useTelemetry } from "@/lib/telemetry/TelemetryProvider";
import { Button } from "@/components/ui/Button";
import type { CursorSample } from "@/lib/telemetry/types";

/**
 * TelemetryReveal - the demo-only "here is what we captured" screen (PRD item 11).
 *
 * CANNOT PERSIST, FULL STOP: this component reads ONLY the in-memory TelemetrySession.
 * There is deliberately no import of anything under lib/supabase and no network call
 * anywhere in this path, so it cannot write data regardless of the PERSIST_DATA flag
 * state. The real study would never show participants their own telemetry.
 *
 * All four values describe ONE consistent span: the post-output window, from when the
 * answer became fully visible (outputVisibleAt) to Submit (submittedAt). NPOIL and
 * tortuosity are inherently that span; corrective edits and the activity-switching
 * estimate are scoped to it too, so every figure is about the same stretch of time.
 */
export function TelemetryReveal({ onRestart }: { onRestart: () => void }) {
  const session = useTelemetry();
  const from = session.outputVisibleAt;
  const to = session.submittedAt;

  // Corrective edits, scoped to the post-output window for span consistency.
  const correctiveEdits = session.editingEvents.filter(
    (e) =>
      e.type === "corrective" &&
      (from == null || e.at > from) &&
      (to == null || e.at <= to),
  ).length;

  return (
    <main className="mx-auto w-full max-w-2xl px-4 py-12">
      <p className="text-sm font-medium uppercase tracking-wide text-neutral-500">
        Demonstration only
      </p>
      <h1 className="mt-2 text-2xl font-semibold text-neutral-900">
        Here is what we captured
      </h1>
      <p className="mt-3 text-neutral-600">
        In the moments after the answer appeared, the tool quietly recorded how you
        worked with it. The real study would not show you this. It is here so you can
        see what the measurement looks like.
      </p>

      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        <NpoilCard npoilMs={session.npoilMs} />
        <CorrectiveCard count={correctiveEdits} />
        <SwitchingCard estimate={session.liveEntropyEstimate} />
        <CursorCard
          tortuosity={session.tortuosity}
          window={session.tortuosityWindow}
        />
      </div>

      <div className="mt-8 flex items-center justify-between">
        <p className="text-sm text-neutral-500">
          None of this was stored. It exists only in your browser for this run.
        </p>
        <Button variant="secondary" onClick={onRestart}>
          Try again
        </Button>
      </div>
    </main>
  );
}

function Card({
  label,
  value,
  children,
}: {
  label: string;
  value?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-xl border border-neutral-200 bg-white p-5">
      <p className="text-xs font-medium uppercase tracking-wide text-neutral-400">
        {label}
      </p>
      {value ? (
        <p className="mt-1 text-2xl font-semibold text-neutral-900">{value}</p>
      ) : null}
      <div className="mt-2 text-sm leading-6 text-neutral-600">{children}</div>
    </div>
  );
}

function NpoilCard({ npoilMs }: { npoilMs: number | null }) {
  if (npoilMs == null) {
    return (
      <Card label="Post-output pause">
        We could not measure your post-output pause this time.
      </Card>
    );
  }
  const seconds = npoilMs / 1000;
  const abs = Math.abs(seconds).toFixed(1);
  if (Math.abs(seconds) < 0.1) {
    return (
      <Card label="Post-output pause" value="about as expected">
        You paused about as long as your own reading speed predicts.
      </Card>
    );
  }
  if (seconds > 0) {
    return (
      <Card label="Post-output pause" value={`+${abs}s`}>
        You paused about {abs} seconds longer than your reading speed predicts, which
        suggests you were evaluating the answer rather than just reading it.
      </Card>
    );
  }
  return (
    <Card label="Post-output pause" value={`-${abs}s`}>
      You moved on about {abs} seconds faster than your reading speed predicts.
    </Card>
  );
}

function CorrectiveCard({ count }: { count: number }) {
  if (count === 0) {
    return (
      <Card label="Corrections while writing" value="0">
        You did not backspace or retype. Your summary went in as first written.
      </Card>
    );
  }
  return (
    <Card label="Corrections while writing" value={String(count)}>
      You made {count} correction{count === 1 ? "" : "s"} (backspacing or retyping)
      while writing your summary.
    </Card>
  );
}

function SwitchingCard({
  estimate,
}: {
  estimate: { switchesPerSecond: number; windowMs: number } | null;
}) {
  if (!estimate || estimate.windowMs === 0) {
    return (
      <Card label="Activity switching (estimate)">
        Not enough activity was captured to estimate this.
      </Card>
    );
  }
  const sps = estimate.switchesPerSecond.toFixed(1);
  return (
    <Card label="Activity switching (estimate)" value={`${sps}/s`}>
      You switched between reading, editing, and confirming about {sps} times per
      second. This is a rough live estimate for illustration, not the study&rsquo;s
      full entropy measure.
    </Card>
  );
}

function CursorCard({
  tortuosity,
  window,
}: {
  tortuosity: number | null;
  window: CursorSample[] | null;
}) {
  if (tortuosity == null || !window || window.length < 2) {
    return (
      <Card label="Cursor path (last 3 seconds)">
        You submitted quickly, so we did not capture enough cursor movement in the
        final few seconds to measure this.
      </Card>
    );
  }
  return (
    <Card label="Cursor path (last 3 seconds)" value={`${tortuosity.toFixed(1)}x`}>
      <CursorSketch window={window} />
      <p className="mt-2">
        In the last three seconds your cursor travelled about {tortuosity.toFixed(1)}{" "}
        times the straight-line distance. Near 1 is a direct path; higher means more
        wandering.
      </p>
    </Card>
  );
}

/** Small SVG sketch of the EXACT window tortuosity scored (the picture matches the number). */
function CursorSketch({ window }: { window: CursorSample[] }) {
  const W = 260;
  const H = 90;
  const PAD = 8;
  const xs = window.map((s) => s.x);
  const ys = window.map((s) => s.y);
  const minX = Math.min(...xs);
  const maxX = Math.max(...xs);
  const minY = Math.min(...ys);
  const maxY = Math.max(...ys);
  const spanX = Math.max(1, maxX - minX);
  const spanY = Math.max(1, maxY - minY);
  const scale = Math.min((W - 2 * PAD) / spanX, (H - 2 * PAD) / spanY);
  const ox = PAD + ((W - 2 * PAD) - spanX * scale) / 2;
  const oy = PAD + ((H - 2 * PAD) - spanY * scale) / 2;
  const pt = (s: CursorSample) => [
    ox + (s.x - minX) * scale,
    oy + (s.y - minY) * scale,
  ];
  const points = window.map((s) => pt(s).join(",")).join(" ");
  const [sx, sy] = pt(window[0]);
  const [ex, ey] = pt(window[window.length - 1]);
  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      className="w-full rounded-md border border-neutral-200 bg-neutral-50"
      role="img"
      aria-label="Sketch of your cursor path in the final three seconds"
    >
      <polyline
        points={points}
        fill="none"
        stroke="#525252"
        strokeWidth={1.5}
        strokeLinejoin="round"
        strokeLinecap="round"
      />
      <circle cx={sx} cy={sy} r={3} fill="#a3a3a3" />
      <circle cx={ex} cy={ey} r={3} fill="#171717" />
    </svg>
  );
}
