import { createClient } from '@/lib/supabase/server';
import { notFound } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { LinkButton } from '@/components/ui/link-button';
import Link from 'next/link';
import {
  ArrowLeft,
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  ShoppingCart,
  DollarSign,
  Package,
  Eye,
  Clock,
} from 'lucide-react';
import { formatCurrency, formatDate } from '@/lib/format';

export async function generateMetadata({ params }) {
  return {
    title: 'Customer Details - Admin',
    description: 'View customer information and order history',
  };
}

function getStatusBadge(status) {
  const styles = {
    pending: 'bg-yellow-100 text-yellow-700',
    confirmed: 'bg-blue-100 text-blue-700',
    processing: 'bg-blue-100 text-blue-700',
    printing: 'bg-purple-100 text-purple-700',
    shipped: 'bg-emerald-100 text-emerald-700',
    delivered: 'bg-emerald-100 text-emerald-700',
    cancelled: 'bg-gray-100 text-gray-700',
  };

  return (
    <span
      className={`rounded-full px-2.5 py-1 text-xs font-medium ${styles[status] || styles.pending}`}
    >
      {status.replace('_', ' ').replace(/\b\w/g, (l) => l.toUpperCase())}
    </span>
  );
}

export default async function AdminCustomerDetailPage({ params }) {
  const { id } = await params;
  const supabase = await createClient();

  // Fetch customer profile
  const { data: customer, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', id)
    .single();

  if (error || !customer) {
    notFound();
  }

  // Fetch customer's orders
  const { data: orders } = await supabase
    .from('orders')
    .select('*')
    .eq('user_id', id)
    .order('created_at', { ascending: false });

  // Calculate stats
  const totalOrders = orders?.length || 0;
  const totalSpent = orders?.reduce((sum, o) => sum + (parseFloat(o.total) || 0), 0) || 0;
  const avgOrderValue = totalOrders > 0 ? totalSpent / totalOrders : 0;

  return (
    <div className="min-w-0">
      {/* Header */}
      <div className="mb-6">
        <Link
          href="/admin/customers"
          className="mb-3 inline-flex items-center gap-2 text-sm text-gray-600 hover:text-emerald-600"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Customers
        </Link>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex items-center gap-3 sm:gap-4">
            <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-emerald-100 text-xl font-bold text-emerald-700 sm:h-16 sm:w-16 sm:text-2xl">
              {(customer.first_name || customer.email || 'U').charAt(0).toUpperCase()}
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900 sm:text-2xl">
                {customer.first_name || customer.last_name
                  ? `${customer.first_name || ''} ${customer.last_name || ''}`.trim()
                  : 'No name'}
              </h1>
              <p className="text-sm text-muted-foreground">
                Customer since {formatDate(customer.created_at)}
              </p>
            </div>
          </div>
          {customer.email && (
            <LinkButton
              href={`mailto:${customer.email}`}
              variant="outline"
              className="w-full sm:w-auto"
            >
              <Mail className="mr-2 h-4 w-4" />
              Send Email
            </LinkButton>
          )}
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main Content */}
        <div className="space-y-6 lg:col-span-2">
          {/* Stats */}
          <div className="grid gap-4 sm:grid-cols-3">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <ShoppingCart className="h-8 w-8 text-blue-500" />
                  <div>
                    <p className="text-sm text-muted-foreground">Total Orders</p>
                    <p className="text-2xl font-bold">{totalOrders}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <DollarSign className="h-8 w-8 text-emerald-500" />
                  <div>
                    <p className="text-sm text-muted-foreground">Total Spent</p>
                    <p className="text-2xl font-bold">{formatCurrency(totalSpent)}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <Package className="h-8 w-8 text-purple-500" />
                  <div>
                    <p className="text-sm text-muted-foreground">Avg. Order</p>
                    <p className="text-2xl font-bold">{formatCurrency(avgOrderValue)}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Orders */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ShoppingCart className="h-5 w-5" />
                Order History
              </CardTitle>
              <CardDescription>All orders placed by this customer</CardDescription>
            </CardHeader>
            <CardContent>
              {!orders || orders.length === 0 ? (
                <div className="py-8 text-center text-gray-500">No orders yet</div>
              ) : (
                <div className="space-y-3">
                  {orders.map((order) => (
                    <Link
                      key={order.id}
                      href={`/admin/orders/${order.id}`}
                      className="flex items-center justify-between rounded-lg border p-4 transition-colors hover:bg-gray-50"
                    >
                      <div className="flex items-center gap-4">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gray-100">
                          <Package className="h-5 w-5 text-gray-500" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">
                            {order.order_number || `#${order.id.slice(0, 8)}`}
                          </p>
                          <p className="text-sm text-gray-500">{formatDate(order.created_at)}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        {getStatusBadge(order.status)}
                        <p className="font-semibold text-gray-900">{formatCurrency(order.total)}</p>
                        <Eye className="h-4 w-4 text-gray-400" />
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Contact Info */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Contact Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {customer.email && (
                <div className="flex items-start gap-3">
                  <Mail className="mt-0.5 h-4 w-4 text-gray-400" />
                  <div>
                    <p className="text-sm font-medium text-gray-500">Email</p>
                    <a
                      href={`mailto:${customer.email}`}
                      className="text-gray-900 hover:text-emerald-600"
                    >
                      {customer.email}
                    </a>
                  </div>
                </div>
              )}
              {customer.phone && (
                <div className="flex items-start gap-3">
                  <Phone className="mt-0.5 h-4 w-4 text-gray-400" />
                  <div>
                    <p className="text-sm font-medium text-gray-500">Phone</p>
                    <a
                      href={`tel:${customer.phone}`}
                      className="text-gray-900 hover:text-emerald-600"
                    >
                      {customer.phone}
                    </a>
                  </div>
                </div>
              )}
              {customer.company && (
                <div className="flex items-start gap-3">
                  <User className="mt-0.5 h-4 w-4 text-gray-400" />
                  <div>
                    <p className="text-sm font-medium text-gray-500">Company</p>
                    <p className="text-gray-900">{customer.company}</p>
                  </div>
                </div>
              )}
              <div className="flex items-start gap-3">
                <Calendar className="mt-0.5 h-4 w-4 text-gray-400" />
                <div>
                  <p className="text-sm font-medium text-gray-500">Member Since</p>
                  <p className="text-gray-900">{formatDate(customer.created_at)}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Default Address */}
          {customer.default_address && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="h-5 w-5" />
                  Default Address
                </CardTitle>
              </CardHeader>
              <CardContent>
                <address className="text-sm not-italic text-gray-600">
                  {typeof customer.default_address === 'object' ? (
                    <>
                      <p>{customer.default_address.line1}</p>
                      {customer.default_address.line2 && <p>{customer.default_address.line2}</p>}
                      <p>
                        {customer.default_address.city}, {customer.default_address.province}{' '}
                        {customer.default_address.postal_code}
                      </p>
                      <p>{customer.default_address.country}</p>
                    </>
                  ) : (
                    <p>{customer.default_address}</p>
                  )}
                </address>
              </CardContent>
            </Card>
          )}

          {/* Account Status */}
          <Card>
            <CardHeader>
              <CardTitle>Account Status</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Role</span>
                  <span
                    className={`rounded-full px-2.5 py-1 text-xs font-medium ${
                      customer.role === 'admin'
                        ? 'bg-purple-100 text-purple-700'
                        : 'bg-gray-100 text-gray-700'
                    }`}
                  >
                    {customer.role || 'Customer'}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Status</span>
                  <span className="rounded-full bg-emerald-100 px-2.5 py-1 text-xs font-medium text-emerald-700">
                    Active
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
