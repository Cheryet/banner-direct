import { createAdminClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

/**
 * GET /api/admin/orders/[id]
 * Fetch a single order by ID with all related data
 */
export async function GET(request, { params }) {
  try {
    const supabase = await createAdminClient();

    if (!supabase) {
      return NextResponse.json({ error: 'Database not configured' }, { status: 500 });
    }

    const { id } = await params;

    const { data, error } = await supabase
      .from('orders')
      .select(
        `
        *,
        order_items (
          id,
          quantity,
          unit_price,
          product_name,
          product_options,
          artwork_url
        )
      `
      )
      .eq('id', id)
      .single();

    if (error) {
      console.error('Error fetching order:', error);
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    return NextResponse.json({ order: data });
  } catch (err) {
    console.error('API error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

/**
 * PATCH /api/admin/orders/[id]
 * Update order details
 */
export async function PATCH(request, { params }) {
  try {
    const supabase = await createAdminClient();

    if (!supabase) {
      return NextResponse.json({ error: 'Database not configured' }, { status: 500 });
    }

    const { id } = await params;
    const body = await request.json();

    const updateData = { updated_at: new Date().toISOString() };

    // Only include fields that are provided
    if (body.status !== undefined) updateData.status = body.status;
    if (body.tracking_number !== undefined) updateData.tracking_number = body.tracking_number;
    if (body.tracking_carrier !== undefined) updateData.tracking_carrier = body.tracking_carrier;
    if (body.admin_notes !== undefined) updateData.admin_notes = body.admin_notes;

    const { data, error } = await supabase
      .from('orders')
      .update(updateData)
      .eq('id', id)
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
