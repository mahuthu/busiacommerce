#!/usr/bin/env node
/**
 * Seed Supabase products table from src/data/products.json
 *
 * Usage:
 *   node --env-file=.env scripts/seed_supabase.mjs
 *   # or with dotenv:
 *   node scripts/seed_supabase.mjs
 *
 * Requires:
 *   VITE_SUPABASE_URL
 *   SUPABASE_SERVICE_ROLE_KEY  (service role — never expose in the browser)
 */

import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

try {
  const dotenv = await import('dotenv');
  dotenv.config();
} catch {
  // optional — Node 20+ can use --env-file=.env
}

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, '..');

const url = process.env.VITE_SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!url || !serviceKey) {
  console.error('Missing VITE_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in environment.');
  process.exit(1);
}

const products = JSON.parse(
  readFileSync(join(root, 'src/data/products.json'), 'utf8')
);

const supabase = createClient(url, serviceKey, {
  auth: { persistSession: false, autoRefreshToken: false },
});

const rows = products.map((p) => ({
  id: Number(p.id),
  name: p.name,
  brand: p.brand || 'Generic',
  category: p.category,
  price: Number(p.price) || 0,
  old_price: p.oldPrice == null ? null : Number(p.oldPrice),
  discount: Number(p.discount) || 0,
  is_new: Boolean(p.isNew),
  image: p.image || '/images/product_display.png',
  sku: String(p.sku || p.id),
}));

const chunkSize = 100;
let upserted = 0;

for (let i = 0; i < rows.length; i += chunkSize) {
  const chunk = rows.slice(i, i + chunkSize);
  const { error } = await supabase.from('products').upsert(chunk, { onConflict: 'id' });
  if (error) {
    console.error('Seed failed on chunk starting at', i, error.message);
    process.exit(1);
  }
  upserted += chunk.length;
  console.log(`Upserted ${upserted}/${rows.length}`);
}

console.log(`Done. Seeded ${upserted} products into Supabase.`);
