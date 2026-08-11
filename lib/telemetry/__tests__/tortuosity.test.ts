import { test } from "node:test";
import assert from "node:assert/strict";
import { computeTortuosity, TORTUOSITY_MIN_SAMPLES } from "../tortuosity.ts";

// Cursor Trajectory Tortuosity (D3): L/D, plus the three explicit edge cases and the
// V&P exclusion. See lib/telemetry/types.ts and tortuosity.ts.

type S = { x: number; y: number; at: number };
const near = (a: number, b: number, eps = 1e-9) => Math.abs(a - b) <= eps;

/** N samples along a straight horizontal line ending at `end`. */
function line(n: number, end: number, x0 = 0, y = 0): S[] {
  const out: S[] = [];
  for (let i = 0; i < n; i++) out.push({ x: x0 + i, y, at: end - (n - 1 - i) });
  return out;
}

test("straight line -> 1.0", () => {
  const t = computeTortuosity({ samples: line(20, 100_000), submitAt: 100_000, minSamples: 2 });
  assert.ok(t !== null && near(t, 1.0));
});

test("right-angle path L=7 D=5 -> 1.4", () => {
  const submitAt = 90_010; // keep samples inside [submitAt-3000, submitAt]
  const samples: S[] = [];
  for (let i = 0; i <= 3; i++) samples.push({ x: i, y: 0, at: 90_000 + i });
  for (let j = 1; j <= 4; j++) samples.push({ x: 3, y: j, at: 90_003 + j });
  const t = computeTortuosity({ samples, submitAt, minSamples: 2 });
  assert.ok(t !== null && near(t as number, 1.4));
});

test("still cursor (D ~ 0) -> 1.0 fallback, not NaN/Infinity", () => {
  const samples: S[] = [];
  for (let i = 0; i < 30; i++) samples.push({ x: 500, y: 500, at: 100_000 - i });
  assert.equal(computeTortuosity({ samples, submitAt: 100_000 }), 1.0);
});

test("below min-sample floor -> null", () => {
  const samples = line(TORTUOSITY_MIN_SAMPLES - 1, 100_000);
  assert.equal(computeTortuosity({ samples, submitAt: 100_000 }), null);
});

test("window slice excludes samples older than 3s", () => {
  const old: S[] = [
    { x: 0, y: 0, at: 100_000 - 5000 },
    { x: 1000, y: 1000, at: 100_000 - 4000 }, // huge detour, must be excluded
  ];
  const recent = line(20, 100_000, 0, 0);
  const t = computeTortuosity({ samples: [...old, ...recent], submitAt: 100_000, minSamples: 2 });
  assert.ok(t !== null && near(t as number, 1.0, 1e-6));
});

test("V&P exclusion drops flagged samples", () => {
  const recent = line(20, 100_000, 0, 0);
  const vpTime = 100_000 - 1500;
  const wild: S = { x: 9999, y: 9999, at: vpTime };
  const withWild = [...recent.slice(0, 10), wild, ...recent.slice(10)];
  const excluded = computeTortuosity({
    samples: withWild,
    submitAt: 100_000,
    minSamples: 2,
    excludeTimestamps: [vpTime],
  });
  const notExcluded = computeTortuosity({ samples: withWild, submitAt: 100_000, minSamples: 2 });
  assert.ok(excluded !== null && near(excluded as number, 1.0, 1e-6));
  assert.ok((notExcluded as number) > 100); // without exclusion the wild sample inflates it
});
