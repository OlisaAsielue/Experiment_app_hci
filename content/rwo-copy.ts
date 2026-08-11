/**
 * ============================================================================
 *  RWO EXPLAINER COPY ("/" route) - single editable content file
 * ============================================================================
 * The funder-facing explainer text, kept in ONE place (PRD section 9) so the
 * final prose pass - which happens separately as the very last build step - can
 * edit copy here without touching the page component.
 *
 * This is DRAFT copy transcribed from docs/rwo-explainer-copy.md. Bracketed
 * placeholders ([named PI], [contact]) are left as visible placeholder text on
 * screen for now, matching the pattern used for the consent/PIS placeholders;
 * they are filled in during the final prose pass, not guessed at here.
 * ============================================================================
 */

export const RWO_COPY = {
  hero: {
    headline:
      "People are starting to trust AI without checking it. This project measures the moment that happens, and tests a way to stop it.",
    body: "As AI tools get faster and more fluent, the effort of checking their output starts to feel optional. The result is a quiet shift from doing the work to rubber-stamping it. We built a working tool that can detect that shift as it happens, and a design intervention that appears to slow it down.",
    cta: "Try the demo",
  },

  problem: {
    heading: "The problem",
    paragraphs: [
      "Most AI tools are built to remove friction: fewer clicks, faster answers, a finished result in one step. That is good for speed. It may be quietly bad for judgement.",
      "When a tool hands someone a polished answer with no visible working, the easiest thing to do is accept it. Do that often enough and the habit of checking starts to fade. People report reaching a point where they are no longer really evaluating what the AI gives them, they are just passing it along. We call that state cognitive surrender: the point where active, critical engagement stops.",
      "This is not a hypothetical concern. In accounts from people using AI for real knowledge work, the same pattern recurs: a gradual slide from using the tool to depending on it, often noticed only after it has already happened.",
    ],
  },

  built: {
    heading: "What we built",
    paragraphs: [
      "A working web application with two versions of the same AI research tool.",
      "One version behaves like most tools on the market: you ask, it thinks, it hands you a finished answer to read and accept. The other makes you a participant in the process, it reveals its work in stages and asks you to check each one before it continues.",
      "Crucially, both versions give the exact same answer. The only thing that changes is how much the tool asks you to engage with it. That lets us isolate one question cleanly: does being kept in the loop actually change how carefully people work?",
    ],
  },

  measure: {
    heading: "How we measure it",
    intro:
      "The tool watches how you interact, not just what you conclude. Without interrupting the task, it captures signals that are hard to fake and easy to miss:",
    bullets: [
      "how long you pause before accepting an answer, compared with how long it should take you to read it",
      "how much you revise and correct your own work",
      "how varied or repetitive your patterns of activity are",
      "how your cursor moves in the moments before you commit",
    ],
    outro:
      "Together these act as a proxy for whether someone is genuinely evaluating the output or simply moving through it. When you try the demo, we will show you your own signals at the end, a concrete picture of something that is normally invisible.",
    cta: "See it for yourself",
  },

  funding: {
    heading: "What funding enables",
    paragraphs: [
      "The apparatus already exists and works, you can try it right now. What remains is running it at scale: a controlled study comparing the two versions across enough people to draw firm conclusions, with the behavioural measurement validated against how people describe their own experience.",
      "This proposal seeks funding to run that study. The technical instrument, the measurement approach, and the experimental design are built and ready; the ask is for the resources to deploy them properly. The research would be conducted in collaboration with [named PI] as proposed collaborating Principal Investigator.",
      "Most funding proposals ask you to imagine the thing that would be built. This one lets you use it first.",
    ],
  },

  next: {
    heading: "Next step",
    cta: "Try the demo",
    contact:
      "To discuss this proposal or the underlying research, contact [contact].",
  },
} as const;
