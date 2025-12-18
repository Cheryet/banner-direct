import { createClient } from '@/lib/supabase/server';

/**
 * Fetch all active lead times
 */
export async function getLeadTimes() {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('lead_times')
    .select('*')
    .eq('is_active', true)
    .order('sort_order', { ascending: true });

  if (error) {
    console.error('Error fetching lead times:', error);
    return [];
  }

  return data || [];
}

/**
 * Get the default lead time
 */
export async function getDefaultLeadTime() {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('lead_times')
    .select('*')
    .eq('is_active', true)
    .eq('is_default', true)
    .single();

  if (error) {
    console.error('Error fetching default lead time:', error);
    return null;
  }

  return data;
}
