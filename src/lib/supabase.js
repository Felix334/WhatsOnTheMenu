import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.SUPABASE_API_URL;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;

// Create client only if credentials are available
// This allows the build to succeed even without env vars
export const supabase = supabaseUrl && supabaseAnonKey ? createClient(supabaseUrl, supabaseAnonKey) : null;
