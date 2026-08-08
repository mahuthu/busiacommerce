import { supabase } from './supabase';
import localProducts from '../data/products.json';

const BUCKET = 'product-images';

const mapRow = (row) => ({
  id: Number(row.id),
  name: row.name,
  brand: row.brand || 'Generic',
  category: row.category,
  price: Number(row.price) || 0,
  oldPrice: row.old_price == null ? null : Number(row.old_price),
  discount: Number(row.discount) || 0,
  isNew: Boolean(row.is_new),
  image: row.image || '/images/product_display.png',
  sku: row.sku || String(row.id),
});

const toRow = (product) => ({
  id: product.id,
  name: product.name.trim(),
  brand: (product.brand || 'Generic').trim(),
  category: product.category.trim(),
  price: Number(product.price) || 0,
  old_price: product.oldPrice == null || product.oldPrice === ''
    ? null
    : Number(product.oldPrice),
  discount: Number(product.discount) || 0,
  is_new: Boolean(product.isNew),
  image: product.image || '/images/product_display.png',
  sku: String(product.sku || product.id),
});

const ensureClient = () => {
  if (!supabase) {
    throw new Error('Supabase is not configured. Add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.');
  }
  return supabase;
};

export async function listProducts() {
  if (!supabase) {
    return localProducts;
  }

  const { data, error } = await supabase
    .from('products')
    .select('*')
    .order('category', { ascending: true })
    .order('brand', { ascending: true })
    .order('price', { ascending: true });

  if (error) {
    console.error('Failed to load products from Supabase, using local fallback:', error.message);
    return localProducts;
  }

  if (!data?.length) {
    return localProducts;
  }

  return data.map(mapRow);
}

export async function createProduct(product) {
  const client = ensureClient();
  const row = toRow(product);
  const { data, error } = await client
    .from('products')
    .insert(row)
    .select('*')
    .single();

  if (error) throw error;
  return mapRow(data);
}

export async function updateProduct(id, product) {
  const client = ensureClient();
  const row = toRow({ ...product, id });
  delete row.id;

  const { data, error } = await client
    .from('products')
    .update(row)
    .eq('id', id)
    .select('*')
    .single();

  if (error) throw error;
  return mapRow(data);
}

export async function deleteProduct(id) {
  const client = ensureClient();
  const { error } = await client.from('products').delete().eq('id', id);
  if (error) throw error;
}

export async function uploadProductImage(file, productId) {
  const client = ensureClient();
  const ext = file.name.split('.').pop()?.toLowerCase() || 'jpg';
  const path = `${productId || 'new'}-${Date.now()}.${ext}`;

  const { error } = await client.storage.from(BUCKET).upload(path, file, {
    cacheControl: '3600',
    upsert: true,
    contentType: file.type || undefined,
  });

  if (error) throw error;

  const { data } = client.storage.from(BUCKET).getPublicUrl(path);
  return data.publicUrl;
}

export async function deleteProductImage(imageUrl) {
  if (!supabase || !imageUrl) return;

  try {
    const marker = `/storage/v1/object/public/${BUCKET}/`;
    const idx = imageUrl.indexOf(marker);
    if (idx === -1) return;

    const path = decodeURIComponent(imageUrl.slice(idx + marker.length));
    await supabase.storage.from(BUCKET).remove([path]);
  } catch (err) {
    console.warn('Could not delete storage image:', err);
  }
}

export async function getNextProductId() {
  const client = ensureClient();
  const { data, error } = await client
    .from('products')
    .select('id')
    .order('id', { ascending: false })
    .limit(1);

  if (error) throw error;
  const maxId = data?.[0]?.id ? Number(data[0].id) : 0;
  return maxId + 1;
}

export const PRODUCT_CATEGORIES = [
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
