/**
 * ============================================================================
 *  PLACEHOLDER STIMULI  —  SWAP BEFORE ANY REAL USE
 * ============================================================================
 * Every string in this file is generated placeholder content, marked so you can
 * replace it with the final calibration abstract, fixed AI output, and task source
 * material later (PRD §8.7). It is deliberately plausible-but-fake academic prose.
 *
 * Constraints to preserve when you swap real content in:
 *  - The calibration abstract and the AI output should be ROUGHLY comparable in
 *    length (and, for the real study, readability / Flesch-Kincaid grade level).
 *    Word counts are DERIVED below (not hardcoded) so NPOIL stays correct if you
 *    edit the text.
 *  - The AI output is a SINGLE fixed synthesis used for every session and every
 *    condition — never generated live per participant (paper §4.3).
 * ============================================================================
 */

/** Count words the same way for calibration and output, so NPOIL is consistent. */
export function wordCount(text: string): number {
  return text.trim().split(/\s+/).filter(Boolean).length;
}

// ---------------------------------------------------------------------------
// Calibration abstract (baseline reading-velocity phase)
// ---------------------------------------------------------------------------
export const PLACEHOLDER_CALIBRATION_ABSTRACT = `Urban green corridors are increasingly promoted as a means of reconciling dense
development with ecological resilience, yet their effect on pollinator movement
remains unevenly documented. This study synthesises field observations from
eleven mid-sized European cities to assess how corridor width, plant diversity,
and connectivity to peri-urban habitat jointly shape bee and hoverfly abundance.
Across sites, corridors wider than roughly fifteen metres supported markedly more
stable pollinator communities than narrow verges, but width alone was a poor
predictor once floral diversity was accounted for. Corridors that linked to
larger habitat patches at their margins sustained visitation through late season,
when isolated strips declined sharply. The authors argue that connectivity and
planting composition, rather than raw area, should guide corridor design, and
that monitoring protocols standardised across municipalities would allow the
comparative evidence base to mature. They caution that short study windows may
understate year-to-year variation, and call for multi-season designs before firm
planning thresholds are set. [PLACEHOLDER — replace with final calibration abstract.]`;

// ---------------------------------------------------------------------------
// Fixed AI output (the single synthesis shown in BOTH conditions)
// ---------------------------------------------------------------------------
export const PLACEHOLDER_AI_OUTPUT = `Across the four provided sources, a consistent picture emerges: remote-work
productivity depends less on where work happens than on how teams coordinate
around it. The sources agree that individual focus tends to improve at home,
where interruptions are fewer, but diverge sharply on collaboration. Two studies
report that unplanned "corridor" exchanges — the informal contact that seeds new
ideas — fall substantially without deliberate replacement, while a third finds
that structured asynchronous practices recover most of that loss. Synthesising
these, the balance of evidence suggests distributed teams do not lose creativity
inherently; they lose the incidental conditions that produced it, which can be
partly re-engineered through explicit rituals. On wellbeing, the sources converge
more clearly: autonomy over schedule is repeatedly linked to lower reported
strain, provided expectations about availability are made explicit rather than
assumed. The weakest link across the set is measurement — each source defines
"productivity" differently, so apparent disagreements may be partly artefacts of
construct mismatch. A defensible summary is therefore cautious: remote arrangements
favour focused individual output and schedule autonomy, carry a real but
addressable cost to spontaneous collaboration, and remain hard to compare across
studies until shared measures are adopted. [PLACEHOLDER — replace with final AI output.]`;

// ---------------------------------------------------------------------------
// Task source material (what the participant is asked to synthesise)
// ---------------------------------------------------------------------------
export interface TaskSource {
  id: string;
  title: string;
  body: string;
}

