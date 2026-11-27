import { createClient } from '@supabase/supabase-js';

const url = import.meta.env.VITE_SUPABASE_URL;
const key = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabaseConfigured = Boolean(url && key && !url.includes('YOUR_PROJECT'));
export const supabase = supabaseConfigured ? createClient(url, key) : null;

// Supabase setup instructions and SQL are in SUPABASE_SETUP.md.
// Never put a service_role key in frontend code. Use only the anon/publishable key here.