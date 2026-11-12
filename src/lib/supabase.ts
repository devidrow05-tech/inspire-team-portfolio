import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabasePublishableKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;

if (!supabaseUrl || !supabasePublishableKey) {
  throw new Error(
    'Supabase configuration is missing. Set VITE_SUPABASE_URL and VITE_SUPABASE_PUBLISHABLE_KEY in your environment.',
  );
}

// This is a browser-safe client. Authorization must be enforced with RLS policies.
// Never use a Supabase secret/service-role key in this module.
export const supabase = createClient(supabaseUrl, supabasePublishableKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
});
