import { test } from "node:test";
import assert from "node:assert/strict";
import { classifyFrame, type FrameInputs } from "../classifyFrame.ts";

// Interaction-state classifier (D1 catch-all + D2 precedence/hit-test). See the
// spec block in lib/telemetry/types.ts. Run with `npm test`.

const OUTPUT = { left: 100, right: 400, top: 100, bottom: 400 };
const SUBMIT = { left: 500, right: 600, top: 500, bottom: 550 };
// Overlapping rect to test Confirming-over-Hovering precedence.
const OVERLAP_MANDATORY = { left: 150, right: 250, top: 150, bottom: 250 }; // inside OUTPUT

function base(overrides: Partial<FrameInputs> = {}): FrameInputs {
  return {
    now: 10_000,
    cursor: null,
    lastResponseKeystrokeAt: -Infinity,
    lastMandatoryClickAt: -Infinity,
    outputRect: OUTPUT,
    mandatoryRects: [SUBMIT],
    modifyingActiveMs: 1000,
    confirmingClickMs: 400,
    ...overrides,
  };
}

const cases: [string, FrameInputs, string][] = [
  ["no cursor, no activity -> Idle", base(), "Idle"],
  ["cursor in blank space -> Idle (catch-all)", base({ cursor: { x: 5, y: 5 } }), "Idle"],
  ["cursor over output -> Hovering", base({ cursor: { x: 250, y: 250 } }), "Hovering"],
  ["cursor over mandatory -> Confirming", base({ cursor: { x: 550, y: 525 } }), "Confirming"],
  ["recent keystroke -> Modifying", base({ lastResponseKeystrokeAt: 9_500 }), "Modifying"],
  [
    "Modifying beats Hovering (keystroke + cursor over output)",
    base({ cursor: { x: 250, y: 250 }, lastResponseKeystrokeAt: 9_800 }),
    "Modifying",
  ],
  [
    "Modifying beats Confirming (keystroke + cursor over mandatory)",
    base({ cursor: { x: 550, y: 525 }, lastResponseKeystrokeAt: 9_800 }),
    "Modifying",
  ],
  [
    "Confirming beats Hovering (mandatory rect overlapping the output rect)",
    base({ cursor: { x: 200, y: 200 }, mandatoryRects: [OVERLAP_MANDATORY] }),
    "Confirming",
  ],
  [
    "recent mandatory click -> Confirming even away from controls",
    base({ cursor: { x: 5, y: 5 }, lastMandatoryClickAt: 9_800 }),
    "Confirming",
  ],
  [
    "stale keystroke (> window) -> not Modifying",
    base({ cursor: { x: 5, y: 5 }, lastResponseKeystrokeAt: 8_500 }),
    "Idle",
  ],
  [
    "stale mandatory click (> window) + cursor over output -> Hovering",
    base({ cursor: { x: 250, y: 250 }, lastMandatoryClickAt: 9_000 }),
    "Hovering",
  ],
];

for (const [name, input, expected] of cases) {
  test(name, () => {
    assert.equal(classifyFrame(input), expected);
  });
}
