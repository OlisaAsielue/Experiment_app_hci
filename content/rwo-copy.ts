/**
 * ============================================================================
 *  RWO EXPLAINER COPY ("/" route) - single editable content file
 * ============================================================================
 * The funder-facing explainer text, kept in ONE place so the prose can be
 * edited here without touching the page component.
 *
 * SOURCE OF TRUTH: docs/Grant_Proposal_Formatted.md (the grant proposal). Every
 * figure and framing on this page is taken from that document. The earlier
 * docs/rwo-explainer-copy.md draft is fully SUPERSEDED, not extended.
 *
 * Structure (five sections + a closing CTA):
 *   1. hero      - the hook
 *   2. ask       - the amount requested and what it funds (real figures)
 *   3. tryIt     - the primary call to action, promoted high on the page
 *   4. system    - what we built AND how we measure it, merged
 *   5. problem   - shortened supporting context, not a gate before the ask
 *   6. next      - final call to action + contact
 *
 * Bracketed placeholders such as [contact] are left as visible placeholder text
 * on screen, matching the consent/PIS placeholder pattern. They are filled in
 * during the final prose pass, never guessed at here. Any figure or named person
 * not finalised in the proposal must render as a placeholder, not an invented
 * value.
 * ============================================================================
 */

export const RWO_COPY = {
  hero: {
    headline:
      "People are starting to trust AI without checking it. This project measures the moment that happens, and tests a way to stop it.",
    body: "As AI tools get faster and more fluent, the effort of checking their output starts to feel optional. The result is a quiet shift from doing the work to rubber-stamping it. We built a working tool that can detect that shift as it happens, and a design intervention that appears to slow it down.",
    cta: "Try the demo",
  },

  ask: {
    heading: "The ask",
    amount: "£1,089",
    amountCaption: "to run the study the tool was built for",
    lines: [
      "That funds recruiting 192 participants through Prolific to complete the task, split evenly between the two versions of the tool.",
      "£947 covers the participants at the London Living Wage, inclusive of Prolific's academic fee; £142 is contingency.",
      "The apparatus is live now, and you can try it on this page before any funding decision is made.",
      "The study is proposed in collaboration with Professor Duncan Brumby as the prospective collaborating Principal Investigator; this partnership has not yet been confirmed.",
    ],
  },

  tryIt: {
    heading: "Try it",
    body: "Pick a version, complete the short task, and at the end the tool shows you the behavioural signals it captured while you worked. This is the working instrument, not a mock-up of one.",
    cta: "Try the demo",
  },

  system: {
    heading: "What we built, and how we measure it",
    built: [
      "It is a working web application with two versions of the same AI research tool. One hands you a finished answer to read and accept. The other reveals its working in stages and asks you to verify each one before it continues.",
      "Both versions give the identical answer. The only thing that changes is how much the tool asks you to engage, which lets us isolate one question cleanly: does being kept in the loop change how carefully people work?",
    ],
    comparison: {
      caption: "The only difference between the two versions",
      conditionA: {
        label: "Version A",
        title: "One step",
        steps: ["You ask", "Finished answer"],
        note: "You read it and accept it.",
      },
      conditionB: {
        label: "Version B",
        title: "Verified in stages",
        steps: ["You ask", "Stage, verify", "Stage, verify", "Answer"],
        note: "You check each stage before it continues.",
      },
    },
    measureIntro:
      "While you work, the tool quietly records how you behave, not just what you conclude. Without interrupting the task, it captures signals that are hard to fake and easy to miss:",
    signals: [
      "how long you pause before accepting an answer, against how long it should take to read it",
      "how much you revise and correct your own work",
      "how varied, or how repetitive, your activity is",
      "how your cursor moves in the seconds before you commit",
    ],
    measureOutro:
      "Together these act as a proxy for whether someone is genuinely evaluating the output or simply moving through it. This is the part a funder can try rather than take on trust: at the end of the demo, we show you your own signals, a concrete picture of something that is normally invisible.",
  },

  problem: {
    heading: "Why it matters",
    paragraphs: [
      "Most AI tools are built to remove friction: fewer clicks, faster answers, a finished result in one step. That is good for speed, and it may be quietly bad for judgement. When a tool hands you a polished answer with no visible working, the easy thing is to accept it, and the habit of checking fades.",
      "People describe reaching a point where they are no longer really evaluating what the AI gives them, they are just passing it along. We call that state cognitive surrender. The full case, with the evidence behind it, is set out in the written proposal; this tool is how we propose to measure it.",
    ],
  },

  next: {
    heading: "Next step",
    cta: "Try the demo",
    contact:
      "To discuss this proposal or the underlying research, contact o.asielue@lis.ac.uk.",
  },
} as const;
