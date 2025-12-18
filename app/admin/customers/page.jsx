import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { LinkButton } from '@/components/ui/link-button';
import Link from 'next/link';
import {
  Users,
  Search,
  Mail,
  Phone,
  ShoppingCart,
  DollarSign,
  Calendar,
  Eye,
  UserPlus,
  TrendingUp,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { getCustomers, getCustomerStats } from '@/lib/db/customers';
import { getOrderStats } from '@/lib/db/orders';
import { createClient } from '@/lib/supabase/server';
import { formatCurrency, formatDate } from '@/lib/format';

export const metadata = {
  title: 'Customers - Admin',
  description: 'Manage customer accounts',
};

export default async function AdminCustomersPage({ searchParams }) {
  const params = await searchParams;

  const page = parseInt(params?.page || '1');
  const perPage = 20;
  const offset = (page - 1) * perPage;
  const search = params?.search || '';

  // Fetch customers and stats using modular utilities
  const [customersResult, customerStats, orderStats] = await Promise.all([
    getCustomers({
      limit: perPage,
      offset,
      search: search || null,
      sortBy: 'created_at',
      sortOrder: 'desc',
    }),
    getCustomerStats(),
    getOrderStats(),
  ]);

  const { customers, count } = customersResult;

  // Fetch order stats for each customer
  const supabase = await createClient();
  const customerIds = customers?.map((c) => c.id) || [];
  let customerOrderStats = {};

  if (customerIds.length > 0) {
    const { data: orders } = await supabase
      .from('orders')
      .select('user_id, total')
      .in('user_id', customerIds);

    if (orders) {
      orders.forEach((order) => {
        if (!customerOrderStats[order.user_id]) {
          customerOrderStats[order.user_id] = { count: 0, total: 0 };
        }
        customerOrderStats[order.user_id].count++;
        customerOrderStats[order.user_id].total += parseFloat(order.total) || 0;
      });
    }
  }

  const totalCustomers = customerStats?.total || 0;
  const newThisMonth = customerStats?.newThisMonth || 0;
  const totalRevenue = orderStats?.totalRevenue || 0;
  const avgOrderValue = orderStats?.total > 0 ? totalRevenue / orderStats.total : 0;

  const totalPages = Math.ceil((count || 0) / perPage);

  return (
    <div className="min-w-0">
      <div className="mb-6">
        <h1 className="text-xl font-bold text-gray-900 sm:text-2xl">Customers</h1>
        <p className="text-sm text-muted-foreground">View and manage customer accounts</p>
      </div>

      {/* Stats Cards - Horizontal scroll on mobile */}
      <div className="mb-6 overflow-x-auto">
        <div
          className="grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4"
          style={{ minWidth: '320px' }}
        >
          <Card>
            <CardContent className="p-3 sm:p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-muted-foreground sm:text-sm">Customers</p>
                  <p className="text-xl font-bold sm:text-2xl">{totalCustomers || 0}</p>
                </div>
                <Users className="h-6 w-6 text-blue-400 sm:h-8 sm:w-8" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-3 sm:p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-muted-foreground sm:text-sm">New</p>
                  <p className="text-xl font-bold text-emerald-600 sm:text-2xl">
                    {newThisMonth || 0}
                  </p>
                </div>
                <UserPlus className="h-6 w-6 text-emerald-400 sm:h-8 sm:w-8" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-3 sm:p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-muted-foreground sm:text-sm">Revenue</p>
                  <p className="text-lg font-bold sm:text-2xl">{formatCurrency(totalRevenue)}</p>
                </div>
                <DollarSign className="h-6 w-6 text-emerald-400 sm:h-8 sm:w-8" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-3 sm:p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-muted-foreground sm:text-sm">Avg. Order</p>
                  <p className="text-lg font-bold sm:text-2xl">{formatCurrency(avgOrderValue)}</p>
                </div>
                <TrendingUp className="h-6 w-6 text-purple-400 sm:h-8 sm:w-8" />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Search */}
      <Card className="mb-6">
        <CardContent className="p-3 sm:p-4">
          <form className="flex flex-col gap-3 sm:flex-row sm:gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                name="search"
                defaultValue={search}
                placeholder="Search by name or email..."
                className="w-full rounded-lg border border-gray-300 bg-white py-2 pl-10 pr-4 text-sm focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
              />
            </div>
            <div className="flex gap-2">
              <button
                type="submit"
                className="flex-1 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-700 sm:flex-none"
              >
                Search
              </button>
              {search && (
                <Link
                  href="/admin/customers"
                  className="rounded-lg border px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  Clear
                </Link>
              )}
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Customers Table */}
      <Card>
        <CardContent className="p-0">
          {!customers || customers.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center px-4">
              <Users className="h-12 w-12 text-gray-300" />
              <h3 className="mt-4 text-lg font-medium text-gray-900">No customers found</h3>
              <p className="mt-1 text-sm text-gray-500">
                {search
                  ? 'Try a different search term.'
                  : 'Customers will appear here when they create accounts.'}
              </p>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full" style={{ minWidth: '700px' }}>
                  <thead className="border-b bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                        Customer
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                        Contact
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                        Joined
                      </th>
                      <th className="px-6 py-3 text-center text-xs font-medium uppercase tracking-wider text-gray-500">
                        Orders
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500">
                        Total Spent
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 bg-white">
                    {customers.map((customer) => {
                      const stats = customerOrderStats[customer.id] || { count: 0, total: 0 };
                      return (
                        <tr key={customer.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-100 text-sm font-medium text-emerald-700">
                                {(customer.first_name || customer.email || 'U')
                                  .charAt(0)
                                  .toUpperCase()}
                              </div>
                              <div>
                                <p className="font-medium text-gray-900">
                                  {customer.first_name || customer.last_name
                                    ? `${customer.first_name || ''} ${customer.last_name || ''}`.trim()
                                    : 'No name'}
                                </p>
                                {customer.company && (
                                  <p className="text-sm text-gray-500">{customer.company}</p>
                                )}
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="space-y-1">
                              {customer.email && (
                                <a
                                  href={`mailto:${customer.email}`}
                                  className="flex items-center gap-1.5 text-sm text-gray-600 hover:text-emerald-600"
                                >
                                  <Mail className="h-3.5 w-3.5" />
                                  {customer.email}
                                </a>
                              )}
                              {customer.phone && (
                                <a
                                  href={`tel:${customer.phone}`}
                                  className="flex items-center gap-1.5 text-sm text-gray-600 hover:text-emerald-600"
                                >
                                  <Phone className="h-3.5 w-3.5" />
                                  {customer.phone}
                                </a>
                              )}
                            </div>
                          </td>
                          <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                            {formatDate(customer.created_at)}
                          </td>
                          <td className="whitespace-nowrap px-6 py-4 text-center">
                            <span className="inline-flex items-center gap-1 rounded-full bg-gray-100 px-2.5 py-1 text-sm font-medium text-gray-700">
                              <ShoppingCart className="h-3.5 w-3.5" />
                              {stats.count}
                            </span>
                          </td>
                          <td className="whitespace-nowrap px-6 py-4 text-right font-medium text-gray-900">
                            {formatCurrency(stats.total)}
                          </td>
                          <td className="whitespace-nowrap px-6 py-4 text-right">
                            <Link
                              href={`/admin/customers/${customer.id}`}
                              className="inline-flex items-center gap-1 rounded-lg px-3 py-1.5 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-100"
                            >
                              <Eye className="h-4 w-4" />
                              View
                            </Link>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-between border-t px-6 py-4">
                  <p className="text-sm text-gray-500">
                    Showing {offset + 1} to {Math.min(offset + perPage, count)} of {count} customers
                  </p>
                  <div className="flex gap-2">
                    <Link
                      href={`/admin/customers?page=${page - 1}${search ? `&search=${search}` : ''}`}
                      className={`inline-flex items-center gap-1 rounded-lg border px-3 py-1.5 text-sm font-medium ${
                        page === 1 ? 'pointer-events-none opacity-50' : 'hover:bg-gray-50'
                      }`}
                    >
                      <ChevronLeft className="h-4 w-4" />
                      Previous
                    </Link>
                    <Link
                      href={`/admin/customers?page=${page + 1}${search ? `&search=${search}` : ''}`}
                      className={`inline-flex items-center gap-1 rounded-lg border px-3 py-1.5 text-sm font-medium ${
                        page >= totalPages ? 'pointer-events-none opacity-50' : 'hover:bg-gray-50'
                      }`}
                    >
                      Next
                      <ChevronRight className="h-4 w-4" />
                    </Link>
                  </div>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
