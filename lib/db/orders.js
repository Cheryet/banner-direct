import { createClient, createAdminClient } from '@/lib/supabase/server';

/**
 * Fetch all orders with optional filters
 */
export async function getOrders({
  status = null,
  paymentStatus = null,
  limit = null,
  offset = 0,
  sortBy = 'created_at',
  sortOrder = 'desc',
  search = null,
} = {}) {
  const supabase = await createAdminClient();

  let query = supabase.from('orders').select('*, order_items(count)', { count: 'exact' });

  if (status) {
    query = query.eq('status', status);
  }

  if (paymentStatus) {
    query = query.eq('payment_status', paymentStatus);
  }

  if (search) {
    query = query.or(
      `order_number.ilike.%${search}%,customer_name.ilike.%${search}%,customer_email.ilike.%${search}%`
    );
  }

  const ascending = sortOrder === 'asc';
  query = query.order(sortBy, { ascending });

  if (limit) {
    query = query.range(offset, offset + limit - 1);
  }

  const { data, error, count } = await query;

  if (error) {
    console.error('Error fetching orders:', error);
    return { orders: [], count: 0 };
  }

  return { orders: data || [], count: count || 0 };
}

/**
 * Fetch a single order by ID with all related data
 */
export async function getOrderById(id) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('orders')
    .select(
      `
      *,
      order_items (
        *,
        upload:uploads (*)
      ),
      profile:profiles (*)
    `
    )
    .eq('id', id)
    .single();

  if (error) {
    console.error('Error fetching order:', error);
    return null;
  }

  return data;
}

/**
 * Fetch order by order number
 */
export async function getOrderByNumber(orderNumber) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('orders')
    .select(
      `
      *,
      order_items (
        *,
        upload:uploads (*)
      )
    `
    )
    .eq('order_number', orderNumber)
    .single();

  if (error) {
    console.error('Error fetching order:', error);
    return null;
  }

  return data;
}

/**
 * Get order statistics for dashboard
 */
export async function getOrderStats() {
  const supabase = await createAdminClient();

  // Get counts by status
  const { data: statusCounts, error: statusError } = await supabase.from('orders').select('status');

  if (statusError) {
    console.error('Error fetching order stats:', statusError);
    return null;
  }

  // Calculate stats
  const stats = {
    total: statusCounts?.length || 0,
    pending: 0,
    confirmed: 0,
    processing: 0,
    printing: 0,
    quality_check: 0,
    shipped: 0,
    delivered: 0,
    cancelled: 0,
    refunded: 0,
  };

  statusCounts?.forEach((order) => {
    if (stats.hasOwnProperty(order.status)) {
      stats[order.status]++;
    }
  });

  // Get revenue stats
  const { data: revenueData, error: revenueError } = await supabase
    .from('orders')
    .select('total, payment_status')
    .in('payment_status', ['paid', 'refunded']);

  if (!revenueError && revenueData) {
    stats.totalRevenue = revenueData
      .filter((o) => o.payment_status === 'paid')
      .reduce((sum, o) => sum + (o.total || 0), 0);
    stats.refundedAmount = revenueData
      .filter((o) => o.payment_status === 'refunded')
      .reduce((sum, o) => sum + (o.total || 0), 0);
  }

  return stats;
}

/**
 * Get recent orders for dashboard
 */
export async function getRecentOrders(limit = 5) {
  const supabase = await createAdminClient();

  const { data, error } = await supabase
    .from('orders')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(limit);

  if (error) {
    console.error('Error fetching recent orders:', error);
    return [];
  }

  return data || [];
}

/**
 * Get orders by user ID
 */
export async function getOrdersByUserId(userId) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('orders')
    .select('*, order_items(*)')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching user orders:', error);
    return [];
  }

  return data || [];
}

/**
 * Update order status
 */
export async function updateOrderStatus(orderId, status, adminNotes = null) {
  const supabase = await createClient();

  const updateData = { status };
  if (adminNotes !== null) {
    updateData.admin_notes = adminNotes;
  }

  const { data, error } = await supabase
    .from('orders')
    .update(updateData)
    .eq('id', orderId)
    .select()
    .single();

  if (error) {
    console.error('Error updating order status:', error);
    return null;
  }

  return data;
}

/**
 * Update order tracking info
 */
export async function updateOrderTracking(orderId, trackingNumber, trackingCarrier) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('orders')
    .update({
      tracking_number: trackingNumber,
      tracking_carrier: trackingCarrier,
      status: 'shipped',
    })
    .eq('id', orderId)
    .select()
    .single();

  if (error) {
    console.error('Error updating order tracking:', error);
    return null;
  }

  return data;
}
