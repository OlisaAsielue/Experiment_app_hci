/**
 * ============================================================================
 *  STUDY TEXT - verbatim from docs/capstone-paper.md, Appendices D, E, F
 * ============================================================================
 * This file is transcribed content, not authored copy. Bracketed placeholders
 * ([STUDY TITLE], [RESEARCHER NAME], [ETHICS REFERENCE NUMBER], etc.) are left
 * exactly as they appear in the paper and must render as visible placeholder text
 * on screen. Do not invent or guess values for them.
 *
 * The debrief's deception disclosure (DEBRIEF_DECEPTION_BLOCK) is kept as its own
 * exported constant, transcribed word for word, so it is never touched by a later
 * edit to the surrounding blocks.
 *
 * One thing flagged rather than silently dropped: the PIS appendix in the source
 * document ends with a stray line, "Would you like to format the Consent Form text
 * next, or do you have data tables from the methodology section that need to be
 * structured for the main paper?", sitting between the PIS and Appendix E. This
 * reads as a leftover AI-drafting-assistant prompt that was not part of the
 * researcher's intended participant-facing text, so it is deliberately NOT
 * transcribed here. Worth removing from the source document itself.
 * ============================================================================
 */

export interface TextBlock {
  heading?: string;
  /** Paragraphs rendered before any bullets. */
  paragraphs?: string[];
  bullets?: string[];
  /** Paragraphs rendered after the bullets (same block, same heading). */
  afterBullets?: string[];
}

export interface HeaderField {
  label: string;
  value: string;
}

// ---------------------------------------------------------------------------
// Appendix D - Participant Information Sheet
// ---------------------------------------------------------------------------
export const PIS_TITLE = "Participant Information Sheet";

export const PIS_HEADER_FIELDS: HeaderField[] = [
  {
    label: "Study title",
    value: '[STUDY TITLE - e.g. "How people interact with AI research assistants"]',
  },
  { label: "Researcher", value: "[RESEARCHER NAME], [INSTITUTION], [RESEARCHER EMAIL]" },
  { label: "Supervisor", value: "[SUPERVISOR NAME], [INSTITUTION], [SUPERVISOR EMAIL]" },
  { label: "Ethics approval reference", value: "[ETHICS REFERENCE NUMBER]" },
];

export const PIS_INTRO =
  "Please read this information carefully before deciding whether to take part. Take as long as you need, and feel free to contact the researcher (details at the end) if anything is unclear.";

