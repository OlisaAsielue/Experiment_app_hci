import "server-only";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { PERSIST_DATA } from "@/lib/flags";

/**
 * getSupabaseClient - THE single structural gate for persistence.
 *
 * This is not a runtime check that happens to currently evaluate false. When
 * PERSIST_DATA is false, this function returns null on its very first line,
 * BEFORE reading SUPABASE_URL/SUPABASE_SERVICE_KEY and BEFORE calling
 * createClient(). The Supabase SDK's client constructor is never invoked and no
 * network configuration is ever touched, there is no client object in existence
 * anywhere in the process for a write to reach. Every insert function in
 * writes.ts calls this and every one of them no-ops on null, so there is no
 * second code path that could construct a client independently: this is the
 * ONLY place a SupabaseClient is ever created in the whole codebase.
 *
 * `import "server-only"` makes it a build error to import this file (directly
 * or transitively) from a Client Component, on top of it already never being
 * imported from one, defense in depth against the credentials ever reaching
 * client JavaScript.
 *
 * Flipping PERSIST_DATA to "true" and setting real SUPABASE_URL /
 * SUPABASE_SERVICE_KEY is the only change needed to make this start returning
 * a working client, nothing else in the codebase changes.
 */
let cachedClient: SupabaseClient | null = null;

export function getSupabaseClient(): SupabaseClient | null {
  if (!PERSIST_DATA) return null;

  if (cachedClient) return cachedClient;

  const url = process.env.SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_KEY;
  if (!url || !serviceKey) {
    // PERSIST_DATA=true is a deliberate request to collect real data. Missing
    // credentials at that point is a misconfiguration, not a quiet no-op, fail
    // loudly rather than silently pretending to persist.
    throw new Error(
      "PERSIST_DATA is true but SUPABASE_URL / SUPABASE_SERVICE_KEY are not set.",
    );
  }

  cachedClient = createClient(url, serviceKey, {
    auth: { persistSession: false },
  });
  return cachedClient;
}
