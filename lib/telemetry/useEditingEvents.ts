"use client";

import { useEffect, useRef } from "react";
import { useTelemetry } from "./TelemetryProvider";
import {
  classifyEdit,
  initialVolatilityState,
  type VolatilityState,
} from "./editingEvents";

/**
 * Stream 2 - Input & Editing Volatility (D4, PRD section 5.2).
 *
 * Listens (delegated, at the document) for:
 *  - `input` events targeting the response field ([data-response-field]) - each is
 *    classified corrective/additive by the pure classifyEdit rule and logged.
 *  - `click` events on any mandatory control ([data-mandatory-click], the single
 *    source of truth shared with the state machine, D2) - logged as `mandatory_click`
 *    and therefore never counted toward volatility (exclusion at capture time).
 *
 * Volatility = session.editingEvents filtered to `corrective`.
 */
export function useEditingEvents(): void {
  const session = useTelemetry();
  const stateRef = useRef<VolatilityState>(initialVolatilityState());

  useEffect(() => {
    const onInput = (e: Event) => {
      const target = e.target as Element | null;
      const field = target?.closest("[data-response-field]") as
        | HTMLTextAreaElement
        | HTMLInputElement
        | null;
      if (!field) return;
      const at = session.clock.now();
      const { type, next } = classifyEdit(stateRef.current, field.value.length, at);
      stateRef.current = next;
      session.addEditingEvent({ type, at });
    };

    const onClick = (e: MouseEvent) => {
      const target = e.target as Element | null;
      if (target?.closest("[data-mandatory-click]")) {
        session.addEditingEvent({ type: "mandatory_click", at: session.clock.now() });
      }
    };

    document.addEventListener("input", onInput, true);
    document.addEventListener("click", onClick, true);
    return () => {
      document.removeEventListener("input", onInput, true);
      document.removeEventListener("click", onClick, true);
    };
  }, [session]);
}
