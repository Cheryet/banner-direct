import { createClient } from '@/lib/supabase/server';

/**
 * Fetch all active categories
 */
export async function getCategories({ includeEmpty = false } = {}) {
  const supabase = await createClient();

  let query = supabase
    .from('categories')
    .select('*')
    .eq('is_active', true)
    .order('sort_order', { ascending: true });

  if (!includeEmpty) {
    query = query.gt('product_count', 0);
  }

  const { data, error } = await query;

  if (error) {
    console.error('Error fetching categories:', error);
    return [];
  }

  return data || [];
}

/**
 * Fetch a single category by slug
 */
export async function getCategoryBySlug(slug) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .eq('slug', slug)
    .eq('is_active', true)
    .single();

  if (error) {
    console.error('Error fetching category:', error);
    return null;
  }

  return data;
}

/**
 * Fetch categories with their products count
 */
export async function getCategoriesWithCounts() {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('categories')
    .select('*, products:products(count)')
    .eq('is_active', true)
    .order('sort_order', { ascending: true });

  if (error) {
    console.error('Error fetching categories with counts:', error);
    return [];
  }

  return data || [];
}
