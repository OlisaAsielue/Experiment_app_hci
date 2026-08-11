/**
 * Shared domain types for the apparatus.
 * Kept intentionally small; telemetry-specific types live under lib/telemetry/.
 */

/** The single manipulated independent variable: Interface Agency. */
export type Condition = "A" | "B";

export const CONDITION_LABELS: Record<Condition, string> = {
  A: "Version A",
  B: "Version B",
};