export const PIS_BLOCKS: TextBlock[] = [
  {
    heading: "What is this study about?",
    paragraphs: [
      "We are studying how people interact with AI research tools, precisely how the design of an AI assistant's interface shapes the way people work with it during a short reading-and-writing task.",
      'To keep the study fair, some specific details about what we are comparing are not described here. They are fully explained in a debrief at the end (see "Is any information being withheld?" below). This is a normal and approved research practice.',
    ],
  },
  {
    heading: "Do I have to take part?",
    paragraphs: [
      'No. Taking part is completely voluntary. If you decide not to, that is absolutely fine and will not affect you in any way. If you do take part, you can stop at any time (see "What are my rights?").',
    ],
  },
  {
    heading: "What will I be asked to do?",
    paragraphs: ["If you agree to take part, you will:"],
    bullets: [
      "Confirm your consent on the next page.",
      "Read a short academic abstract and click a button when you have finished. This helps us understand your normal reading pace.",
      "Complete a 15-minute academic literature synthesis task consisting of reading source material and producing a short summary brief with the help of a built-in AI research tool.",
      "Answer a short standard questionnaire about how the task felt (mental effort, frustration, and similar).",
      "Write a brief reflection describing one moment during the task that stood out to you.",
      "Read a debrief page that explains the full purpose of the study.",
    ],
    afterBullets: [
      "The whole session takes approximately 15 minutes. You will need a desktop or laptop computer with a mouse or trackpad.",
    ],
  },
  {
    heading: "Will I be paid?",
    paragraphs: [
      "Yes. You will be paid £3.70 through Prolific for completing the study, in line with Prolific's fair-pay guidelines. Payment is handled by Prolific in the usual way.",
    ],
  },
  {
    heading: "What data will you collect about me?",
    paragraphs: [
      "While you work on the task, the application records how you interact with the interface. This is continuous it happens throughout the task, not just at specific moments. Specifically, we record:",
    ],
    bullets: [
      "Mouse cursor movement, sampled many times per second (up to 60 times a second),",
      "Keystroke patterns (such as typing and deleting, but not used to reconstruct passwords or personal text elsewhere),",
      "The timing of your actions (for example, how long you pause before doing something), and",
      "Your clicks on the interface.",
    ],
    afterBullets: [
      "We also collect your answers to the questionnaire and your written reflection.",
      'We do not collect cookies, your IP address, your location, your name, or any other information that could directly identify you. Your Prolific ID is replaced with a random code ("pseudonymised") the moment you enter the study, and it is stored separately from everything else.',
    ],
  },
  {
    heading: "Is any information being withheld from me?",
    paragraphs: [
      "Yes and we want to be upfront that this is the case. To keep the comparison at the heart of this study fair, some details about what the study is testing are withheld until the end. Nothing about this withholding poses any risk to you. As soon as you finish, a debrief page will explain everything that was withheld and why. If, after reading the debrief, you are not comfortable with your data being used, you can ask for it to be deleted.",
    ],
  },
  {
    heading: "How is my data stored and protected?",
    paragraphs: [
      "Your data is sent over an encrypted connection and stored in a secure database hosted in the UK (AWS London region), in line with UK GDPR.",
      "Your Prolific ID is pseudonymised on entry and kept in a separate store from your interaction and questionnaire data, so the two cannot be casually linked.",
      "Consent and payment records are also kept separate from the research data.",
      "Only the research team can access the data, and it is used solely for this research.",
    ],
  },
  {
    heading: "What are my rights?",
    paragraphs: [
      "You can withdraw at any time during the task by closing the browser tab or returning the study on Prolific. You do not have to give a reason.",
      "After completing the study, you can ask us to delete your data. Because your data is pseudonymised, you will need to quote your Prolific ID so we can find and remove your specific record. You can request this up to the deletion window (4 weeks after participation) by emailing the researcher.",
      "Taking part, or choosing not to, has no consequences for you either way.",
    ],
  },
  {
    heading: "Who has reviewed and approved this study?",
    paragraphs: [
      "This study has been reviewed and approved by [ETHICS COMMITTEE / REVIEW BOARD NAME], reference [ETHICS REFERENCE NUMBER].",
    ],
  },
  {
    heading: "Who can I contact?",
    paragraphs: [
      "Researcher: [RESEARCHER NAME], [RESEARCHER EMAIL]",
      "Supervisor: [SUPERVISOR NAME], [SUPERVISOR EMAIL]",
      "If you have concerns about how this study has been conducted, you can contact [ETHICS CONTACT / DEPARTMENT OFFICE] at [ETHICS CONTACT EMAIL].",
      "To request deletion of your data, email the researcher above quoting your Prolific ID.",
    ],
  },
];

export const PIS_CLOSING =
  "Thank you for taking the time to read this. If you are happy to continue, please proceed to the consent form.";

// ---------------------------------------------------------------------------
// Appendix E - Consent Form
// ---------------------------------------------------------------------------
export const CONSENT_TITLE = "Consent Form";

export const CONSENT_HEADER_FIELDS: HeaderField[] = [
  { label: "Study title", value: "[STUDY TITLE]" },
  { label: "Researcher", value: "[RESEARCHER NAME], [RESEARCHER EMAIL]" },
  { label: "Ethics approval reference", value: "[ETHICS REFERENCE NUMBER]" },
];

export const CONSENT_INTRO =
  "Please read each statement below and tick the box to confirm you agree. You must tick all boxes to take part. If there is any statement you do not agree with, please do not proceed you are free to leave the study.";

/** All 8 statements, verbatim, in order. Numbering is applied by the UI, not baked in. */
export const CONSENT_STATEMENTS: string[] = [
  "I confirm that I have read and understood the Participant Information Sheet for this study, and I have had the opportunity to consider the information and ask questions.",
  "I understand that my interaction behaviour will be recorded continuously during the task: including my mouse movements (sampled many times per second), my keystroke patterns, the timing of my actions, and my clicks. As detailed in the Participant Information Sheet.",
  "I understand that some details about the purpose of the study are withheld until the end, and that these will be fully explained to me in a debrief immediately after I finish.",
  "I understand that my participation is voluntary, and that I am free to withdraw at any time during the task without giving a reason and without any penalty.",
  "I understand that I can request deletion of my data after completing the study by contacting the researcher and quoting my Prolific ID, up to the deletion window.",
  "I consent to my anonymised data being used for this research, including in reports, a dissertation, and any resulting academic publications.",
  "I understand how my data will be stored and protected (pseudonymised, held on an encrypted connection in the UK, and kept separately from my Prolific ID), as described in the Participant Information Sheet.",
  "I agree to take part in this study.",
];

