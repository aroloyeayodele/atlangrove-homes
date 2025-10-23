
import { createClient } from '@supabase/supabase-js';

// Replace these with your Supabase URL and anon key
// Using empty string fallbacks to prevent URL construction errors
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'placeholder-key';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
