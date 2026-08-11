-- Cognitive Surrender Apparatus - Supabase schema (PRD section 6 draft)
-- Not final DDL; table/column names are suggestions per the PRD, adjust to match
-- existing Supabase conventions if any conflict. Run this against a Supabase
-- project hosted in AWS eu-west-2 (London), per decisions.md Decision 5.
--
-- THREE SEPARATED STORES (paper section 4.8, non-negotiable):
--   1. sessions + calibration_events + task_events + interaction_state_log +
--      editing_events + cursor_samples + nasa_tlx_responses + cit_responses
--      - pseudonymised research data, keyed ONLY by session_code
--   2. consent_records - consent & payment records, the only place prolific_id
--      appears alongside session_code
--   3. deletion_requests - keyed by prolific_id only, no session_code join
-- No table here stores IP addresses or cookies, per the PIS commitment.

create table if not exists sessions (
  session_code text primary key,
  condition text not null check (condition in ('A', 'B')),
  created_at timestamptz not null default now(),
  completed_at timestamptz,
  status text not null check (
    status in (
      'consented', 'in_calibration', 'in_task', 'post_task',
      'debriefed', 'completed', 'withdrawn'
    )
  )
);

-- Separate store: the only table where prolific_id appears.
create table if not exists consent_records (
  id uuid primary key default gen_random_uuid(),
  prolific_id text,
  session_code text not null references sessions (session_code),
  all_statements_agreed boolean not null,
  consent_timestamp timestamptz not null default now()
);

create table if not exists calibration_events (
  id uuid primary key default gen_random_uuid(),
  session_code text not null references sessions (session_code),
  abstract_word_count integer not null,
  time_to_continue_ms double precision not null,
  reading_velocity_ms_per_word double precision not null
);

create table if not exists task_events (
  id uuid primary key default gen_random_uuid(),
  session_code text not null references sessions (session_code),
  output_word_count integer not null,
  output_visible_at_ms double precision not null,
  submitted_at_ms double precision not null,
  npoil_ms double precision,
  -- The participant's own written summary brief, retained as their primary work
  -- product (not itself a dependent variable, but useful for task-compliance and
  -- any later qualitative analysis).
  response_text text
);

create table if not exists interaction_state_log (
  id uuid primary key default gen_random_uuid(),
  session_code text not null references sessions (session_code),
  state text not null check (state in ('Idle', 'Hovering', 'Modifying', 'Confirming')),
  entered_at_ms double precision not null,
  exited_at_ms double precision
);

create table if not exists editing_events (
  id uuid primary key default gen_random_uuid(),
  session_code text not null references sessions (session_code),
  event_type text not null check (
    event_type in ('corrective', 'additive', 'mandatory_click')
  ),
  at_ms double precision not null
);

-- Only the pre-submission tortuosity window is written, not the full session.
create table if not exists cursor_samples (
  id uuid primary key default gen_random_uuid(),
  session_code text not null references sessions (session_code),
  x double precision not null,
  y double precision not null,
  at_ms double precision not null
);

create table if not exists nasa_tlx_responses (
  id uuid primary key default gen_random_uuid(),
  session_code text not null references sessions (session_code),
  mental_demand integer not null check (mental_demand between 0 and 100),
  physical_demand integer not null check (physical_demand between 0 and 100),
  temporal_demand integer not null check (temporal_demand between 0 and 100),
  performance integer not null check (performance between 0 and 100),
  effort integer not null check (effort between 0 and 100),
  frustration integer not null check (frustration between 0 and 100)
);

-- Single free-text field, per PRD section 8 resolved decision 6.
create table if not exists cit_responses (
  id uuid primary key default gen_random_uuid(),
  session_code text not null references sessions (session_code),
  reflection_text text not null
);

-- Separate store: keyed by prolific_id only, no session_code join.
create table if not exists deletion_requests (
  id uuid primary key default gen_random_uuid(),
  prolific_id text not null,
  requested_at timestamptz not null default now(),
  fulfilled_at timestamptz
);
