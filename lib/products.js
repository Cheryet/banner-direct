import { createClient } from '@/lib/supabase/server';

/**
 * Fetch all active products from the database
 */
export async function getProducts({
  category = null,
  featured = false,
  limit = null,
  search = null,
  sortBy = 'created_at',
  sortOrder = 'desc',
} = {}) {
  const supabase = await createClient();

  let query = supabase.from('products').select('*').eq('is_active', true);

  if (category) {
    query = query.eq('category', category);
  }

  if (featured) {
    query = query.eq('is_featured', true);
  }

  if (search) {
    query = query.or(
      `name.ilike.%${search}%,title.ilike.%${search}%,description.ilike.%${search}%`
    );
  }

  // Handle sorting
  const ascending = sortOrder === 'asc';
  query = query.order(sortBy, { ascending });

  if (limit) {
    query = query.limit(limit);
  }

  const { data, error } = await query;

  if (error) {
    console.error('Error fetching products:', error);
    return [];
  }

  return data || [];
}

/**
 * Fetch a single product by slug
 */
export async function getProductBySlug(slug) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('slug', slug)
    .eq('is_active', true)
    .single();

  if (error) {
    console.error('Error fetching product:', error);
    return null;
  }

  return data;
}

/**
 * Fetch a single product by ID
 */
export async function getProductById(id) {
  const supabase = await createClient();

  const { data, error } = await supabase.from('products').select('*').eq('id', id).single();

  if (error) {
    console.error('Error fetching product:', error);
    return null;
  }

  return data;
}

/**
 * Get unique categories from products (legacy - use categories table instead)
 */
export async function getProductCategories() {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('products')
    .select('category')
    .eq('is_active', true)
    .not('category', 'is', null);

  if (error) {
    console.error('Error fetching categories:', error);
    return [];
  }

  return [...new Set(data?.map((p) => p.category).filter(Boolean) || [])];
}

// Keep getCategories as alias for backward compatibility
export const getCategories = getProductCategories;

/**
 * Get related products (same category, excluding current)
 */
export async function getRelatedProducts(productId, category, limit = 4) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('is_active', true)
    .eq('category', category)
    .neq('id', productId)
    .limit(limit);

  if (error) {
    console.error('Error fetching related products:', error);
    return [];
  }

  return data || [];
}

/**
 * Calculate price for a product configuration
 */
export function calculatePrice(product, options) {
  if (!product) return null;

  const {
    sizeId,
    materialId,
    finishingIds = [],
    leadTimeId,
    quantity = 1,
    addonIds = [],
  } = options;

  const sizes = product.sizes || [];
  const materials = product.materials || [];
  const finishings = product.finishings || [];
  const leadTimes = product.lead_times || [];
  const tierPricing = product.tier_pricing || [];
  const addons = product.addons || [];

  const size = sizes.find((s) => s.id === sizeId);
  const material = materials.find((m) => m.id === materialId);
  const leadTime = leadTimes.find((l) => l.id === leadTimeId);
  const selectedFinishings = finishings.filter((f) => finishingIds.includes(f.id));
  const selectedAddons = addons.filter((a) => addonIds.includes(a.id));

  // Size and material are required
  if (!size || !material) return null;

  // Calculate base price
  let basePrice = size.price || product.base_price || 0;
  basePrice += material.price || 0;
  basePrice += selectedFinishings.reduce((sum, f) => sum + (f.price || 0), 0);

  // Apply tier discount
  const tier = tierPricing.find(
    (t) => quantity >= t.minQty && (t.maxQty === null || quantity <= t.maxQty)
  );
  const discount = tier ? tier.discount : 0;
  const discountedPrice = basePrice * (1 - discount / 100);

  // Calculate subtotal
  const subtotal = discountedPrice * quantity;

  // Add rush fee (one-time, not per unit)
  const rushFee = leadTime?.price || 0;

  // Add addons (one-time fees)
  const addonsTotal = selectedAddons.reduce((sum, a) => sum + (a.price || 0), 0);

  return {
    basePrice,
    unitPrice: discountedPrice,
    quantity,
    subtotal,
    rushFee,
    addonsTotal,
    total: subtotal + rushFee + addonsTotal,
    discount,
    savings: discount > 0 ? (basePrice * quantity * discount) / 100 : 0,
  };
}

/**
 * Format price for display
 */
export function formatPrice(amount, currency = 'CAD') {
  return new Intl.NumberFormat('en-CA', {
    style: 'currency',
    currency,
  }).format(amount);
}
