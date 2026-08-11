# PRD: Cognitive Surrender Apparatus (Phase 2 Experimental Web Application)

**Source of truth:** `docs/capstone-paper.md` (Sections 4.2–4.9, Appendix A, Appendices D–F). This PRD is a re-registration of that methodology for implementation. Where this document and the paper conflict, the paper wins — flag the conflict rather than silently resolving it.

**Scope of this document:** user flows, telemetry specification, data schema, consent/debrief flow, and open questions. This document stops short of implementation code, component structure, or specific library choices beyond the stack already fixed in the paper.

**Status:** draft for review. Do not begin implementation until open questions in Section 8 are resolved or explicitly deferred.

---

## 1. Purpose and scope of the apparatus

A custom web application presenting a 15-minute academic literature synthesis task, in which a participant produces a verified summary brief with the help of a built-in AI research tool. The apparatus is the Phase 2 data-collection instrument: it manipulates Interface Agency (Condition A: Low-Agency Automation vs Condition B: High-Agency Collaborator) as the sole independent variable, while logging four continuous telemetry streams and administering two post-task instruments (Raw NASA-TLX, Critical Incident Technique).

### 1a. Deployment structure — two public routes on one deployment

- **`/demo`** — a bare entry point. A visitor chooses Condition A or Condition B and runs that condition's task directly. This is the URL the academic paper's Methods section (Section 4.3) points to as the live demo link. No academic framing on this route; it is the apparatus itself.
- **`/`** — a single-page explainer for a professional, semi-technical audience (grant/funding readers, professionals). Short, non-academic, easy-to-digest context on what the research is and why it matters, plus a clear call-to-action linking through to `/demo`. **This `/` route is the Real-World Output (RWO) deliverable.**

Both routes share the same deployment and the same underlying apparatus code. The `/` explainer copy is drafted separately (see Section 10); the participant will rewrite/refine that prose as a final step, so it should live in an easily-editable location (e.g. a single content file or clearly-marked component), not be hardcoded across many components.

### 1b. Data-persistence mode (important)

For now, the public demo runs in **not-stored mode**: telemetry is captured and computed, but nothing is durably persisted to Supabase from public visitors. This sidesteps the unresolved ethics placeholders for public-facing use.

**Hard requirement:** the full Supabase write path must still be *built*, just gated behind a single feature flag (e.g. `PERSIST_DATA` / `NEXT_PUBLIC_PERSIST_DATA`, default `false`). When real, ethically-approved collection begins later, flipping that one flag to `true` must be the *only* change required to turn on full persistence — no re-architecture, no scattered edits. Everything downstream of the flag (schema, insert calls, session records) is built and tested in a way that works the moment the flag flips.

The apparatus must support, at minimum:
- Randomised assignment to Condition A or B
- A baseline calibration phase preceding the main task
- The task itself, differentiated only by output-reveal mechanism between conditions
- Continuous background telemetry capture throughout calibration and task
- Post-task Raw NASA-TLX and CIT instruments
- Consent and debrief flows with pseudonymisation at entry
- Supabase persistence, fully built but flag-gated (off by default)

---

## 2. Tech stack (fixed, per paper and existing project decisions)

- **Frontend/framework:** Next.js (fresh project — nothing is transplanted from earlier scaffolds; build from scratch)
- **Database/backend:** Supabase, hosted in AWS `eu-west-2` (London) for UK GDPR compliance — build path now, gate behind `PERSIST_DATA` flag (Section 1b)
- **Hosting:** Vercel, Hobby tier
- **UI approach:** a neutral, generic modern-chatbot shell (centred column, output area above, input at bottom, clean neutral palette). Do **not** clone any single provider's branding (ChatGPT/Claude/Gemini/DeepSeek) — the reference is the generic *pattern*, not any one brand, to avoid both trademark oddness on the public RWO page and "why does this look exactly like ChatGPT" questions. Condition A and Condition B MUST share one identical shell; the only visible difference is the output-reveal mechanism (Section 4).
- **UI polish:** install and use the Impeccable UI skill (`npx skills add pbakaus/impeccable`) for styling quality on the shell and the `/` explainer page.
- **Client requirements (per PIS):** desktop or laptop, mouse or trackpad — no touch/mobile support required or expected

