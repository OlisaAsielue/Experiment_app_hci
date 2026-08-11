import { test } from "node:test";
import assert from "node:assert/strict";
import {
  computeReadingVelocity,
  computeExpectedReadingTimeMs,
  computeNpoilMs,
} from "../npoil.ts";

// NPOIL (H1's primary metric, paper §4.6 / §5.1). The three-step calculation, with
// the sign convention (positive = paused longer; negative preserved, never clamped)
// and the zero-calibration-words guard.

test("reading velocity = calibration time / word count", () => {
  assert.equal(computeReadingVelocity(2000, 100), 20); // 20 ms/word
});

test("expected reading time = velocity * output words", () => {
  assert.equal(computeExpectedReadingTimeMs(20, 200), 4000); // 4000 ms
});

test("positive pause: paused longer than reading predicts -> positive NPOIL", () => {
  // velocity 20 ms/word, output 200 words -> expected 4000 ms; actual pause 6000 ms.
  assert.equal(computeNpoilMs(6000, 20, 200), 2000);
});

test("negative pause: moved on faster than expected -> negative NPOIL (preserved)", () => {
  // expected 4000 ms; actual pause only 1000 ms -> -3000, NOT clamped to 0.
  const npoil = computeNpoilMs(1000, 20, 200);
  assert.equal(npoil, -3000);
  assert.ok(npoil < 0);
});

test("zero calibration words: velocity guard returns 0 (no divide-by-zero)", () => {
  const velocity = computeReadingVelocity(2000, 0);
  assert.equal(velocity, 0);
  // With velocity 0, expected reading time is 0, so NPOIL is just the raw pause.
  assert.equal(computeExpectedReadingTimeMs(velocity, 200), 0);
  assert.equal(computeNpoilMs(1500, velocity, 200), 1500);
});
