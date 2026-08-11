/**
 * ============================================================================
 *  PLACEHOLDER STIMULI  -  SWAP BEFORE ANY REAL USE
 * ============================================================================
 * Every string in this file is generated placeholder content. It is original prose
 * (not lifted from any published source) written to read as plausible, coherent
 * academic writing, because real people meet it as their first hands-on interaction
 * with the apparatus (a marker via the paper's live demo link; funders via the RWO
 * page's "try it yourself" call to action). Swap in the final study content later.
 *
 * The placeholder status is marked at the CODE level (this header and the
 * PLACEHOLDER_* naming), deliberately NOT inside the visible strings, so readers see
 * clean text rather than filler tags.
 *
 * Constraints to preserve when you swap real content in:
 *  - The calibration abstract and the AI output should be ROUGHLY comparable in
 *    length (and, for the real study, readability / Flesch-Kincaid grade level).
 *    Word counts are DERIVED below (not hardcoded) so NPOIL stays correct if you
 *    edit the text.
 *  - The AI output is a SINGLE fixed synthesis used for every session and every
 *    condition, never generated live per participant (paper section 4.3). The
 *    calibration abstract must be on an UNRELATED topic to the task.
 * ============================================================================
 */

/** Count words the same way for calibration and output, so NPOIL is consistent. */
export function wordCount(text: string): number {
  return text.trim().split(/\s+/).filter(Boolean).length;
}

// ---------------------------------------------------------------------------
// Calibration abstract (baseline reading-velocity phase). Topic is deliberately
// UNRELATED to the remote-work task below.
// ---------------------------------------------------------------------------
export const PLACEHOLDER_CALIBRATION_ABSTRACT = `Urban green corridors are increasingly promoted as a way to reconcile dense
development with ecological resilience, yet their effect on pollinator movement
remains unevenly documented. This study synthesises field observations from eleven
mid-sized European cities to assess how corridor width, planting diversity, and
connectivity to peri-urban habitat jointly shape the abundance of bees and
hoverflies. Across the sampled sites, corridors wider than roughly fifteen metres
supported markedly more stable pollinator communities than narrow verges, although
width alone proved a weak predictor once floral diversity was taken into account.
Corridors that connected to larger habitat patches at their margins sustained
visitation into the late season, when isolated strips declined sharply. The authors
argue that connectivity and planting composition, rather than raw area, should guide
corridor design, and that monitoring protocols standardised across municipalities
would allow the comparative evidence base to mature. They caution that the relatively
short observation window may understate year to year variation, and they call for
multi-season designs before firm planning thresholds are adopted. The findings are
offered as a provisional guide for planners rather than a settled prescription, and
they invite replication in cities with differing climates and street layouts.`;

// ---------------------------------------------------------------------------
// Fixed AI output (the single synthesis shown in BOTH conditions).
// ---------------------------------------------------------------------------
export const PLACEHOLDER_AI_OUTPUT = `Across the four sources, a consistent picture emerges: the productivity of remote
work depends less on where the work happens than on how teams coordinate around it.
The sources agree that individual focus tends to improve at home, where interruptions
are fewer, but they diverge on collaboration. Two report that unplanned exchanges, the
informal contact that seeds new ideas, fall substantially when they are not
deliberately replaced, while a third finds that structured asynchronous practices
recover most of that loss. Taken together, the balance of evidence suggests that
distributed teams do not lose creativity inherently; they lose the incidental
conditions that produced it, which can be partly re-engineered through explicit
routines. On wellbeing the sources converge more clearly: autonomy over one's schedule
is repeatedly linked to lower reported strain, provided that expectations about
availability are made explicit rather than assumed. The weakest link across the set is
measurement, since each source defines productivity differently, so some apparent
disagreement may be an artefact of mismatched definitions. A defensible summary is
therefore cautious: remote arrangements favour focused individual output and schedule
autonomy, carry a real but addressable cost to spontaneous collaboration, and remain
difficult to compare across studies until shared measures are adopted.`;

// ---------------------------------------------------------------------------
// Task source material (what the participant is asked to synthesise).
// ---------------------------------------------------------------------------
export interface TaskSource {
  id: string;
  title: string;
  body: string;
}

