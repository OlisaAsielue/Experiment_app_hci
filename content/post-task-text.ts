/**
 * ============================================================================
 *  POST-TASK INSTRUMENTS - Raw NASA-TLX (verbatim) and CIT (authored)
 * ============================================================================
 * NASA-TLX section is transcribed verbatim from docs/capstone-paper.md,
 * Appendix H. One stray line in the source ("ADD SCREENSHOT WHEN APPARATUS
 * BUILT ?", an editorial note left at the end of the appendix) is deliberately
 * not transcribed, same treatment as the stray line already flagged in the PIS.
 *
 * The CIT section has no exact participant-facing script in the paper, only the
 * academic description (section 4.6: "asks participants to describe one moment
 * of peak friction across antecedent, incident, and outcome") and the PIS's own
 * neutral bullet ("Write a brief reflection describing one moment during the
 * task that stood out to you"). CIT_INTRO and CIT_PLACEHOLDER below are
 * therefore AUTHORED copy, not transcribed, written to match the PIS's neutral
 * framing (not "friction", which risks leading a participant toward only
 * negative moments) while still eliciting the antecedent/incident/outcome
 * structure Flanagan's technique needs, per PRD section 8.6: a single free-text
 * box with that structure given as placeholder guidance, not three enforced
 * fields.
 * ============================================================================
 */

// ---------------------------------------------------------------------------
// Appendix H - Raw NASA-TLX (verbatim)
// ---------------------------------------------------------------------------
export const NASA_TLX_TITLE = "Workload questionnaire";

export const NASA_TLX_INTRO_PARAGRAPHS: string[] = [
  'We are not only interested in assessing your performance but also the experiences you had during the task. Right now we are going to describe the technique that will be used to examine your experience. In the most general sense we are examining the "workload" you experienced. Workload is a difficult concept to define precisely, but a simple one to understand generally. The factors that influence your experience of workload may come from the task itself, your feelings about your own performance, how much effort you put in, or the stress and frustration you felt.',
  'Since workload is something that is experienced individually by each person, there are no effective "rulers" that can be used to estimate the workload of different activities. Because workload may be caused by many different factors, we would like you to evaluate several of them individually rather than lumping them into a single global evaluation of overall workload. Please read the descriptions of the scales carefully. It is extremely important that they be clear to you.',
  'You will evaluate the task by marking each of the six scales at the point which matches your experience. Each line has two endpoint descriptors that describe the scale. Note that "Performance" goes from "Good" on the left to "Poor" on the right. Please consider your responses carefully. Consider each scale individually.',
];

export interface NasaTlxDimension {
  key:
    | "mental_demand"
    | "physical_demand"
    | "temporal_demand"
    | "performance"
    | "effort"
    | "frustration";
  name: string;
  lowEndpoint: string;
  highEndpoint: string;
  description: string;
}

/** Six subscale definitions, verbatim, in the paper's order. */
export const NASA_TLX_DIMENSIONS: NasaTlxDimension[] = [
  {
    key: "mental_demand",
    name: "Mental Demand",
    lowEndpoint: "Low",
    highEndpoint: "High",
    description:
      "How much mental and perceptual activity was required (e.g., thinking, deciding, calculating, remembering, looking, searching, etc.)? Was the task easy or demanding, simple or complex, exacting or forgiving?",
  },
  {
    key: "physical_demand",
    name: "Physical Demand",
    lowEndpoint: "Low",
    highEndpoint: "High",
    description:
      "How much physical activity was required (e.g., pushing, pulling, turning, controlling, activating, etc.)? Was the task easy or demanding, slow or brisk, slack or strenuous, restful or laborious?",
  },
  {
    key: "temporal_demand",
    name: "Temporal Demand",
    lowEndpoint: "Low",
    highEndpoint: "High",
    description:
      "How much time pressure did you feel due to the rate or pace at which the task elements occurred? Was the pace slow and leisurely or rapid and frantic?",
  },
  {
    key: "performance",
    name: "Performance",
    lowEndpoint: "Good",
    highEndpoint: "Poor",
    description:
      "How successful do you think you were in accomplishing the goals of the task set by the experimenter (or yourself)? How satisfied were you with your performance in accomplishing these goals?",
  },
  {
    key: "effort",
    name: "Effort",
    lowEndpoint: "Low",
    highEndpoint: "High",
    description:
      "How hard did you have to work (mentally and physically) to accomplish your level of performance?",
  },
  {
    key: "frustration",
    name: "Frustration",
    lowEndpoint: "Low",
    highEndpoint: "High",
    description:
      "How insecure, discouraged, irritated, stressed and annoyed versus secure, gratified, content, relaxed and complacent did you feel during the task?",
  },
];

// ---------------------------------------------------------------------------
// Critical Incident Technique (authored, see file header)
// ---------------------------------------------------------------------------
export const CIT_TITLE = "One moment that stood out";

export const CIT_INTRO =
  "Think of one moment during the task that stood out to you, in either direction. Describe it below in a few sentences.";

export const CIT_PLACEHOLDER = `Before it happened: what were you doing, and what led up to this moment?

What happened: describe the moment itself.

Afterwards: what was the result, and how did it affect what you did next?`;
