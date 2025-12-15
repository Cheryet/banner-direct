import { createClient } from '@/lib/supabase/server';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  BarChart3,
  TrendingUp,
  TrendingDown,
  DollarSign,
  ShoppingCart,
  Users,
  Package,
  Calendar,
  ArrowUpRight,
  ArrowDownRight,
} from 'lucide-react';

export const metadata = {
  title: 'Analytics - Admin',
  description: 'View store analytics and insights',
};

function formatCurrency(amount) {
  return new Intl.NumberFormat('en-CA', {
    style: 'currency',
    currency: 'CAD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

function formatPercent(value) {
  const sign = value >= 0 ? '+' : '';
  return `${sign}${value.toFixed(1)}%`;
}

// Force dynamic rendering - this page requires database access
export const dynamic = 'force-dynamic';

export default async function AdminAnalyticsPage() {
  const supabase = await createClient();

  // Get date ranges
  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
  const endOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0);
  const startOfYear = new Date(now.getFullYear(), 0, 1);

  // Fetch all orders
  const { data: allOrders } = await supabase
    .from('orders')
    .select('id, total, status, created_at')
    .order('created_at', { ascending: true });

  // Fetch customers
  const { data: allCustomers } = await supabase
    .from('profiles')
    .select('id, created_at')
    .eq('is_anonymous', false);

  // Calculate metrics
  const orders = allOrders || [];
  const customers = allCustomers || [];

  // This month's orders
  const thisMonthOrders = orders.filter((o) => new Date(o.created_at) >= startOfMonth);
  const thisMonthRevenue = thisMonthOrders.reduce((sum, o) => sum + (parseFloat(o.total) || 0), 0);

  // Last month's orders
  const lastMonthOrders = orders.filter((o) => {
    const date = new Date(o.created_at);
    return date >= startOfLastMonth && date <= endOfLastMonth;
  });
  const lastMonthRevenue = lastMonthOrders.reduce((sum, o) => sum + (parseFloat(o.total) || 0), 0);

  // Year to date
  const ytdOrders = orders.filter((o) => new Date(o.created_at) >= startOfYear);
  const ytdRevenue = ytdOrders.reduce((sum, o) => sum + (parseFloat(o.total) || 0), 0);

  // All time
  const totalRevenue = orders.reduce((sum, o) => sum + (parseFloat(o.total) || 0), 0);
  const totalOrders = orders.length;
  const avgOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;

  // Growth calculations
  const revenueGrowth =
    lastMonthRevenue > 0 ? ((thisMonthRevenue - lastMonthRevenue) / lastMonthRevenue) * 100 : 0;
  const orderGrowth =
    lastMonthOrders.length > 0
      ? ((thisMonthOrders.length - lastMonthOrders.length) / lastMonthOrders.length) * 100
      : 0;

  // New customers this month
  const newCustomersThisMonth = customers.filter(
    (c) => new Date(c.created_at) >= startOfMonth
  ).length;
  const newCustomersLastMonth = customers.filter((c) => {
    const date = new Date(c.created_at);
    return date >= startOfLastMonth && date <= endOfLastMonth;
  }).length;
  const customerGrowth =
    newCustomersLastMonth > 0
      ? ((newCustomersThisMonth - newCustomersLastMonth) / newCustomersLastMonth) * 100
      : 0;

  // Orders by status
  const ordersByStatus = {
    pending: orders.filter((o) => o.status === 'pending').length,
    processing: orders.filter((o) =>
      ['confirmed', 'processing', 'printing', 'quality_check'].includes(o.status)
    ).length,
    shipped: orders.filter((o) => o.status === 'shipped').length,
    delivered: orders.filter((o) => o.status === 'delivered').length,
    cancelled: orders.filter((o) => o.status === 'cancelled').length,
  };

  // Monthly revenue for chart (last 6 months)
  const monthlyData = [];
  for (let i = 5; i >= 0; i--) {
    const monthStart = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const monthEnd = new Date(now.getFullYear(), now.getMonth() - i + 1, 0);
    const monthOrders = orders.filter((o) => {
      const date = new Date(o.created_at);
      return date >= monthStart && date <= monthEnd;
    });
    const monthRevenue = monthOrders.reduce((sum, o) => sum + (parseFloat(o.total) || 0), 0);
    monthlyData.push({
      month: monthStart.toLocaleDateString('en-CA', { month: 'short' }),
      revenue: monthRevenue,
      orders: monthOrders.length,
    });
  }

  const maxRevenue = Math.max(...monthlyData.map((d) => d.revenue), 1);

  return (
    <div className="min-w-0">
      <div className="mb-6">
        <h1 className="text-xl font-bold text-gray-900 sm:text-2xl">Analytics</h1>
        <p className="text-sm text-muted-foreground">Track your store's performance and growth</p>
      </div>

      {/* Key Metrics */}
      <div className="mb-8 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Revenue (This Month)</p>
                <p className="mt-1 text-3xl font-bold">{formatCurrency(thisMonthRevenue)}</p>
                <div
                  className={`mt-2 flex items-center gap-1 text-sm ${revenueGrowth >= 0 ? 'text-emerald-600' : 'text-red-600'}`}
                >
                  {revenueGrowth >= 0 ? (
                    <ArrowUpRight className="h-4 w-4" />
                  ) : (
                    <ArrowDownRight className="h-4 w-4" />
                  )}
                  <span>{formatPercent(revenueGrowth)} vs last month</span>
                </div>
              </div>
              <div className="rounded-full bg-emerald-100 p-3">
                <DollarSign className="h-6 w-6 text-emerald-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Orders (This Month)</p>
                <p className="mt-1 text-3xl font-bold">{thisMonthOrders.length}</p>
                <div
                  className={`mt-2 flex items-center gap-1 text-sm ${orderGrowth >= 0 ? 'text-emerald-600' : 'text-red-600'}`}
                >
                  {orderGrowth >= 0 ? (
                    <ArrowUpRight className="h-4 w-4" />
                  ) : (
                    <ArrowDownRight className="h-4 w-4" />
                  )}
                  <span>{formatPercent(orderGrowth)} vs last month</span>
                </div>
              </div>
              <div className="rounded-full bg-blue-100 p-3">
                <ShoppingCart className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">New Customers</p>
                <p className="mt-1 text-3xl font-bold">{newCustomersThisMonth}</p>
                <div
                  className={`mt-2 flex items-center gap-1 text-sm ${customerGrowth >= 0 ? 'text-emerald-600' : 'text-red-600'}`}
                >
                  {customerGrowth >= 0 ? (
                    <ArrowUpRight className="h-4 w-4" />
                  ) : (
                    <ArrowDownRight className="h-4 w-4" />
                  )}
                  <span>{formatPercent(customerGrowth)} vs last month</span>
                </div>
              </div>
              <div className="rounded-full bg-purple-100 p-3">
                <Users className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Avg. Order Value</p>
                <p className="mt-1 text-3xl font-bold">{formatCurrency(avgOrderValue)}</p>
                <p className="mt-2 text-sm text-muted-foreground">All time average</p>
              </div>
              <div className="rounded-full bg-orange-100 p-3">
                <TrendingUp className="h-6 w-6 text-orange-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Revenue Chart */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Revenue Overview
            </CardTitle>
            <CardDescription>Monthly revenue for the last 6 months</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {monthlyData.map((data, index) => (
                <div key={index} className="flex items-center gap-4">
                  <div className="w-12 text-sm font-medium text-gray-600">{data.month}</div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <div
                        className="h-8 rounded-lg bg-emerald-100 relative overflow-hidden"
                        style={{ width: '100%' }}
                      >
                        <div
                          className="h-full bg-emerald-500 rounded-lg transition-all duration-500"
                          style={{ width: `${(data.revenue / maxRevenue) * 100}%` }}
                        />
                      </div>
                    </div>
                  </div>
                  <div className="w-24 text-right">
                    <p className="font-semibold text-gray-900">{formatCurrency(data.revenue)}</p>
                    <p className="text-xs text-gray-500">{data.orders} orders</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Order Status Breakdown */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Package className="h-5 w-5" />
              Order Status
            </CardTitle>
            <CardDescription>Current order distribution</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded-full bg-yellow-500" />
                  <span className="text-sm text-gray-600">Pending</span>
                </div>
                <span className="font-semibold">{ordersByStatus.pending}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded-full bg-blue-500" />
                  <span className="text-sm text-gray-600">Processing</span>
                </div>
                <span className="font-semibold">{ordersByStatus.processing}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded-full bg-purple-500" />
                  <span className="text-sm text-gray-600">Shipped</span>
                </div>
                <span className="font-semibold">{ordersByStatus.shipped}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded-full bg-emerald-500" />
                  <span className="text-sm text-gray-600">Delivered</span>
                </div>
                <span className="font-semibold">{ordersByStatus.delivered}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded-full bg-gray-400" />
                  <span className="text-sm text-gray-600">Cancelled</span>
                </div>
                <span className="font-semibold">{ordersByStatus.cancelled}</span>
              </div>
            </div>

            {/* Visual breakdown */}
            <div className="mt-6">
              <div className="flex h-4 overflow-hidden rounded-full bg-gray-100">
                {totalOrders > 0 && (
                  <>
                    <div
                      className="bg-yellow-500"
                      style={{ width: `${(ordersByStatus.pending / totalOrders) * 100}%` }}
                    />
                    <div
                      className="bg-blue-500"
                      style={{ width: `${(ordersByStatus.processing / totalOrders) * 100}%` }}
                    />
                    <div
                      className="bg-purple-500"
                      style={{ width: `${(ordersByStatus.shipped / totalOrders) * 100}%` }}
                    />
                    <div
                      className="bg-emerald-500"
                      style={{ width: `${(ordersByStatus.delivered / totalOrders) * 100}%` }}
                    />
                    <div
                      className="bg-gray-400"
                      style={{ width: `${(ordersByStatus.cancelled / totalOrders) * 100}%` }}
                    />
                  </>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Summary Stats */}
      <div className="mt-6 grid gap-4 md:grid-cols-3">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="rounded-full bg-gray-100 p-3">
                <Calendar className="h-6 w-6 text-gray-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Year to Date Revenue</p>
                <p className="text-2xl font-bold">{formatCurrency(ytdRevenue)}</p>
                <p className="text-sm text-gray-500">{ytdOrders.length} orders</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="rounded-full bg-gray-100 p-3">
                <DollarSign className="h-6 w-6 text-gray-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">All Time Revenue</p>
                <p className="text-2xl font-bold">{formatCurrency(totalRevenue)}</p>
                <p className="text-sm text-gray-500">{totalOrders} total orders</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="rounded-full bg-gray-100 p-3">
                <Users className="h-6 w-6 text-gray-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Customers</p>
                <p className="text-2xl font-bold">{customers.length}</p>
                <p className="text-sm text-gray-500">Registered accounts</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
