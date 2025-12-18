import { createClient } from '@/lib/supabase/server';

/**
 * Fetch all active shipping zones
 */
export async function getShippingZones() {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('shipping_zones')
    .select('*')
    .eq('is_active', true);

  if (error) {
    console.error('Error fetching shipping zones:', error);
    return [];
  }

  return data || [];
}

/**
 * Fetch shipping rates for a specific zone
 */
export async function getShippingRates(zoneId = null) {
  const supabase = await createClient();

  let query = supabase
    .from('shipping_rates')
    .select('*, zone:shipping_zones(*)')
    .eq('is_active', true)
    .order('base_rate', { ascending: true });

  if (zoneId) {
    query = query.eq('zone_id', zoneId);
  }

  const { data, error } = await query;

  if (error) {
    console.error('Error fetching shipping rates:', error);
    return [];
  }

  return data || [];
}

/**
 * Get shipping zone by province
 */
export async function getShippingZoneByProvince(province) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('shipping_zones')
    .select('*')
    .eq('is_active', true)
    .contains('provinces', [province]);

  if (error) {
    console.error('Error fetching shipping zone:', error);
    return null;
  }

  return data?.[0] || null;
}

/**
 * Calculate shipping cost for an order
 */
export async function calculateShipping({ province, orderValue, totalWeight }) {
  const zone = await getShippingZoneByProvince(province);
  
  if (!zone) {
    return { error: 'Shipping not available to this location' };
  }

  const supabase = await createClient();

  // Get applicable rates for this zone
  const { data: rates, error } = await supabase
    .from('shipping_rates')
    .select('*')
    .eq('zone_id', zone.id)
    .eq('is_active', true)
    .order('base_rate', { ascending: true });

  if (error || !rates?.length) {
    return { error: 'No shipping rates available' };
  }

  // Find the best applicable rate
  const applicableRates = rates.filter((rate) => {
    const meetsMinOrder = !rate.min_order_value || orderValue >= rate.min_order_value;
    const meetsMaxOrder = !rate.max_order_value || orderValue <= rate.max_order_value;
    const meetsMinWeight = !rate.min_weight || totalWeight >= rate.min_weight;
    const meetsMaxWeight = !rate.max_weight || totalWeight <= rate.max_weight;
    return meetsMinOrder && meetsMaxOrder && meetsMinWeight && meetsMaxWeight;
  });

  if (!applicableRates.length) {
    return { error: 'No applicable shipping rates' };
  }

  // Return the cheapest applicable rate
  const bestRate = applicableRates[0];
  const shippingCost = bestRate.base_rate + (totalWeight * (bestRate.per_kg_rate || 0));

  return {
    rate: bestRate,
    cost: shippingCost,
    estimatedDays: {
      min: bestRate.estimated_days_min,
      max: bestRate.estimated_days_max,
    },
  };
}
