/**
 * PERSIST_DATA - the single switch for real data persistence (PRD section 1b).
 *
 * A plain SERVER-SIDE environment variable, deliberately NOT prefixed
 * NEXT_PUBLIC_, so it is never bundled into client JavaScript and never
 * readable from the browser. Only server code (route handlers, the Supabase
 * client factory) ever evaluates it.
 *
 * Default false. Flipping this to "true" (plus setting real SUPABASE_URL /
 * SUPABASE_SERVICE_KEY) is the ONLY change required to turn on collection, per
 * the hard requirement in decisions.md Decision 8. See lib/supabase/client.ts
 * for how this is enforced structurally, not just as a runtime check.
 */
export const PERSIST_DATA = process.env.PERSIST_DATA === "true";
