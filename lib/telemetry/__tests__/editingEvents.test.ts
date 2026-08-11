import { test } from "node:test";
import assert from "node:assert/strict";
import {
  classifyEdit,
  initialVolatilityState,
  type VolatilityState,
} from "../editingEvents.ts";

// Input & Editing Volatility classifier (D4). The rule is stateful, so the run is
// one ordered sequence threading `state` through each edit. See lib/telemetry/types.ts.

// [newLength, at, expectedType, note]
const steps: [number, number, "corrective" | "additive", string][] = [
  // Typing from scratch, no prior deletion -> additive.
  [1, 0, "additive", "type char 1"],
  [2, 100, "additive", "type char 2"],
  [3, 200, "additive", "type char 3"],
  [4, 300, "additive", "type char 4"],
  [5, 400, "additive", "type char 5"],
  // Backspace -> always corrective; threshold L = 5.
  [4, 1000, "corrective", "delete (5->4)"],
  // Retype within window, not past L=5 -> corrective.
  [5, 1200, "corrective", "retype back to 5 (<=5)"],
  // Type past L -> additive (recovered).
  [6, 1300, "additive", "exceed original length (6>5)"],
  [7, 1400, "additive", "keep typing after recovery"],
  // New deletion sets L=7.
  [6, 2000, "corrective", "delete (7->6)"],
  // Window expiry: > 5s after the deletion -> additive even though 7<=7.
  [7, 8000, "additive", "retype after window expired"],
  // Two deletions in a row: 7->6 (L=7), then 6->5 (L updates to 6).
  [6, 10000, "corrective", "delete (7->6), L=7"],
  [5, 10100, "corrective", "delete (6->5), L=6"],
  // Retype within window, not past L=6 -> corrective; then past -> additive.
  [6, 10200, "corrective", "retype to 6 (<=6)"],
  [7, 10300, "additive", "exceed 6 -> additive"],
  // Multi-char deletion (selection): 7 -> 2 -> corrective; L=7.
  [2, 11000, "corrective", "multi-char delete (7->2)"],
  // Paste back several chars but still <= 7 within window -> corrective.
  [7, 11200, "corrective", "paste back up to 7 (<=7)"],
  [8, 11300, "additive", "exceed 7 -> additive"],
];

test("classifyEdit sequence (delete/retype/window/recovery/multi-delete)", () => {
  let state: VolatilityState = initialVolatilityState();
  let corrective = 0;
  for (const [len, at, expected, note] of steps) {
    const { type, next } = classifyEdit(state, len, at);
    assert.equal(type, expected, note);
    state = next;
    if (type === "corrective") corrective++;
  }
  // Corrective count for this exact sequence.
  assert.equal(corrective, 8);
});
