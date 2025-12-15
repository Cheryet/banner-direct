'use client';

import * as React from 'react';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { LinkButton } from '@/components/ui/link-button';
import { Package, ShoppingBag, ArrowRight, Eye } from 'lucide-react';

export function OrdersSection({ orders }) {
  const getStatusBadge = (status) => {
    const styles = {
      pending: 'bg-yellow-100 text-yellow-700',
      confirmed: 'bg-blue-100 text-blue-700',
      processing: 'bg-blue-100 text-blue-700',
      printing: 'bg-purple-100 text-purple-700',
      quality_check: 'bg-indigo-100 text-indigo-700',
      shipped: 'bg-emerald-100 text-emerald-700',
      delivered: 'bg-emerald-100 text-emerald-700',
      cancelled: 'bg-gray-100 text-gray-700',
      refunded: 'bg-red-100 text-red-700',
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
        className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${styles[status] || styles.pending}`}
      >
        {labels[status] || status}
      </span>
    );
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-CA', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-CA', {
      style: 'currency',
      currency: 'CAD',
    }).format(amount);
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100">
              <Package className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <CardTitle className="text-xl">Order History</CardTitle>
              <CardDescription>Track and manage your orders</CardDescription>
            </div>
          </div>
          {orders.length > 0 && (
            <LinkButton href="/orders" variant="ghost" size="sm">
              View All
              <ArrowRight className="ml-1 h-4 w-4" />
            </LinkButton>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {orders.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-200 py-12 text-center">
            <ShoppingBag className="mb-3 h-12 w-12 text-gray-300" />
            <h3 className="text-lg font-medium text-gray-900">No orders yet</h3>
            <p className="mt-1 text-sm text-gray-500">
              Your order history will appear here after your first purchase.
            </p>
            <LinkButton href="/products" className="mt-4">
              Start Shopping
              <ArrowRight className="ml-2 h-4 w-4" />
            </LinkButton>
          </div>
        ) : (
          <>
            {/* Desktop Table */}
            <div className="hidden overflow-hidden rounded-lg border md:block">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Order</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Date</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">
                      Status
                    </th>
                    <th className="px-4 py-3 text-right text-sm font-medium text-gray-500">
                      Total
                    </th>
                    <th className="px-4 py-3 text-right text-sm font-medium text-gray-500">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {orders.map((order) => (
                    <tr key={order.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3">
                        <span className="font-medium text-gray-900">{order.order_number}</span>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600">
                        {formatDate(order.created_at)}
                      </td>
                      <td className="px-4 py-3">{getStatusBadge(order.status)}</td>
                      <td className="px-4 py-3 text-right font-medium text-gray-900">
                        {formatCurrency(order.total)}
                      </td>
                      <td className="px-4 py-3 text-right">
                        <Link
                          href={`/orders/${order.id}`}
                          className="inline-flex items-center gap-1 text-sm font-medium text-emerald-600 hover:text-emerald-700"
                        >
                          View
                          <Eye className="h-4 w-4" />
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Cards */}
            <div className="space-y-3 md:hidden">
              {orders.map((order) => (
                <Link
                  key={order.id}
                  href={`/orders/${order.id}`}
                  className="block rounded-lg border p-4 transition-colors hover:border-emerald-300 hover:bg-gray-50"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-gray-900">{order.order_number}</span>
                    {getStatusBadge(order.status)}
                  </div>
                  <div className="mt-2 flex items-center justify-between text-sm">
                    <span className="text-gray-500">{formatDate(order.created_at)}</span>
                    <span className="font-medium text-gray-900">{formatCurrency(order.total)}</span>
                  </div>
                </Link>
              ))}
            </div>

            {orders.length >= 10 && (
              <div className="mt-4 text-center">
                <LinkButton href="/orders" variant="ghost" size="sm">
                  View All Orders
                  <ArrowRight className="ml-1 h-4 w-4" />
                </LinkButton>
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
}
