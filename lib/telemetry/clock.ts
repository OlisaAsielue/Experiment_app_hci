/**
 * SessionClock - the single monotonic clock every telemetry stream timestamps
 * against (PRD §5 cross-cutting: "All four streams must be timestamped against a
 * single session clock").
 *
 * Uses performance.now() (monotonic, ms, sub-ms resolution). t0 is captured at
 * construction; now() returns ms elapsed since t0, so every stream shares one
 * zero-point and cross-metric alignment (e.g. "what was entropy doing during the
 * high-NPOIL window") is trivial.
 */
export class SessionClock {
  readonly t0: number;

  constructor() {
    this.t0 = performance.now();
  }

  /** Milliseconds since the session clock started. */
  now(): number {
    return performance.now() - this.t0;
  }
}