---

## 3. Participant flow (end-to-end)

This is the canonical sequence. Every stage must be logged with a timestamp and, where applicable, a duration.

1. **Landing / Prolific entry** — participant arrives via Prolific redirect link with Prolific ID in URL params.
2. **Pseudonymisation** — Prolific ID is immediately hashed/replaced with a random session code on entry; the mapping (if retained at all) is stored separately from all other data (see Section 6, Data Separation).
3. **Participant Information Sheet (PIS)** — full text per Appendix D. No data capture yet beyond page-load timestamp.
4. **Consent form** — all 8 statements from Appendix E must be individually ticked (not a single "I agree to all"); submission blocked until all 8 are checked. Consent timestamp and the fact of full consent are recorded. No partial-consent path — if a participant won't tick all 8, they exit the study (see Section 8, Q: exit/incomplete handling).
5. **Random assignment** — participant is assigned to Condition A or Condition B. Randomisation method not yet specified (Section 8).
6. **Baseline calibration** — participant reads an unrelated abstract of comparable length and Flesch-Kincaid grade level to the fixed AI output, then clicks "Continue." System logs time-to-click in ms; this establishes ms/word reading velocity for that participant (see Section 5.1, NPOIL).
7. **Main task (condition-differentiated)** — see Section 4 for the two condition specifications. Both conditions receive identical AI-generated content; only the reveal mechanism differs.
8. **Post-task: Raw NASA-TLX** — six-dimension scale per Appendix H, each on a 21-point (0–100, 5-point increment) scale with the descriptive endpoints given in Appendix H's table. Administered immediately after the synthesis task, before CIT.
9. **Post-task: Critical Incident Technique (CIT) reflection** — free-text reflection on one moment during the task that stood out (antecedent, incident, outcome structure per Flanagan 1954). Note: per Section 4.7, only participants in the top/bottom quartiles by NPOIL and by Interaction Entropy Rate are the intended analytic sample for CIT coding — but per the PIS, **every** participant completes the CIT reflection at collection time; quartile selection happens later, at analysis time, not as a gate during the session. The apparatus should collect CIT from all participants and not attempt to determine quartile membership live.
10. **Debrief** — full text per Appendix F, including full disclosure of the pre-generated/staged-output deception. Must include a clear path for the participant to request data deletion after this point (quoting their Prolific ID, within the 4-week deletion window per PIS).
11. **Completion / Prolific redirect** — participant is returned to Prolific to confirm completion and trigger payment.

---

## 4. Condition specifications

Both conditions share: identical AI-generated content (a single synthesis output generated once in advance, used across all sessions — never generated live per-participant, per the fixed-stimulus/single-generation architecture in Section 4.3), identical input modality, identical button layout and visual structure. The only manipulated variable is how the output is revealed and what action the participant must take to see it.

### Condition A — Low-Agency Automation
- Participant submits one command.
- A hidden processing sequence plays (simulating live generation — this is the deception disclosed at debrief).
- Full output is displayed at once, in a read-only text container.
- Participant action: read, then submit/proceed.

### Condition B — High-Agency Collaborator
- Same output is revealed across five sequential stages:
  1. Source extraction
  2. Thematic clustering
  3. Cross-source comparison
  4. Synthesis drafting
  5. Final verification
- At each stage boundary, participant must click "Verify & Proceed" before the next stage is shown.
- "Verify & Proceed" clicks are mandatory actions and must be excluded from the non-mandatory action counts used in Input and Editing Volatility (Section 5.2) and from Cursor Trajectory Tortuosity sampling (Section 5.4).

A cognitive walkthrough of both conditions is planned during piloting to confirm measured differences reflect interface agency rather than incidental usability differences — this is a pre-launch QA step, not an apparatus feature, but the apparatus should be built in a way that supports this walkthrough (i.e., both conditions should be independently runnable/inspectable without full session state).

