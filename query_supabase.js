import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.log('No Supabase credentials');
  process.exit(0);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);
supabase.from('categories').select('*').limit(1).then(({ data, error }) => {
  if (error) console.log('Error querying categories:', error.message);
  else console.log('Categories table exists:', data);
});
