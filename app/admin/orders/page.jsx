import { getOrders } from '@/lib/db/orders';
import { OrdersPageClient } from '@/components/admin/orders-page-client';

export const metadata = {
  title: 'Orders - Admin',
  description: 'Manage customer orders',
};

export default async function AdminOrdersPage({ searchParams }) {
  const params = await searchParams;
  const statusFilter = params?.status || null;

  // Fetch orders using modular utility
  const { orders } = await getOrders({
    status: statusFilter,
    sortBy: 'created_at',
    sortOrder: 'desc',
  });

  return <OrdersPageClient initialOrders={orders || []} />;
}
