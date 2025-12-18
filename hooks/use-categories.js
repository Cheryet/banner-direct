'use client';

import * as React from 'react';
import { createClient } from '@/lib/supabase/client';

/**
 * Hook to fetch all active categories (client-side)
 */
export function useCategories({ includeEmpty = false } = {}) {
  const [categories, setCategories] = React.useState([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState(null);

  React.useEffect(() => {
    async function fetchCategories() {
      setIsLoading(true);
      setError(null);

      const supabase = createClient();
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
        setError(error.message);
        setCategories([]);
      } else {
        setCategories(data || []);
      }
      setIsLoading(false);
    }

    fetchCategories();
  }, [includeEmpty]);

  return { categories, isLoading, error };
}

/**
 * Hook to fetch a single category by slug (client-side)
 */
export function useCategory(slug) {
  const [category, setCategory] = React.useState(null);
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState(null);

  React.useEffect(() => {
    if (!slug) {
      setIsLoading(false);
      return;
    }

    async function fetchCategory() {
      setIsLoading(true);
      setError(null);

      const supabase = createClient();
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .eq('slug', slug)
        .eq('is_active', true)
        .single();

      if (error) {
        setError(error.message);
        setCategory(null);
      } else {
        setCategory(data);
      }
      setIsLoading(false);
    }

    fetchCategory();
  }, [slug]);

  return { category, isLoading, error };
}
