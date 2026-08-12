# Cognitive Surrender Apparatus

This repository is the Phase 2 data-collection apparatus for a capstone study on
**cognitive surrender in AI-assisted work** — the point at which a person stops
critically evaluating an AI's output and simply accepts it. The study asks whether
reducing a person's control over an AI's process produces that state, and whether it
can be detected from how they behave rather than from what they report.

The application is a single Next.js project that serves two things:

- **`/demo`** — the apparatus itself: the interactive task a study participant works
  through, instrumented to capture behavioural telemetry while they do it.
- **`/`** — a funder-facing explainer that describes the research in plain language
  and links into the demo.

It is a working instrument and demonstration, not a live study running with real
participants. See [Scope and status](#scope-and-status) for what is and isn't
implemented in this build.

## The study, briefly

Participants do a short AI-assisted literature-synthesis task under one of two
interface conditions that show the *same* AI output in different ways:

- **Condition A — low agency.** The assistant works out of sight and hands back a
  finished, read-only answer. The person is a passive evaluator.
- **Condition B — high agency.** The assistant reveals its work in stages and pauses
  at each one, asking the person to check it before continuing. The person is an
  active validator.

The content both conditions receive is identical; only the interface differs. The
research question is whether the low-agency interface produces measurably more
disengaged behaviour, and the four telemetry streams below are how that behaviour is
measured. Full background is in [`docs/`](#study-documentation).

## The two routes

### `/demo` — the apparatus

A visitor is taken through the same sequence a real participant would experience:

1. Participant information sheet
2. Consent (declining is a real exit, not a dead end)
3. Choosing a condition (Version A or Version B)
4. A baseline reading-speed calibration
5. The AI-assisted task itself
6. The Raw NASA-TLX workload questionnaire
7. A short written (Critical Incident Technique) reflection
8. A debrief explaining the real purpose of the study
9. A telemetry reveal that shows the visitor their own captured signals

A "Demonstration only — not a live study" banner is shown on every step. In this
build the visitor picks their own condition so they can try both; the real study
would assign conditions randomly, and the demo says so on screen rather than hiding
the difference.

### `/` — the explainer

A single scrollable page written for a non-technical funding or grant reader: what
the problem is, what has been built, how it is measured, and a link into the demo.
Some details (principal investigator name, contact address) appear as clearly-marked
bracketed placeholders to be filled before the page is shared.

## Telemetry streams

Four behavioural signals are captured while a participant works. Each is defined
precisely in code (`lib/telemetry/`) and cross-referenced to the study paper; the
one-line summaries here omit the formulas.

- **NPOIL (Normalised Post-Output Inactivity Latency)** — how long the participant
  pauses after the AI's answer appears, measured against how long their own baseline
  reading speed predicts it should take them to read it.
- **Interaction entropy** — how varied versus repetitive the participant's sequence of
  interaction states (idle, hovering, editing, confirming) is. The app records the
  raw state-transition sequence; the entropy value itself is computed offline from
  that log.
- **Editing volatility** — how much the participant revises their own text, counting
  corrective edits (deletions and re-typing over what was deleted) and excluding the
  interface's own mandatory clicks.
- **Cursor tortuosity** — how indirect the mouse path is (path travelled versus
  straight-line distance) in the three seconds immediately before final submission.

The pure functions behind these four streams are unit-tested; see [Tests](#tests).

## Data persistence and the `PERSIST_DATA` flag

By default **nothing is stored**. The public demo runs in not-stored mode, so it can
be handed to a reviewer or funder without collecting anyone's data.

Persistence is controlled by a single server-side environment variable,
`PERSIST_DATA`, which defaults to `false`:

- The browser never holds database credentials and never talks to the database
  directly. It only ever POSTs to one server route, `/api/persist`.
- When `PERSIST_DATA` is `false`, that route accepts the request and does nothing.
  The one function that could construct a database client returns `null` before it
  reads any credential, so there is no write path to reach — the flag is enforced by
  the structure of the code, not just a runtime check.

To enable real, ethically-approved collection, three things are required and nothing
else in the code changes:

1. Set `PERSIST_DATA=true`.
2. Provide `SUPABASE_URL` and `SUPABASE_SERVICE_KEY` for a Supabase project. For this
   study the project must be hosted in the London region (`eu-west-2`) for UK data-
   residency compliance.
3. Run `lib/supabase/schema.sql` against that project to create the tables.

The schema keeps research data, consent/payment records, and erasure requests in
separate tables and stores no IP addresses or cookies.

## Tech stack

- **Next.js 16** (App Router) with **React 19** and **TypeScript** — one deployment
  serves both public routes and the server-side persistence endpoint.
- **Tailwind CSS v4** for styling.
- **Supabase** (PostgreSQL) for persistence, reached only from the server and only
  when `PERSIST_DATA` is enabled.
- **Vercel** as the deployment target — a single app hosting both routes.

Telemetry is captured with built-in browser APIs only (`requestAnimationFrame`,
pointer and keyboard events, `performance.now()`); there are no charting or analytics
dependencies.

## Running it locally

Prerequisites: a recent Node.js (v20 or newer) and npm.

```bash
npm install
npm run dev
```

Then open http://localhost:3000 (the explainer) or http://localhost:3000/demo (the
apparatus).

Environment variables are optional for local use. To mirror the intended setup, copy
the template:

```bash
cp .env.example .env.local
```

The defaults (`PERSIST_DATA=false`, no Supabase credentials) are all the demo needs —
it runs fully without a database.

Production build:

```bash
npm run build
npm start
```

## Tests

The four telemetry classifiers are pure functions with standing unit tests, run with
Node's built-in test runner (no test framework dependency):

```bash
npm test
```

This runs the suites in `lib/telemetry/__tests__/` covering NPOIL, the interaction-
state classifier, editing volatility, and cursor tortuosity, including their
edge cases.

## Project layout

```
app/            Routes: / (explainer), /demo (apparatus), api/persist (server endpoint)
components/     UI for each step of the demo flow
content/        Task text, questionnaire copy, and the explainer's prose
lib/telemetry/  The four telemetry streams and their tests
lib/supabase/   Server-side persistence: client, writes, and schema.sql
lib/flags.ts    The PERSIST_DATA flag
docs/           Study documentation (see below)
```

## Study documentation

Longer-form background lives in [`docs/`](docs/):

- `docs/PRD.md` — product requirements for the apparatus.
- `docs/capstone-paper.md` — the study write-up.
- `docs/rwo-explainer-copy.md` — source copy for the `/` explainer.

The project's decision-by-decision and session history is kept as a separate internal
research log outside this repository and is intentionally not reproduced here.

## Scope and status

To be accurate about what this build is:

- **Condition assignment is a manual choice, not randomisation.** The demo lets the
  visitor pick a condition on purpose; the real study's server-side random assignment
  is out of scope for this build and is surfaced to the visitor rather than hidden.
- **Prolific integration is stubbed.** The participant-recruitment platform hooks are
  not wired up in this build.
- **The explainer contains placeholder fields** (PI name, contact) marked visibly on
  the page, to be filled before it is shared externally.
- **No data is collected by default.** Real collection requires the deliberate,
  three-step opt-in described above.
</content>
</invoke>
