'use client';

import * as React from 'react';
import { createClient } from '@/lib/supabase/client';

/**
 * Hook to fetch all settings (client-side)
 */
export function useSettings() {
  const [settings, setSettings] = React.useState({});
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState(null);

  React.useEffect(() => {
    async function fetchSettings() {
      setIsLoading(true);
      setError(null);

      const supabase = createClient();
      const { data, error } = await supabase.from('settings').select('key, value');

      if (error) {
        setError(error.message);
        setSettings({});
      } else {
        const settingsObj = (data || []).reduce((acc, { key, value }) => {
          acc[key] = value;
          return acc;
        }, {});
        setSettings(settingsObj);
      }
      setIsLoading(false);
    }

    fetchSettings();
  }, []);

  return { settings, isLoading, error };
}

/**
 * Hook to fetch a single setting by key (client-side)
 */
export function useSetting(key, defaultValue = null) {
  const [value, setValue] = React.useState(defaultValue);
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState(null);

  React.useEffect(() => {
    if (!key) {
      setIsLoading(false);
      return;
    }

    async function fetchSetting() {
      setIsLoading(true);
      setError(null);

      const supabase = createClient();
      const { data, error } = await supabase
        .from('settings')
        .select('value')
        .eq('key', key)
        .single();

      if (error) {
        setError(error.message);
        setValue(defaultValue);
      } else {
        setValue(data?.value ?? defaultValue);
      }
      setIsLoading(false);
    }

    fetchSetting();
  }, [key, defaultValue]);

  return { value, isLoading, error };
}
