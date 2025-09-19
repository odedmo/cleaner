import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error("Missing Supabase environment variables");
}

export const supabase = createClient(supabaseUrl, supabaseKey);

export type DbHistoryRecord = {
  id: string;
  year: number;
  month: number;
  visits: number;
  employer_contribution: number;
  employee_contribution: number;
  date_added: string;
  user_id?: string;
};
