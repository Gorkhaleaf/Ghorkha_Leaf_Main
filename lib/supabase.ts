import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_KEY =
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || null;

if (!SUPABASE_URL || !SUPABASE_KEY) {
  console.warn(
    "Missing Supabase env vars. Falling back to client with available env. Set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY (server) for full functionality."
  );
}

const supabase = createClient(SUPABASE_URL || "", SUPABASE_KEY || "", {
  auth: { persistSession: false },
});

export default supabase;