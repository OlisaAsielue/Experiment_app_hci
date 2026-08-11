/**
 * Contract between the shared TaskScreen and a condition-specific reveal component.
 *
 * The reveal component renders ONLY the AI-output region content and controls how
 * the fixed output is revealed (Condition A: full at once after processing;
 * Condition B: five gated stages). It must call `onOutputVisible` exactly once, at
 * the moment the output first becomes fully visible - this is the NPOIL start point
 * (Condition A: full output appears; Condition B: the fifth/final stage appears).
 */
export interface RevealProps {
  /** True once the participant has sent their command (generation has begun). */
  started: boolean;
  /** Call once when the full output first becomes visible. */
  onOutputVisible: () => void;
}
