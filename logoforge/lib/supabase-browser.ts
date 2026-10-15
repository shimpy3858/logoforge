import { SupabaseClient, createClient } from "@supabase/supabase-js";

let client: SupabaseClient | null | undefined;
/** Returns null when Supabase is not configured (AI tab then stays off). */
export function getBrowserClient(): SupabaseClient | null {
  if (client !== undefined) return client;
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL, key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  client = url && key ? createClient(url, key) : null;
  return client;
}
