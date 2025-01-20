import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://tdfqshwqqsdjsicrrajl.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRkZnFzaHdxcXNkanNpY3JyYWpsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzYxOTY2NTYsImV4cCI6MjA1MTc3MjY1Nn0.fX7p_mGT425y95CGNXEqnzTf_JUfYmOCLOMHaTTxzaE";

export const supabase = createClient<Database>(
  SUPABASE_URL, 
  SUPABASE_ANON_KEY,
  {
    auth: {
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: true
    }
  }
);