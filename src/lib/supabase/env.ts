const DEFAULT_SUPABASE_URL = "https://xktxcbgltqzcdrizaxbe.supabase.co";
const DEFAULT_SUPABASE_PUBLISHABLE_KEY = "sb_publishable_auG9xtCshZoBI85cgxKavg_J9ub19NT";

/**
 * These defaults are intentionally public. Supabase publishable keys are
 * designed for browser use and remain protected by Row Level Security.
 *
 * Environment variables still override the defaults when present.
 */
export function getSupabaseEnv() {
  return {
    url: process.env.NEXT_PUBLIC_SUPABASE_URL || DEFAULT_SUPABASE_URL,
    key:
      process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
      DEFAULT_SUPABASE_PUBLISHABLE_KEY,
  };
}

export function hasSupabaseEnv() {
  const { url, key } = getSupabaseEnv();
  return Boolean(url && key);
}