---

## 5. Telemetry specification

Four streams, logged continuously from the start of baseline calibration through final submission. All four are described in the paper as proxying Norman's Gulf of Execution or Gulf of Evaluation — **the gulf assignment is an interpretive/analytic detail and does not affect what needs to be built**; the apparatus needs to capture the four metrics correctly regardless of which gulf each is later assigned to in the write-up. Do not hardcode gulf labels into telemetry event names or schema.

### 5.1 Normalised Post-Output Inactivity Latency (NPOIL)

**Purpose:** proxy for evaluative processing effort after output appears, normalised against the participant's own reading speed.

**Calculation, in three steps:**
1. **Baseline reading velocity** (from calibration phase): `velocity_ms_per_word = calibration_time_ms / calibration_word_count`
2. **Expected reading time for actual output:** `expected_reading_time_ms = velocity_ms_per_word * output_word_count`
3. **NPOIL:** `NPOIL = actual_pause_ms - expected_reading_time_ms`

Where `actual_pause_ms` is the interval between output becoming visible (Condition A: full output appears; Condition B: final/fifth stage appears) and the participant's next submit/proceed action.

- Positive NPOIL → paused longer than reading speed predicts (more evaluative processing).
- Negative NPOIL → moved on faster than expected (theorised as low evaluative effort, not absence of hesitation — treat as an equally valid, meaningful signal, not a data-quality issue).

**Build requirement:** the calibration abstract and the fixed AI output must be readability-matched (e.g., comparable Flesch-Kincaid grade level) — this is a content decision (Section 8), but the apparatus must expose/store word counts for both so this calculation is always computable per participant.

### 5.2 Input and Editing Volatility

**Purpose:** proxy for Gulf of Execution difficulty/engagement.

**Definition:** count of non-mandatory corrective actions (backspace, delete, retype) within the participant's response field. Excludes all mandatory clicks (submit, "Verify & Proceed").

**Build requirement:** every keystroke event in the response field needs classification as "corrective" (backspace/delete/retype) vs "additive" (new character entry) at minimum; only corrective actions count toward volatility. Mandatory-click exclusion must be enforced at the event-capture level, not filtered post-hoc, to avoid ambiguity in the raw log.

### 5.3 Interaction Entropy Rate

**Purpose:** proxy for variety/predictability of behaviour across four mutually exclusive interaction states.

**States (Appendix A.1), with precedence order Modifying → Confirming → Hovering → Idle (higher precedence wins when trigger conditions overlap):**

| State | Trigger |
|---|---|
| Idle | No mouse movement, click, or keystroke for a continuous period exceeding 2000ms |
| Hovering | Cursor within bounds of the AI output container, no click/keystroke |
| Modifying | Active keystroke input (entry, deletion, selection) in the response field |
| Confirming | Cursor within bounds of, or click registered on, a submission or "Verify & Proceed" control |

**Build requirement:** state must be evaluated on every animation frame (not on a coarser polling interval) and logged as a state-transition sequence per participant, from which the analysis pipeline (not necessarily the apparatus itself — see Section 8) constructs a 4×4 first-order transition probability matrix and computes the Shannon entropy of each row, weighted by the empirically estimated stationary distribution (proportion of total task time in each state). Formulae are in Appendix A.2; the apparatus's job is to produce a clean, correctly-precedenced state sequence with timestamps — the entropy calculation itself can live in an analysis script rather than in the live application, but the state log must contain everything needed to reproduce it (Section 8 flags this as an architecture decision).

### 5.4 Cursor Trajectory Tortuosity

**Purpose:** proxy for unresolved uncertainty at the moment of commitment.

**Definition:** deviation of cursor path from a straight line, measured in the three seconds immediately preceding final submission, sampled at 60Hz, excluding cursor movement associated with "Verify & Proceed" clicks.