export const PLACEHOLDER_TASK_SOURCES: TaskSource[] = [
  {
    id: "S1",
    title: "Source 1 — Focus and interruption in home vs office work",
    body: `A survey of 1,200 knowledge workers found self-reported deep-focus time was
about 22% higher on home days, attributed mainly to fewer ad-hoc interruptions.
The authors note the effect was strongest for individual analytical tasks and
weakest for tasks requiring frequent hand-offs. [PLACEHOLDER source text.]`,
  },
  {
    id: "S2",
    title: "Source 2 — Informal collaboration and idea generation",
    body: `An observational study of two engineering organisations reported a decline in
spontaneous cross-team exchanges after a shift to fully remote work, and linked
this to a measurable drop in novel project proposals over two quarters.
[PLACEHOLDER source text.]`,
  },
  {
    id: "S3",
    title: "Source 3 — Asynchronous practices as mitigation",
    body: `A field experiment introduced structured asynchronous rituals (written updates,
decision logs, office-hours blocks). Teams adopting them recovered most of the
proposal-rate decline seen elsewhere, suggesting the loss is process-related
rather than inherent to remote work. [PLACEHOLDER source text.]`,
  },
  {
    id: "S4",
    title: "Source 4 — Autonomy, availability, and wellbeing",
    body: `A longitudinal study associated schedule autonomy with lower burnout scores, but
only when teams set explicit availability norms; ambiguous expectations erased
the benefit. Productivity was defined idiosyncratically across the surveyed
literature. [PLACEHOLDER source text.]`,
  },
];

// ---------------------------------------------------------------------------
// Condition B — the five sequential reveal stages (paper §4.3)
// ---------------------------------------------------------------------------
export const CONDITION_B_STAGES = [
  "Source extraction",
  "Thematic clustering",
  "Cross-source comparison",
  "Synthesis drafting",
  "Final verification",
] as const;

export type ConditionBStage = (typeof CONDITION_B_STAGES)[number];

/**
 * Per-stage content for Condition B's five-stage reveal.
 *
 * Stages 1–4 are intermediate "pipeline" artifacts (placeholder). Stage 5 ("Final
 * verification") is the COMPLETE synthesis and is deliberately the SAME text as the
 * Condition A output (PLACEHOLDER_AI_OUTPUT) — both conditions must end on identical
 * content; only the reveal differs (paper §4.3). When you swap in final content,
 * keep stage 5 identical to the Condition A output.
 */
export interface ConditionBStageContent {
  title: ConditionBStage;
  /** Whether this stage is the final full synthesis (rendered in the read-only panel). */
  isFinal: boolean;
  body: string;
}

export const CONDITION_B_STAGE_CONTENT: ConditionBStageContent[] = [
  {
    title: "Source extraction",
    isFinal: false,
    body: `Pulled the key claim from each source:
• S1 — home days show ~22% more deep-focus time; effect strongest for solo analytical work.
• S2 — fully-remote shift coincided with fewer spontaneous cross-team exchanges and fewer novel proposals.
• S3 — structured asynchronous rituals recovered most of that proposal-rate decline.
• S4 — schedule autonomy linked to lower burnout, but only with explicit availability norms.
[PLACEHOLDER intermediate artifact.]`,
  },
  {
    title: "Thematic clustering",
    isFinal: false,
    body: `Grouped the extracted claims into three themes:
1. Individual focus (S1) — improves remotely.
2. Collaboration & idea generation (S2, S3) — at risk, but recoverable.
3. Wellbeing & autonomy (S4) — conditional on explicit norms.
[PLACEHOLDER intermediate artifact.]`,
  },
  {
    title: "Cross-source comparison",
    isFinal: false,
    body: `Compared the sources for agreement and tension:
• Agreement: remote work aids focused individual output (S1) and schedule autonomy aids wellbeing (S4).
• Tension: S2 frames lost collaboration as a real cost; S3 argues it is process-related and recoverable.
• Caveat: "productivity" is defined differently across S1–S4, so some disagreement may be measurement artefact.
[PLACEHOLDER intermediate artifact.]`,
  },
  {
    title: "Synthesis drafting",
    isFinal: false,
    body: `Rough draft before final verification:
Distributed teams keep individual focus and gain schedule autonomy, but lose the incidental
conditions behind spontaneous collaboration — a cost that structured async practice can largely
offset. Cross-study comparison stays limited by inconsistent definitions of productivity.
[PLACEHOLDER intermediate draft.]`,
  },
  {
    title: "Final verification",
    isFinal: true,
    // Identical to the Condition A output — both conditions end on the same content.
    body: PLACEHOLDER_AI_OUTPUT,
  },
];

// Derived word counts (used by NPOIL — do not hardcode).
export const CALIBRATION_WORD_COUNT = wordCount(PLACEHOLDER_CALIBRATION_ABSTRACT);
export const AI_OUTPUT_WORD_COUNT = wordCount(PLACEHOLDER_AI_OUTPUT);
