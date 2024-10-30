import { createClient } from "@supabase/supabase-js";

const supabaseUrl = 'https://vqninneaoiavwczhjpmc.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZxbmlubmVhb2lhdndjemhqcG1jIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjkyMTE5MzgsImV4cCI6MjA0NDc4NzkzOH0.l97Yh1OC7m_nyF6HkOiWdii0cYV8-hqbZeB1DgR7CMs';
export const supabase = createClient(supabaseUrl, supabaseKey)