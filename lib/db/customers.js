import { createClient, createAdminClient } from '@/lib/supabase/server';

/**
 * Fetch all customers (profiles with role 'user')
 */
export async function getCustomers({
  limit = null,
  offset = 0,
  sortBy = 'created_at',
  sortOrder = 'desc',
  search = null,
} = {}) {
  const supabase = await createAdminClient();

  let query = supabase
    .from('profiles')
    .select('*', { count: 'exact' })
    .eq('role', 'user')
    .eq('is_anonymous', false);

  if (search) {
    query = query.or(
      `email.ilike.%${search}%,first_name.ilike.%${search}%,last_name.ilike.%${search}%,phone.ilike.%${search}%`
    );
  }

  const ascending = sortOrder === 'asc';
  query = query.order(sortBy, { ascending });

  if (limit) {
    query = query.range(offset, offset + limit - 1);
  }

  const { data, error, count } = await query;

  if (error) {
    console.error('Error fetching customers:', error);
    return { customers: [], count: 0 };
  }

  return { customers: data || [], count: count || 0 };
}

/**
 * Fetch a single customer by ID with order history
 */
export async function getCustomerById(id) {
  const supabase = await createAdminClient();

  const { data: customer, error: customerError } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', id)
    .single();

  if (customerError) {
    console.error('Error fetching customer:', customerError);
    return null;
  }

  // Get customer's orders
  const { data: orders, error: ordersError } = await supabase
    .from('orders')
    .select('*')
    .eq('user_id', id)
    .order('created_at', { ascending: false });

  if (ordersError) {
    console.error('Error fetching customer orders:', ordersError);
  }

  return {
    ...customer,
    orders: orders || [],
    orderCount: orders?.length || 0,
    totalSpent: orders?.reduce((sum, o) => sum + (o.total || 0), 0) || 0,
  };
}

/**
 * Get customer statistics for dashboard
 */
export async function getCustomerStats() {
  const supabase = await createAdminClient();

  const { data, error, count } = await supabase
    .from('profiles')
    .select('*', { count: 'exact' })
    .eq('role', 'user')
    .eq('is_anonymous', false);

  if (error) {
    console.error('Error fetching customer stats:', error);
    return null;
  }

  // Get customers with orders
  const { data: ordersData } = await supabase
    .from('orders')
    .select('user_id')
    .not('user_id', 'is', null);

  const uniqueCustomersWithOrders = new Set(ordersData?.map((o) => o.user_id) || []);

  return {
    total: count || 0,
    withOrders: uniqueCustomersWithOrders.size,
    newThisMonth:
      data?.filter((c) => {
        const createdAt = new Date(c.created_at);
        const now = new Date();
        return (
          createdAt.getMonth() === now.getMonth() && createdAt.getFullYear() === now.getFullYear()
        );
      }).length || 0,
  };
}

/**
 * Get recent customers for dashboard
 */
export async function getRecentCustomers(limit = 5) {
  const supabase = await createAdminClient();

  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('role', 'user')
    .eq('is_anonymous', false)
    .order('created_at', { ascending: false })
    .limit(limit);

  if (error) {
    console.error('Error fetching recent customers:', error);
    return [];
  }

  return data || [];
}

/**
 * Search customers by email or name
 */
export async function searchCustomers(query, limit = 10) {
  const supabase = await createAdminClient();

  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('role', 'user')
    .eq('is_anonymous', false)
    .or(`email.ilike.%${query}%,first_name.ilike.%${query}%,last_name.ilike.%${query}%`)
    .limit(limit);

  if (error) {
    console.error('Error searching customers:', error);
    return [];
  }

  return data || [];
}
