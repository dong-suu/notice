// This file is automatically generated. Do not edit it directly.
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://dxomjjmeqelcnhkdurab.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImR4b21qam1lcWVsY25oa2R1cmFiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDE1MTU3NzcsImV4cCI6MjA1NzA5MTc3N30.kPAAduygig5wDiY7trfMgp5Q-nisvqsQuXpoqVwYzU0";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);