export const PLACEHOLDER_TASK_SOURCES: TaskSource[] = [
  {
    id: "S1",
    title: "Source 1. Focus and interruption in home versus office work",
    body: `A survey of 1,200 knowledge workers found that self-reported deep-focus time was
about a fifth higher on days worked from home, which the authors attribute mainly to
fewer unplanned interruptions. The effect was strongest for solitary analytical tasks
and weakest for work that required frequent handovers between colleagues.`,
  },
  {
    id: "S2",
    title: "Source 2. Informal collaboration and idea generation",
    body: `An observational study of two engineering organisations recorded a fall in
spontaneous cross-team exchanges after a shift to fully remote work, and linked this
decline to a measurable drop in the number of novel project proposals over the
following two quarters.`,
  },
  {
    id: "S3",
    title: "Source 3. Asynchronous practices as mitigation",
    body: `A field experiment introduced structured asynchronous routines, including written
status updates, shared decision logs, and fixed office-hours blocks. Teams that
adopted them recovered most of the decline in proposal rates seen elsewhere,
suggesting that the loss is a matter of process rather than an inherent feature of
remote work.`,
  },
  {
    id: "S4",
    title: "Source 4. Autonomy, availability, and wellbeing",
    body: `A longitudinal study associated greater control over one's schedule with lower
burnout scores, but only where teams had agreed explicit norms about availability;
where expectations were left ambiguous, the benefit disappeared. Across the studies
surveyed, productivity was defined in inconsistent ways.`,
  },
];

// ---------------------------------------------------------------------------
// Condition B. The five sequential reveal stages (paper section 4.3).
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
 * Stages 1 to 4 are intermediate pipeline artefacts. Stage 5 ("Final verification")
 * is the COMPLETE synthesis and is deliberately the SAME text as the Condition A
 * output (PLACEHOLDER_AI_OUTPUT), because both conditions must end on identical
 * content; only the reveal differs (paper section 4.3). When you swap in final
 * content, keep stage 5 identical to the Condition A output.
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
    body: `Extracted the central claim from each source.
S1: focus time rises by roughly a fifth at home, chiefly through fewer interruptions.
S2: fully remote working coincided with fewer spontaneous cross-team exchanges and fewer new proposals.
S3: structured asynchronous routines recovered most of that decline.
S4: schedule autonomy was linked to lower burnout, but only where availability norms were explicit.`,
  },
  {
    title: "Thematic clustering",
    isFinal: false,
    body: `Grouped the extracted claims into three themes.
First, individual focus, which tends to improve under remote work.
Second, collaboration and idea generation, which is at risk but appears recoverable.
Third, wellbeing and autonomy, which is conditional on clear norms about availability.`,
  },
  {
    title: "Cross-source comparison",
    isFinal: false,
    body: `Compared the sources for agreement and tension.
They agree that remote work supports focused individual output (S1) and that schedule
autonomy supports wellbeing (S4). They differ on collaboration: S2 treats the lost
contact as a genuine cost, while S3 argues it is recoverable through better process. A
recurring caveat is that productivity is defined differently across the set, so some
disagreement may be more apparent than real.`,
  },
  {
    title: "Synthesis drafting",
    isFinal: false,
    body: `Drafted a provisional synthesis before final checking.
Distributed teams retain individual focus and gain autonomy over their schedules, but
they lose the incidental contact that drives spontaneous collaboration, a cost that
structured asynchronous practice can largely offset. Comparison across studies remains
limited by inconsistent definitions of productivity.`,
  },
  {
    title: "Final verification",
    isFinal: true,
    // Identical to the Condition A output. Both conditions end on the same content.
    body: PLACEHOLDER_AI_OUTPUT,
  },
];

// Derived word counts (used by NPOIL, do not hardcode).
export const CALIBRATION_WORD_COUNT = wordCount(PLACEHOLDER_CALIBRATION_ABSTRACT);
export const AI_OUTPUT_WORD_COUNT = wordCount(PLACEHOLDER_AI_OUTPUT);