**Build requirement:** cursor position must be captured at 60Hz (or the closest reliably achievable rate in-browser — flag if 60Hz isn't consistently achievable, see Section 8) for at least the final 3-second window before submission. A rolling buffer approach (always retaining the last ~3–4 seconds of cursor positions, discarding older data) is more efficient than logging the full session's cursor trace at 60Hz if full-session cursor data isn't otherwise needed — confirm this is acceptable (Section 8).

### Telemetry — cross-cutting build requirements
- All four streams must be timestamped against a single session clock so cross-metric analysis (e.g., "what was Entropy doing during the high-NPOIL window") is possible.
- No telemetry may be paused or dropped when a participant is mid-task; any client-side buffering/retry logic for network interruption should not lose data silently.
- Telemetry capture starts at baseline calibration (not just the main task), since NPOIL depends on calibration data.

---

## 6. Data model and Supabase schema (draft)

This is a starting schema, not final DDL — table/column names are suggestions, not fixed. Flag anything here that conflicts with existing Supabase conventions already in use.

### Data separation principle (per Section 4.8 of the paper — non-negotiable)
Three separate stores, not joined by a shared key accessible outside the research team's own linkage table:
1. **Consent & payment records** (Prolific ID, consent timestamp, completion status)
2. **Pseudonymised research data** (telemetry, questionnaire, CIT — keyed only by session code, never by Prolific ID directly)
3. **Session code ↔ Prolific ID mapping**, if retained at all for deletion-request purposes, stored separately from both of the above, access-restricted.

No cookies, IP addresses, or other identifying data are collected, per the PIS commitment — enforce this at the infrastructure level (e.g., disable IP logging in Vercel/Supabase where possible, or ensure it's never persisted to the research dataset).

### Draft tables

**`sessions`**
- `session_code` (PK, pseudonymised, generated at entry)
- `condition` (enum: A / B)
- `created_at`
- `completed_at` (nullable)
- `status` (enum: consented / in_calibration / in_task / post_task / debriefed / completed / withdrawn)

**`consent_records`** *(separate store — see above)*
- `prolific_id`
- `session_code` (FK, only linkage point, access-restricted)
- `consent_statements_agreed` (all 8 booleans, or a single "all agreed" boolean if partial consent isn't supported — see Section 8)
- `consent_timestamp`

**`calibration_events`**
- `session_code` (FK)
- `abstract_word_count`
- `time_to_continue_ms`
- `reading_velocity_ms_per_word` (computed)

**`task_events`**
- `session_code` (FK)
- `output_word_count`
- `output_visible_at` (timestamp)
- `submitted_at` (timestamp)
- `npoil_ms` (computed)
- Condition B only: per-stage timestamps for the 5 stages (source extraction / thematic clustering / cross-source comparison / synthesis drafting / final verification) and their "Verify & Proceed" click timestamps

**`interaction_state_log`**
- `session_code` (FK)
- `state` (enum: Idle / Hovering / Modifying / Confirming)
- `entered_at`
- `exited_at` (or duration_ms)

**`editing_events`**
- `session_code` (FK)
- `event_type` (enum: corrective / additive / mandatory_click)
- `timestamp`

**`cursor_samples`**
- `session_code` (FK)
- `x`, `y`
- `timestamp`
- (Only required to cover the pre-submission window per metric definition — full-session storage is an open question, Section 8)

**`nasa_tlx_responses`**
- `session_code` (FK)
- `mental_demand`, `physical_demand`, `temporal_demand`, `performance`, `effort`, `frustration` (each 0–100, 5-point increments)

**`cit_responses`**
- `session_code` (FK)
- `antecedent_text`, `incident_text`, `outcome_text` (or a single free-text field if the apparatus doesn't enforce the three-part structure — Section 8)

**`deletion_requests`**
- `prolific_id`
- `requested_at`
- `fulfilled_at` (nullable)

---

## 7. Consent and debrief content

Full text for the PIS, Consent Form, and Debrief is already finalised in Appendices D, E, and F of the paper. The apparatus should treat this text as content to be inserted, not re-derived or paraphrased. Placeholders in the paper's appendix text — `[STUDY TITLE]`, `[RESEARCHER NAME]`, `[RESEARCHER EMAIL]`, `[SUPERVISOR NAME]`, `[SUPERVISOR EMAIL]`, `[ETHICS REFERENCE NUMBER]`, `[ETHICS COMMITTEE / REVIEW BOARD NAME]`, `[ETHICS CONTACT / DEPARTMENT OFFICE]`, `[ETHICS CONTACT EMAIL]` — are still unresolved in the paper itself (deliberately left as placeholders per current drafting status) and must be filled with real values before the apparatus can go live, since these appear in participant-facing content, not just the academic document. This is a hard blocker for a live/public demo, separate from the paper's own placeholder decision.

Consent form: all 8 statements from Appendix E render as individually tickable checkboxes; the submit action for the consent step is disabled until all 8 are checked.

---

## 8. Resolved decisions

**Scope change (supersedes earlier draft of this section):** the mini apparatus test with 2–3 people is cancelled. Not enough time before submission; the absence of this test is already disclosed and mitigated as a limitation in the paper. This changes the build's purpose: the apparatus now needs to **exist and demonstrably work** (for the paper's live demo link, and as "early working prototype" evidence in the RWO), not survive a real pilot with real participants. Most items below were only genuinely open questions under pilot conditions — resolving them now with that in mind so the build can proceed without further decisions blocking it.

1. **Randomisation method** — simple 50/50 random assignment (e.g. `Math.random() < 0.5`). No need for block or stratified randomisation; that only matters at real recruitment scale (N=128/192), which isn't happening in this build phase.
2. **Entropy calculation location** — **log only, calculate offline.** The apparatus logs a clean, correctly-precedenced state-transition sequence with timestamps. The Shannon entropy/transition-matrix calculation runs in an offline Python script (reuse the existing entropy-mathematics sanity-check scripts). Keeps the live app simpler.
3. **Cursor sampling scope** — **rolling buffer**, last ~3–4 seconds only, not full-session logging. Full-session cursor capture at 60Hz is unnecessary cost for a demonstration build.
4. **60Hz achievability** — **best-effort via `requestAnimationFrame`**, not a guaranteed fixed rate. Document this as an approximate, hardware-dependent sampling rate in any write-up that references it. Fine for demonstration purposes; would need revisiting for real data collection.
5. **Partial consent handling** — a simple decline/exit screen: thank the participant, state they cannot proceed without full consent, collect nothing. No data persisted for declined sessions.
6. **CIT structure** — single free-text box, with the antecedent/incident/outcome structure given as placeholder/guidance text inside the field rather than three enforced separate fields.
7. **Calibration abstract and AI output content** — use **generated placeholder content** (a real-looking academic abstract for calibration, a plausible fixed AI-generated synthesis output, and representative source material for the task). Clearly mark it as placeholder in the code/content file so the participant can swap in final content later. No rigorous Flesch-Kincaid matching needed for the demo, but keep calibration abstract and AI output roughly comparable in length.
8. **Prolific integration specifics** — **stub only**: simulate a Prolific ID arriving as a URL param and a redirect at completion. No real Prolific API integration.
9. **Live demo hosting and URL** — deploy `/demo` to Vercel as soon as a minimal A/B flow renders, before all telemetry is wired. This URL fills the paper's `[LIVE DEMO URL]` placeholder (Section 4.3).
10. **Data persistence for public demo** — **not-stored mode**, per Section 1b. Telemetry computed but not persisted for public visitors; full write path built and gated behind the `PERSIST_DATA` flag so it is one switch away from live.
11. **End-of-demo telemetry reveal** — **yes, show it.** After completing `/demo`, present the visitor a simple "here's what we captured" summary of their own telemetry (e.g. their NPOIL, entropy rate, volatility count, a small cursor-path sketch). The real study would not do this, so it must be clearly a demo-only feature and must not appear in / affect any (flag-gated) persisted data. This is a strong RWO asset: it makes the invisible measurement legible to a non-technical funder.
12. **Ethics/consent placeholders** — public demo shows a visible "Demonstration only — not a live study" banner on the consent/PIS screens. Combined with not-stored mode (item 10), no real ethics reference numbers are needed for the demo to be safe to expose publicly.

---

## 9. RWO explainer page (`/` route) — content and structure

The `/` route is the RWO deliverable, aimed at a professional, semi-technical audience (grant/funding readers, industry professionals), not academics. Register: plain, confident, concrete. Avoid heavy theory and citations; translate the research into why-it-matters terms. The participant will rewrite this prose as a final step, so keep all copy in one easily-editable content file or a single clearly-marked component.

Draft copy is provided separately (see `rwo-explainer-copy.md` in the repo). Page structure:

1. **Hero** — one-line statement of the problem (people are starting to accept AI output without really checking it) and a one-line statement of what this project does about it. Primary call-to-action button: "Try the demo" → `/demo`.
2. **The problem, briefly** — 2–3 short paragraphs, non-academic, on cognitive surrender as a real workplace risk (not "here is a construct"; rather "here is a thing that happens to people using AI at work").
3. **What we built** — a short plain-language description of the apparatus: two versions of an AI tool, one that hands you a finished answer, one that makes you check each step, and the fact that we measure the difference in how people behave.
4. **How we measure it** — the legible version of the telemetry: hesitation, editing, movement patterns. This is where the end-of-demo "here's what we captured" reveal is previewed, so a reader understands the demo will show them something concrete.
5. **What the funding enables** — the ask, in plain terms: running the full study (the proposed N=192 experiment), with the apparatus already built and working as proof of feasibility. Positions the named academic as proposed collaborating PI (conditional language only).
6. **Call-to-action (repeat)** — "Try the demo" → `/demo`, plus a contact/next-step line.

Keep it a single scrollable page. The demo reveal and the "apparatus already exists" angle are the two strongest assets — the whole point is that a funder can *try the working thing*, which most proposals can't offer.

## 10. Build order (optimised for the deadline)

Deploy continuously. Never sit on undeployed work. Suggested sequence:

1. Fresh Next.js project, git init, baseline commit (paper + PRD already in repo). Install Impeccable UI skill.
2. Shared chatbot shell + `/demo` entry with Condition A/B selection. **Deploy to Vercel now** — this URL fills the paper's `[LIVE DEMO URL]`.
3. Condition A flow (submit -> staged processing -> full output -> proceed).
4. Condition B flow (five-stage reveal with Verify & Proceed gates).
5. Baseline calibration phase (needed for NPOIL).
6. Telemetry capture: state logging (entropy), editing events (volatility), cursor buffer (tortuosity), NPOIL timing. Log-only; entropy/analysis math can be offline.
7. End-of-demo "here's what we captured" reveal (demo-only).
8. Consent / PIS / debrief screens (text from paper appendices) + "Demonstration only" banner.
9. Raw NASA-TLX + CIT screens.
10. Supabase write path, gated behind `PERSIST_DATA` flag (default off). Build and test the flag, ship with it off.
11. `/` RWO explainer page (copy from `rwo-explainer-copy.md`), CTA -> `/demo`. Deploy.

Steps 2 and 11 are the two that must ship. Everything between is graceful-degradation territory if time runs out.

## 11. Explicit non-goals for this build phase

- Full N=128 or N=192 Prolific recruitment and data collection — the paper proposes this, it does not execute it.
- **The mini apparatus test with 2-3 pilot participants — cancelled.** Disclosed as a limitation in the paper.
- Real Prolific API integration — a stub is sufficient.
- Real data persistence for public visitors — built but flag-gated off.
- Cloning any single AI provider's exact branding.
- Production-grade auth/accounts — participants are anonymous/session-based.
- Analysis/statistics pipeline (t-tests, Levene's, Bonferroni) — consumes the apparatus's output later; not part of the apparatus.
- Resolving ethics reference numbers — demo ships with a "demonstration only" banner + not-stored mode instead.
- Final RWO prose — placeholder draft provided; participant rewrites as the last step.
