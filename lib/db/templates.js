import { createClient } from '@/lib/supabase/server';

/**
 * Fetch all active templates
 */
export async function getTemplates({ category = null, featured = false, limit = null } = {}) {
  const supabase = await createClient();

  let query = supabase
    .from('templates')
    .select('*')
    .eq('is_active', true)
    .order('use_count', { ascending: false });

  if (category) {
    query = query.eq('category', category);
  }

  if (featured) {
    query = query.eq('is_featured', true);
  }

  if (limit) {
    query = query.limit(limit);
  }

  const { data, error } = await query;

  if (error) {
    console.error('Error fetching templates:', error);
    return [];
  }

  return data || [];
}

/**
 * Fetch a single template by slug
 */
export async function getTemplateBySlug(slug) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('templates')
    .select('*')
    .eq('slug', slug)
    .eq('is_active', true)
    .single();

  if (error) {
    console.error('Error fetching template:', error);
    return null;
  }

  return data;
}

/**
 * Get unique template categories
 */
export async function getTemplateCategories() {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('templates')
    .select('category')
    .eq('is_active', true)
    .not('category', 'is', null);

  if (error) {
    console.error('Error fetching template categories:', error);
    return [];
  }

  return [...new Set(data?.map((t) => t.category).filter(Boolean) || [])];
}

/**
 * Increment template use count
 */
export async function incrementTemplateUseCount(templateId) {
  const supabase = await createClient();

  const { error } = await supabase.rpc('increment_template_use_count', {
    template_id: templateId,
  });

  if (error) {
    console.error('Error incrementing template use count:', error);
  }
}
