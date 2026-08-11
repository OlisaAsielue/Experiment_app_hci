"use client";

import { useEffect } from "react";
import { useTelemetry } from "./TelemetryProvider";

/**
 * Stream 3 - cursor sampling for Tortuosity (D3, PRD section 5.4).
 *
 * Samples the cursor position on every animation frame (best-effort 60Hz; rAF pauses
 * when the tab is backgrounded, per the documented limitation in types.ts) into the
 * session's rolling buffer, which keeps ~CURSOR_BUFFER_MS (> the 3s window). The
 * tortuosity value itself is NOT computed here: it is computed ONCE, on final Submit,
 * by TaskScreen calling computeTortuosity over this buffer. That keeps the "compute on
 * Submit only, never on Verify & Proceed" guarantee explicit in one place.
 */
export function useCursorBuffer(): void {
  const session = useTelemetry();

  useEffect(() => {
    let rafId = 0;
    let cursorX: number | null = null;
    let cursorY: number | null = null;

    const onMouseMove = (e: MouseEvent) => {
      cursorX = e.clientX;
      cursorY = e.clientY;
    };
    window.addEventListener("mousemove", onMouseMove, { passive: true });

    const frame = () => {
      if (cursorX != null && cursorY != null) {
        session.pushCursorSample({ x: cursorX, y: cursorY, at: session.clock.now() });
      }
      rafId = requestAnimationFrame(frame);
    };
    rafId = requestAnimationFrame(frame);

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("mousemove", onMouseMove);
    };
  }, [session]);
}
