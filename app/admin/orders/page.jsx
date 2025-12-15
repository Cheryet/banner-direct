import { createClient } from '@/lib/supabase/server';
import { OrdersPageClient } from '@/components/admin/orders-page-client';

export const metadata = {
  title: 'Orders - Admin',
  description: 'Manage customer orders',
};

export default async function AdminOrdersPage({ searchParams }) {
  const supabase = await createClient();
  const params = await searchParams;
  
  // Fetch all orders with profiles for the client component
  const { data: orders } = await supabase
    .from('orders')
    .select(`
      *,
      profiles:user_id (
        id,
        full_name,
        email,
        phone
      ),
      order_items (
        id,
        quantity,
        product_name
      )
    `)
    .order('created_at', { ascending: false });

  return <OrdersPageClient initialOrders={orders || []} />;
}
