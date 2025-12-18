import { redirect } from 'next/navigation';
import { createClient, getUser } from '@/lib/supabase/server';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { LinkButton } from '@/components/ui/link-button';
import {
  Package,
  ShoppingBag,
  ArrowRight,
  ArrowLeft,
  RefreshCw,
  Eye,
  Calendar,
  Truck,
} from 'lucide-react';
import Link from 'next/link';
import { formatCurrency, formatDate } from '@/lib/format';
import { STATUS_COLORS, getStatusById } from '@/lib/constants/orders';

export const metadata = {
  title: 'Order History',
  description: 'View and manage all your past orders.',
};

function getStatusBadge(status) {
  const styles = {
    pending: 'bg-yellow-100 text-yellow-700 border-yellow-200',
    confirmed: 'bg-blue-100 text-blue-700 border-blue-200',
    processing: 'bg-blue-100 text-blue-700 border-blue-200',
    printing: 'bg-purple-100 text-purple-700 border-purple-200',
    quality_check: 'bg-indigo-100 text-indigo-700 border-indigo-200',
    shipped: 'bg-emerald-100 text-emerald-700 border-emerald-200',
    delivered: 'bg-emerald-100 text-emerald-700 border-emerald-200',
    cancelled: 'bg-gray-100 text-gray-700 border-gray-200',
    refunded: 'bg-red-100 text-red-700 border-red-200',
  };

  const labels = {
    pending: 'Pending',
    confirmed: 'Confirmed',
    processing: 'Processing',
    printing: 'Printing',
    quality_check: 'Quality Check',
    shipped: 'Shipped',
    delivered: 'Delivered',
    cancelled: 'Cancelled',
    refunded: 'Refunded',
  };

  return (
    <span
      className={`rounded-full border px-3 py-1 text-xs font-medium ${styles[status] || styles.pending}`}
    >
      {labels[status] || status}
    </span>
  );
}


export default async function OrdersPage() {
  const supabase = await createClient();
  const { user, error } = await getUser();

  if (!user || error) {
    redirect('/login?redirectTo=/orders');
  }

  // Fetch all orders for the user
  const { data: orders } = await supabase
    .from('orders')
    .select(
      `
      *,
      order_items (
        id,
        quantity,
        unit_price,
        product_name,
        product_options
      )
    `
    )
    .eq('user_id', user.id)
    .order('created_at', { ascending: false });

  return (
    <div className="container py-8 md:py-12">
      {/* Breadcrumb */}
      <nav className="mb-6">
        <Link
          href="/account"
          className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-emerald-600 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to My Account
        </Link>
      </nav>

      {/* Page Header */}
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Order History</h1>
          <p className="mt-2 text-gray-600">
            View all your past orders and quickly reorder your favorites.
          </p>
        </div>
        <LinkButton href="/products" variant="outline">
          <ShoppingBag className="mr-2 h-4 w-4" />
          New Order
        </LinkButton>
      </div>

      {/* Orders List */}
      {!orders || orders.length === 0 ? (
        <Card>
          <CardContent className="py-16">
            <div className="flex flex-col items-center justify-center text-center">
              <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gray-100">
                <Package className="h-8 w-8 text-gray-400" />
              </div>
              <h2 className="text-xl font-semibold text-gray-900">No orders yet</h2>
              <p className="mt-2 max-w-sm text-gray-600">
                Once you place your first order, it will appear here. Ready to get started?
              </p>
              <LinkButton href="/products" className="mt-6">
                Browse Products
                <ArrowRight className="ml-2 h-4 w-4" />
              </LinkButton>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <Card key={order.id} className="overflow-hidden transition-shadow hover:shadow-md">
              <div className="border-b bg-gray-50 px-6 py-4">
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div className="flex flex-wrap items-center gap-4 sm:gap-6">
                    <div>
                      <p className="text-xs font-medium uppercase text-gray-500">Order Number</p>
                      <p className="font-semibold text-gray-900">{order.order_number}</p>
                    </div>
                    <div className="hidden sm:block">
                      <p className="text-xs font-medium uppercase text-gray-500">Date Placed</p>
                      <p className="text-sm text-gray-700">{formatDate(order.created_at)}</p>
                    </div>
                    <div>
                      <p className="text-xs font-medium uppercase text-gray-500">Total</p>
                      <p className="font-semibold text-gray-900">{formatCurrency(order.total)}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">{getStatusBadge(order.status)}</div>
                </div>
              </div>

              <CardContent className="p-6">
                {/* Order Items */}
                <div className="space-y-3">
                  {order.order_items && order.order_items.length > 0 ? (
                    order.order_items.slice(0, 3).map((item) => (
                      <div
                        key={item.id}
                        className="flex items-center justify-between rounded-lg bg-gray-50 p-3"
                      >
                        <div className="flex items-center gap-3">
                          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-100">
                            <Package className="h-5 w-5 text-emerald-600" />
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">{item.product_name}</p>
                            <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                          </div>
                        </div>
                        <p className="font-medium text-gray-900">
                          {formatCurrency(item.unit_price * item.quantity)}
                        </p>
                      </div>
                    ))
                  ) : (
                    <div className="rounded-lg bg-gray-50 p-3 text-center text-sm text-gray-500">
                      Order details not available
                    </div>
                  )}

                  {order.order_items && order.order_items.length > 3 && (
                    <p className="text-center text-sm text-gray-500">
                      +{order.order_items.length - 3} more item(s)
                    </p>
                  )}
                </div>

                {/* Order Actions */}
                <div className="mt-6 flex flex-wrap items-center justify-between gap-3 border-t pt-4">
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    {order.status === 'shipped' && order.tracking_number && (
                      <>
                        <Truck className="h-4 w-4" />
                        <span>Tracking: {order.tracking_number}</span>
                      </>
                    )}
                    {order.status === 'delivered' && (
                      <>
                        <Calendar className="h-4 w-4" />
                        <span>Delivered on {formatDate(order.updated_at)}</span>
                      </>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <LinkButton href={`/orders/${order.id}`} variant="outline" size="sm">
                      <Eye className="mr-1.5 h-4 w-4" />
                      View Details
                    </LinkButton>
                    <LinkButton href={`/orders/${order.id}/reorder`} variant="default" size="sm">
                      <RefreshCw className="mr-1.5 h-4 w-4" />
                      Reorder
                    </LinkButton>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Help Section */}
      <div className="mt-12 rounded-xl border bg-gray-50 p-6 md:p-8">
        <div className="flex flex-col items-start gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Need help with an order?</h2>
            <p className="mt-1 text-gray-600">
              Our support team is here to assist you with any questions or concerns.
            </p>
          </div>
          <LinkButton href="/contact" variant="outline">
            Contact Support
            <ArrowRight className="ml-2 h-4 w-4" />
          </LinkButton>
        </div>
      </div>
    </div>
  );
}
