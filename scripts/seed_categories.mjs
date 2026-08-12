import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase environment variables.');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

const PRODUCT_CATEGORIES = [
  'Refrigerators',
  'Freezers',
  'Washing Machines',
  'Televisions',
  'Cookers',
  'Microwaves & Ovens',
  'Irons',
  'Blenders & Mixers',
  'Air Conditioners',
  'Kitchen Appliances',
  'Water Dispensers',
  'Fans',
  'Juice Dispensers',
];

async function seedCategories() {
  for (const name of PRODUCT_CATEGORIES) {
    const { error } = await supabase.from('categories').insert({ name }).select('*').single();
    if (error && error.code !== '23505') { // Ignore unique constraint violations
      console.error(`Failed to add category ${name}:`, error.message);
    } else {
      console.log(`Ensured category: ${name}`);
    }
  }
  console.log('Finished seeding categories.');
}

seedCategories();
