import { createClient, createAdminClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

/**
 * GET /api/admin/orders
 * Fetch all orders for admin dashboard (bypasses RLS with service role)
 */
export async function GET(request) {
  try {
    // Use admin client if available, otherwise fall back to regular client
    const supabase = await createAdminClient();

    if (!supabase) {
      return NextResponse.json({ error: 'Database not configured' }, { status: 500 });
    }

    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const excludeStatuses = searchParams.get('exclude');

    let query = supabase
      .from('orders')
      .select(
        `
        *,
        order_items (id, quantity, product_name)
      `
      )
      .order('created_at', { ascending: false });

    if (status) {
      query = query.eq('status', status);
    }

    if (excludeStatuses) {
      const statusList = excludeStatuses.split(',');
      statusList.forEach((s) => {
        query = query.neq('status', s.trim());
      });
    }

    const { data, error } = await query;

    if (error) {
      console.error('Error fetching orders:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ orders: data || [] });
  } catch (err) {
    console.error('API error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

/**
 * PATCH /api/admin/orders
 * Update order status
 */
export async function PATCH(request) {
  try {
    const supabase = await createAdminClient();

    if (!supabase) {
      return NextResponse.json({ error: 'Database not configured' }, { status: 500 });
    }

    const body = await request.json();
    const { orderId, status, trackingNumber, trackingCarrier } = body;

    if (!orderId) {
      return NextResponse.json({ error: 'Order ID required' }, { status: 400 });
    }

    const updateData = { updated_at: new Date().toISOString() };
    if (status) updateData.status = status;
    if (trackingNumber !== undefined) updateData.tracking_number = trackingNumber;
    if (trackingCarrier !== undefined) updateData.tracking_carrier = trackingCarrier;

    const { data, error } = await supabase
      .from('orders')
      .update(updateData)
      .eq('id', orderId)
      .select()
      .single();

    if (error) {
      console.error('Error updating order:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ order: data });
  } catch (err) {
    console.error('API error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