export const CONSENT_FOOTER =
  "By ticking all boxes above and proceeding, you confirm your consent to take part in this study on the terms described.";

// ---------------------------------------------------------------------------
// Appendix F - Debrief
// ---------------------------------------------------------------------------
export const DEBRIEF_TITLE = "Debrief";

export const DEBRIEF_HEADER_FIELDS: HeaderField[] = [
  { label: "Study title", value: "[STUDY TITLE]" },
  { label: "Researcher", value: "[RESEARCHER NAME], [RESEARCHER EMAIL]" },
  { label: "Supervisor", value: "[SUPERVISOR NAME], [SUPERVISOR EMAIL]" },
  { label: "Ethics approval reference", value: "[ETHICS REFERENCE NUMBER]" },
];

export const DEBRIEF_BLOCKS_BEFORE_DECEPTION: TextBlock[] = [
  {
    heading: "Thank you",
    paragraphs: [
      "Thank you for taking part. You have now completed the study. This page explains what the study was really about, including the details that were withheld earlier. Please read it before you leave.",
    ],
  },
  {
    heading: "What was this study actually investigating?",
    paragraphs: [
      "This study is investigating how the design of an AI tool's interface affects the way people engage with its output, in particular whether an interface that reveals AI output gradually and asks you to verify it at each step leads to more active, critical engagement than one that presents a finished result all at once.",
      "There were two versions of the tool, and participants were assigned to one of them at random:",
    ],
    bullets: [
      "One version presented the AI's output all at once as a finished result.",
      'The other revealed the output across five sequential stages, asking you to confirm ("Verify & Proceed") at each stage before continuing.',
    ],
    afterBullets: [
      "We measured differences in how people interacted with each version. We did not describe this comparison at the start because knowing exactly what we were comparing could have changed how you naturally behaved, which would have undermined the results. This is called incomplete disclosure, and it is an approved research practice for exactly this kind of study.",
    ],
  },
];

/**
 * The deception disclosure. Transcribed word for word from Appendix F and kept as
 * its own constant deliberately, so it is never paraphrased, shortened, or merged
 * into surrounding copy by a later edit. This wording is doing real ethical work.
 */
export const DEBRIEF_DECEPTION_BLOCK: TextBlock = {
  heading: "The part we need to be explicit about",
  paragraphs: [
    "There is one specific thing we withheld that we want to state plainly:",
    'The AI output you received was pre-generated in advance. It was not produced live during your task. What looked like the AI "working" was a staged processing sequence with short delays. This was a deliberate simulation of live AI generation, not a real-time response to your specific actions.',
    "Why we did this: if the tool had genuinely generated a fresh response for each participant, everyone would have received slightly different text. Any differences we then measured between the two versions could have been caused by the content being different, rather than by the interface design we were actually studying. By giving every participant the same pre-generated output and only changing how it was revealed, we can be confident that any differences we find are due to the interface design and nothing else. This is a standard technique for keeping conditions fairly comparable.",
    "We recognise that simulating live generation is deception. We hope this explanation makes clear why it was necessary, and that it posed no risk to you.",
  ],
};

export const DEBRIEF_BLOCKS_AFTER_DECEPTION: TextBlock[] = [
  {
    heading: "Your data and your rights",
    paragraphs: [
      "Your data remains pseudonymised and stored securely on an encrypted connection in the UK (AWS London region), in line with UK GDPR. Your Prolific ID is kept separately from your interaction and questionnaire data.",
      "You are still free to request that your data be deleted. To do this, email the researcher (below) and quote your Prolific ID, up to the deletion window. You do not need to give a reason.",
      "No cookies, IP addresses, or other identifying information were collected at any point.",
    ],
  },
  {
    heading: "Questions or concerns?",
    paragraphs: [
      "If you have any questions about the study, would like to know more about the findings, or have any concerns, please contact:",
      "Researcher: [RESEARCHER NAME], [RESEARCHER EMAIL]",
      "Supervisor: [SUPERVISOR NAME], [SUPERVISOR EMAIL]",
      "If you have concerns about how this study was conducted, you can contact [ETHICS CONTACT / DEPARTMENT OFFICE] at [ETHICS CONTACT EMAIL].",
    ],
  },
  {
    heading: "Thank you",
    paragraphs: [
      "Your participation genuinely helps us understand how to design AI tools that support careful, thoughtful work. We are grateful for your time.",
    ],
  },
];

export const DEBRIEF_FINISH_NOTE =
  "Please click [Finish / Complete] to return to Prolific and confirm your completion.";
