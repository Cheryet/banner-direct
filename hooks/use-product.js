'use client';

import * as React from 'react';
import { createClient } from '@/lib/supabase/client';

/**
 * Hook to fetch a single product by slug (client-side)
 */
export function useProduct(slug) {
  const [product, setProduct] = React.useState(null);
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState(null);

  React.useEffect(() => {
    if (!slug) {
      setIsLoading(false);
      return;
    }

    async function fetchProduct() {
      setIsLoading(true);
      setError(null);

      const supabase = createClient();
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('slug', slug)
        .eq('is_active', true)
        .single();

      if (error) {
        setError(error.message);
        setProduct(null);
      } else {
        setProduct(data);
      }
      setIsLoading(false);
    }

    fetchProduct();
  }, [slug]);

  return { product, isLoading, error };
}

/**
 * Hook to fetch products with filters (client-side)
 */
export function useProducts({ category = null, featured = false, limit = null } = {}) {
  const [products, setProducts] = React.useState([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState(null);

  React.useEffect(() => {
    async function fetchProducts() {
      setIsLoading(true);
      setError(null);

      const supabase = createClient();
      let query = supabase
        .from('products')
        .select('*')
        .eq('is_active', true)
        .order('created_at', { ascending: false });

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
        setError(error.message);
        setProducts([]);
      } else {
        setProducts(data || []);
      }
      setIsLoading(false);
    }

    fetchProducts();
  }, [category, featured, limit]);

  return { products, isLoading, error };
}

/**
 * Calculate price for a product configuration (client-side utility)
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

  if (!size || !material) return null;

  let basePrice = size.price || product.base_price || 0;
  basePrice += material.price || 0;
  basePrice += selectedFinishings.reduce((sum, f) => sum + (f.price || 0), 0);

  const tier = tierPricing.find(
    (t) => quantity >= t.minQty && (t.maxQty === null || quantity <= t.maxQty)
  );
  const discount = tier ? tier.discount : 0;
  const discountedPrice = basePrice * (1 - discount / 100);

  const subtotal = discountedPrice * quantity;
  const rushFee = leadTime?.price || 0;
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
