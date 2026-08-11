"use client";

import { useEffect } from "react";
import { useTelemetry } from "./TelemetryProvider";
import { classifyFrame, type Rect } from "./classifyFrame";

/**
 * Interaction-state machine (Appendix A.1, PRD §5.3) — Stream 1 (entropy).
 *
 * Evaluated on EVERY animation frame (not a coarser poll), it classifies the frame
 * into one of the four states by precedence Modifying > Confirming > Hovering > Idle,
 * and writes a clean state-transition sequence to the shared session (session.stateLog).
 * The real Shannon entropy-rate calculation runs OFFLINE from this log (Appendix A.2);
 * this module only produces the correctly-precedenced sequence (D5a).
 *
 * D1 (catch-all): Idle is the DEFAULT/REST state — any frame where none of Modifying,
 * Confirming, or Hovering trigger is Idle. Appendix A.1's 2000ms rule is the formal
 * definition of sustained inactivity / re-entering Idle after defined activity; using
 * Idle as the general rest state (e.g. cursor drifting in blank space before the 2000ms
 * threshold) is a minor, DOCUMENTED extension of Appendix A.1, not something it states.
 *
 * D2 (single source of truth): the Confirming hit-test reuses the SAME
 * `[data-mandatory-click]` tagging used for volatility exclusion — there is no second
 * list of "which elements count as a submission/proceed control".
 *
 * Element hooks (queried live each frame so phase changes are picked up):
 *  - Hovering   → `[data-output-container]` (the AI output region of the shell)
 *  - Confirming → `[data-mandatory-click]`  (Send / Verify & Proceed / Submit) — D2
 *  - Modifying  → keystrokes targeting `[data-response-field]` (the brief textarea)
 */

// Smoothing windows (approximate, hardware/behaviour dependent — subject to validation
// during piloting, in the same spirit as Appendix A.3's note on the 2000ms threshold).
const MODIFYING_ACTIVE_MS = 1000; // keep "Modifying" across normal inter-keystroke gaps
const CONFIRMING_CLICK_MS = 400; // a click on a mandatory control reads as Confirming briefly
// Appendix A.1's formal idle threshold — retained for documentation of D1.
export const IDLE_THRESHOLD_MS = 2000;

export function useInteractionStateMachine(): void {
  const session = useTelemetry();

  useEffect(() => {
    let rafId = 0;
    // Cursor position in viewport coords (matches getBoundingClientRect). null until first move.
    let cursorX: number | null = null;
    let cursorY: number | null = null;
    let lastResponseKeystrokeAt = -Infinity; // session-clock ms
    let lastMandatoryClickAt = -Infinity; // session-clock ms

    const onMouseMove = (e: MouseEvent) => {
      cursorX = e.clientX;
      cursorY = e.clientY;
    };
    const onMouseDown = (e: MouseEvent) => {
      const target = e.target as Element | null;
      // D2: a click on a mandatory control feeds Confirming (same tagging as exclusion).
      if (target?.closest("[data-mandatory-click]")) {
        lastMandatoryClickAt = session.clock.now();
      }
    };
    const onKeyDown = (e: KeyboardEvent) => {
      const target = e.target as Element | null;
      // Modifying is scoped to the participant's response field (the brief), per A.1.
      if (target?.closest("[data-response-field]")) {
        lastResponseKeystrokeAt = session.clock.now();
      }
    };

    window.addEventListener("mousemove", onMouseMove, { passive: true });
    window.addEventListener("mousedown", onMouseDown, { passive: true });
    window.addEventListener("keydown", onKeyDown, { passive: true });

    const frame = () => {
      const now = session.clock.now();

      // Gather this frame's DOM inputs. D2: mandatory controls come from the single
      // [data-mandatory-click] source of truth (queried live so phase changes apply).
      const outputEl = document.querySelector("[data-output-container]");
      const mandatoryRects: Rect[] = [];
      for (const el of document.querySelectorAll("[data-mandatory-click]")) {
        mandatoryRects.push(el.getBoundingClientRect());
      }

      const state = classifyFrame({
        now,
        cursor: cursorX != null && cursorY != null ? { x: cursorX, y: cursorY } : null,
        lastResponseKeystrokeAt,
        lastMandatoryClickAt,
        outputRect: outputEl ? outputEl.getBoundingClientRect() : null,
        mandatoryRects,
        modifyingActiveMs: MODIFYING_ACTIVE_MS,
        confirmingClickMs: CONFIRMING_CLICK_MS,
      });

      session.recordState(state, now);
      rafId = requestAnimationFrame(frame);
    };
    rafId = requestAnimationFrame(frame);

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mousedown", onMouseDown);
      window.removeEventListener("keydown", onKeyDown);
      session.finalizeStates(session.clock.now());
    };
  }, [session]);
}
