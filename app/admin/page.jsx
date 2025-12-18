import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { LinkButton } from '@/components/ui/link-button';
import Link from 'next/link';
import {
  ShoppingCart,
  DollarSign,
  Package,
  Users,
  TrendingUp,
  Clock,
  AlertTriangle,
  ArrowRight,
  Truck,
  CheckCircle,
  Printer,
  AlertCircle,
  Eye,
  RefreshCw,
  ClipboardCheck,
} from 'lucide-react';
import { getOrderStats, getRecentOrders } from '@/lib/db/orders';
import { getCustomerStats } from '@/lib/db/customers';
import { getUploadStats } from '@/lib/db/uploads';
import { getProducts } from '@/lib/products';
import { createClient } from '@/lib/supabase/server';

/**
 * Admin Dashboard
 * Overview of key metrics and recent activity
 */
export default async function AdminDashboard() {
  // Fetch all dashboard data in parallel using modular utilities
  const [orderStats, customerStats, uploadStats, products, recentOrdersData] = await Promise.all([
    getOrderStats(),
    getCustomerStats(),
    getUploadStats(),
    getProducts({ limit: 100 }), // Get count of active products
    getRecentOrders(10), // Get recent orders for display
  ]);

  // Handle case where data couldn't be fetched
  if (!orderStats) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <Card className="max-w-md">
          <CardContent className="pt-6 text-center">
            <AlertTriangle className="mx-auto h-12 w-12 text-yellow-500" />
            <h2 className="mt-4 text-xl font-semibold">Unable to Load Dashboard</h2>
            <p className="mt-2 text-muted-foreground">
              Please check your database connection and try again.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const totalOrders = orderStats.total;
  const totalProducts = products.length;
  const totalCustomers = customerStats?.total || 0;
  const totalRevenue = orderStats.totalRevenue || 0;

  // Order status counts for pipeline
  const ordersByStatus = {
    pending: orderStats.pending,
    confirmed: orderStats.confirmed,
    processing: orderStats.processing,
    printing: orderStats.printing,
    quality_check: orderStats.quality_check,
    shipped: orderStats.shipped,
    delivered: orderStats.delivered,
  };

  const needsAction = ordersByStatus.pending + ordersByStatus.confirmed;

  // Filter urgent orders (pending/confirmed) from recent orders
  const urgentOrders = recentOrdersData
    .filter((o) => o.status === 'pending' || o.status === 'confirmed')
    .slice(0, 3);

  const stats = [
    {
      title: 'Total Revenue',
      value: `$${totalRevenue.toLocaleString('en-CA', { minimumFractionDigits: 2 })}`,
      icon: DollarSign,
      description: 'All time',
      color: 'text-emerald-600',
      bgColor: 'bg-emerald-100',
    },
    {
      title: 'Total Orders',
      value: totalOrders.toString(),
      icon: ShoppingCart,
      description: 'All time',
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
    },
    {
      title: 'Products',
      value: totalProducts.toString(),
      icon: Package,
      description: 'Active listings',
      color: 'text-purple-600',
      bgColor: 'bg-purple-100',
    },
    {
      title: 'Customers',
      value: totalCustomers.toString(),
      icon: Users,
      description: 'Registered accounts',
      color: 'text-orange-600',
      bgColor: 'bg-orange-100',
    },
  ];

  // Pipeline stages for visual display
  const pipelineStages = [
    {
      id: 'pending',
      label: 'Pending',
      count: ordersByStatus.pending,
      icon: Clock,
      color: 'yellow',
      urgent: true,
    },
    {
      id: 'confirmed',
      label: 'Confirmed',
      count: ordersByStatus.confirmed,
      icon: CheckCircle,
      color: 'blue',
      urgent: true,
    },
    {
      id: 'processing',
      label: 'Processing',
      count: ordersByStatus.processing,
      icon: RefreshCw,
      color: 'blue',
    },
    {
      id: 'printing',
      label: 'Printing',
      count: ordersByStatus.printing,
      icon: Printer,
      color: 'purple',
    },
    {
      id: 'quality_check',
      label: 'QC',
      count: ordersByStatus.quality_check,
      icon: ClipboardCheck,
      color: 'indigo',
    },
    {
      id: 'shipped',
      label: 'Shipped',
      count: ordersByStatus.shipped,
      icon: Truck,
      color: 'emerald',
    },
  ];

  return (
    <div className="min-w-0">
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-900 sm:text-2xl">Dashboard</h1>
          <p className="text-sm text-muted-foreground">Welcome back! Here's what's happening.</p>
        </div>
        <LinkButton href="/admin/orders">
          <ShoppingCart className="h-4 w-4" />
          View Orders
        </LinkButton>
      </div>

      {/* Urgent Alert */}
      {needsAction > 0 && (
        <Card className="mb-6 border-yellow-300 bg-yellow-50">
          <CardContent className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-yellow-100">
                <AlertCircle className="h-5 w-5 text-yellow-600" />
              </div>
              <div>
                <p className="font-semibold text-yellow-800">
                  {needsAction} order{needsAction !== 1 ? 's' : ''} need attention
                </p>
                <p className="text-sm text-yellow-700 hidden sm:block">
                  Review and confirm pending orders
                </p>
              </div>
            </div>
            <Link
              href="/admin/orders?status=pending"
              className="inline-flex w-full items-center justify-center gap-1 rounded-lg bg-yellow-600 px-4 py-2 text-sm font-medium text-white hover:bg-yellow-700 sm:w-auto"
            >
              Review Now
              <ArrowRight className="h-4 w-4" />
            </Link>
          </CardContent>
        </Card>
      )}

      {/* Order Pipeline - Horizontal scroll on mobile */}
      <Card className="mb-6">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">Order Pipeline</CardTitle>
          <CardDescription>Current orders by fulfillment stage</CardDescription>
        </CardHeader>
        <CardContent className="overflow-x-auto">
          <div className="flex items-center gap-2" style={{ minWidth: '600px' }}>
            {pipelineStages.map((stage, index) => {
              const Icon = stage.icon;
              const colorClasses = {
                yellow: {
                  bg: 'bg-yellow-100',
                  text: 'text-yellow-700',
                  border: 'border-yellow-200',
                },
                blue: { bg: 'bg-blue-100', text: 'text-blue-700', border: 'border-blue-200' },
                purple: {
                  bg: 'bg-purple-100',
                  text: 'text-purple-700',
                  border: 'border-purple-200',
                },
                indigo: {
                  bg: 'bg-indigo-100',
                  text: 'text-indigo-700',
                  border: 'border-indigo-200',
                },
                emerald: {
                  bg: 'bg-emerald-100',
                  text: 'text-emerald-700',
                  border: 'border-emerald-200',
                },
              };
              const colors = colorClasses[stage.color];
              return (
                <div key={stage.id} className="flex flex-1 items-center">
                  <Link
                    href={`/admin/orders?status=${stage.id}`}
                    className={`flex-1 rounded-lg border p-2 text-center transition-all hover:shadow-md sm:p-3 ${stage.urgent && stage.count > 0 ? colors.border + ' ' + colors.bg : 'border-gray-200 hover:border-gray-300'}`}
                  >
                    <div
                      className={`mx-auto mb-1 flex h-8 w-8 items-center justify-center rounded-full sm:mb-2 sm:h-10 sm:w-10 ${colors.bg}`}
                    >
                      <Icon className={`h-4 w-4 sm:h-5 sm:w-5 ${colors.text}`} />
                    </div>
                    <p
                      className={`text-lg font-bold sm:text-2xl ${stage.count > 0 ? colors.text : 'text-gray-400'}`}
                    >
                      {stage.count}
                    </p>
                    <p className="text-xs text-gray-500">{stage.label}</p>
                  </Link>
                  {index < pipelineStages.length - 1 && (
                    <ArrowRight className="mx-1 h-3 w-3 flex-shrink-0 text-gray-300 sm:h-4 sm:w-4" />
                  )}
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Stats Grid */}
      <div className="mb-6 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.title}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">{stat.title}</p>
                  <p className="mt-1 text-2xl font-bold">{stat.value}</p>
                  <p className="mt-1 text-xs text-muted-foreground">{stat.description}</p>
                </div>
                <div className={`rounded-full p-3 ${stat.bgColor}`}>
                  <stat.icon className={`h-6 w-6 ${stat.color}`} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Orders Needing Action */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <AlertCircle className="h-5 w-5 text-yellow-500" />
                  Needs Action
                </CardTitle>
                <CardDescription>Orders waiting for your review</CardDescription>
              </div>
              <Link
                href="/admin/orders?status=pending"
                className="text-sm text-emerald-600 hover:text-emerald-700"
              >
                View all →
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            {urgentOrders.length === 0 ? (
              <div className="flex flex-col items-center py-8 text-center">
                <CheckCircle className="h-12 w-12 text-emerald-200" />
                <p className="mt-2 font-medium text-gray-900">All caught up!</p>
                <p className="text-sm text-gray-500">No orders need immediate attention</p>
              </div>
            ) : (
              <div className="space-y-3">
                {urgentOrders.map((order) => (
                  <Link
                    key={order.id}
                    href={`/admin/orders/${order.id}`}
                    className="flex items-center justify-between rounded-lg border p-3 transition-colors hover:bg-gray-50"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`flex h-8 w-8 items-center justify-center rounded-full ${order.status === 'pending' ? 'bg-yellow-100' : 'bg-blue-100'}`}
                      >
                        {order.status === 'pending' ? (
                          <Clock className="h-4 w-4 text-yellow-600" />
                        ) : (
                          <CheckCircle className="h-4 w-4 text-blue-600" />
                        )}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">
                          {order.order_number || `#${order.id.slice(0, 8)}`}
                        </p>
                        <p className="text-sm text-gray-500">{order.customer_name || 'Guest'}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold">${parseFloat(order.total).toFixed(2)}</p>
                      <p className="text-xs text-gray-500">
                        {new Date(order.created_at).toLocaleDateString()}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Quick Actions
            </CardTitle>
            <CardDescription>Common tasks and shortcuts</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-3">
              <Link
                href="/admin/orders"
                className="flex items-center justify-between rounded-lg border p-3 transition-colors hover:bg-gray-50"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100">
                    <ShoppingCart className="h-4 w-4 text-blue-600" />
                  </div>
                  <span className="font-medium">Manage Orders</span>
                </div>
                <span className="rounded-full bg-gray-100 px-2 py-0.5 text-sm font-medium text-gray-700">
                  {totalOrders}
                </span>
              </Link>
              <Link
                href="/admin/products/new"
                className="flex items-center justify-between rounded-lg border p-3 transition-colors hover:bg-gray-50"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-purple-100">
                    <Package className="h-4 w-4 text-purple-600" />
                  </div>
                  <span className="font-medium">Add New Product</span>
                </div>
                <ArrowRight className="h-4 w-4 text-gray-400" />
              </Link>
              <Link
                href="/admin/templates"
                className="flex items-center justify-between rounded-lg border p-3 transition-colors hover:bg-gray-50"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-100">
                    <Eye className="h-4 w-4 text-emerald-600" />
                  </div>
                  <span className="font-medium">Manage Templates</span>
                </div>
                <ArrowRight className="h-4 w-4 text-gray-400" />
              </Link>
              <Link
                href="/admin/shipping/rates"
                className="flex items-center justify-between rounded-lg border p-3 transition-colors hover:bg-gray-50"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-orange-100">
                    <Truck className="h-4 w-4 text-orange-600" />
                  </div>
                  <span className="font-medium">Shipping Settings</span>
                </div>
                <ArrowRight className="h-4 w-4 text-gray-400" />
              </Link>
              <a
                href="/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between rounded-lg border p-3 transition-colors hover:bg-gray-50"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-100">
                    <Eye className="h-4 w-4 text-gray-600" />
                  </div>
                  <span className="font-medium">View Storefront</span>
                </div>
                <span className="text-xs text-gray-400">Opens in new tab</span>
              </a>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
