import { createClient } from '@supabase/supabase-js';

// ⚠️ अपनी Supabase की details yaha daaliye
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
