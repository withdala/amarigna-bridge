import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://feiqhafafyfdjvajhczf.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZlaXFoYWZhZnlmZGp2YWpoY3pmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzI0MDA3NjIsImV4cCI6MjA4Nzk3Njc2Mn0.O20nrXruR1CcdtMRgl6cixpdVleqdBCfgPv1b-XOJ7A';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);