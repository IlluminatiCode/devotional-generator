import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://wfgcngqizkdbnpwutwvb.supabase.co';
const supabaseKey = process.env.SUPABASE_SERVICE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

if (!supabaseKey) {
  throw new Error('Missing Supabase credentials');
}

export const supabase = createClient(supabaseUrl, supabaseKey);

// Database types
export interface Devotional {
  id: string;
  title: string;
  intro: string;
  scripture: string;
  reflection: string;
  prayer: string;
  challenge: string;
  theme: string;
  audience: string | null;
  mood: string | null;
  created_at: string;
}
