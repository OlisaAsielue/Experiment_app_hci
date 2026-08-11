"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { TelemetrySession } from "./session";

const TelemetryContext = createContext<TelemetrySession | null>(null);

/**
 * TelemetryProvider - creates ONE TelemetrySession for the whole run and hands it to
 * the tree. Mount it around the run (calibration through submit) so every stream
 * shares one clock and one store. Created via a lazy useState initializer so the
 * instance (and its SessionClock t0) is stable across re-renders and made exactly once.
 */
export function TelemetryProvider({
  children,
  sessionCode,
}: {
  children: ReactNode;
  /** Pseudonymised session code generated at entry (DemoFlow), reused here so
   * every persisted row and every in-memory stream share the same session_code. */
  sessionCode?: string;
}) {
  const [session] = useState(() => new TelemetrySession(sessionCode));

  // Dev-only: expose the session for inspection/debugging. Never in production.
  useEffect(() => {
    if (process.env.NODE_ENV !== "production") {
      (window as unknown as { __telemetrySession?: TelemetrySession }).__telemetrySession =
        session;
    }
  }, [session]);

  return (
    <TelemetryContext.Provider value={session}>
      {children}
    </TelemetryContext.Provider>
  );
}

export function useTelemetry(): TelemetrySession {
  const session = useContext(TelemetryContext);
  if (!session) {
    throw new Error("useTelemetry must be used within a <TelemetryProvider>");
  }
  return session;
}
