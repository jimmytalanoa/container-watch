import { createClient } from "@supabase/supabase-js";

export const supabaseUrl = "https://eultqxdppgedqaezuhys.supabase.co";
const supabaseKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV1bHRxeGRwcGdlZHFhZXp1aHlzIiwicm9sZSI6ImFub24iLCJpYXQiOjE2OTUwODY1MzYsImV4cCI6MjAxMDY2MjUzNn0.Gh6KCc_sQvixAk2T7lZGRTTtu6XrBtFqGMJjzTjGdfs";
const supabase = createClient(supabaseUrl, supabaseKey);

export default supabase;
