import { createClient } from '@/lib/supabase/server';

/**
 * Fetch all settings as a key-value object
 */
export async function getSettings() {
  const supabase = await createClient();

  const { data, error } = await supabase.from('settings').select('key, value');

  if (error) {
    console.error('Error fetching settings:', error);
    return {};
  }

  // Convert array to object
  return (data || []).reduce((acc, { key, value }) => {
    acc[key] = value;
    return acc;
  }, {});
}

/**
 * Fetch a single setting by key
 */
export async function getSetting(key, defaultValue = null) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('settings')
    .select('value')
    .eq('key', key)
    .single();

  if (error || !data) {
    return defaultValue;
  }

  return data.value;
}

/**
 * Fetch multiple settings by keys
 */
export async function getSettingsByKeys(keys) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('settings')
    .select('key, value')
    .in('key', keys);

  if (error) {
    console.error('Error fetching settings:', error);
    return {};
  }

  return (data || []).reduce((acc, { key, value }) => {
    acc[key] = value;
    return acc;
  }, {});
}
