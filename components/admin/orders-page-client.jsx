'use client';

import * as React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  ShoppingCart,
  Search,
  Eye,
  Download,
  LayoutGrid,
  AlertCircle,
  X,
  CheckCircle,
  RefreshCw,
  Truck,
} from 'lucide-react';
import { ORDER_STATUSES, STATUS_COLORS } from '@/lib/constants/orders';
import { formatCurrency, formatRelativeTime } from '@/lib/format';

function formatDate(dateString) {
  return formatRelativeTime(dateString);
}

function StatusBadge({ status }) {
  const colors = STATUS_COLORS[status] || STATUS_COLORS.pending;
  const statusInfo = ORDER_STATUSES.find((s) => s.id === status) || ORDER_STATUSES[0];
  const Icon = statusInfo.icon;
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ${colors.bg} ${colors.text}`}
    >
      <Icon className="h-3 w-3" />
      {statusInfo.label}
    </span>
  );
}

function OrderCard({ order, selected, onSelect, onQuickAction }) {
  const colors = STATUS_COLORS[order.status] || STATUS_COLORS.pending;
  const itemCount = order.order_items?.reduce((sum, item) => sum + item.quantity, 0) || 0;

  return (
    <div
      className={`group relative rounded-lg border bg-white p-4 transition-all hover:shadow-md ${selected ? 'ring-2 ring-emerald-500' : ''}`}
    >
      <div className={`absolute left-0 top-0 bottom-0 w-1 rounded-l-lg ${colors.accent}`} />

      <div className="flex items-start justify-between">
        <div className="flex items-start gap-3">
          <input
            type="checkbox"
            checked={selected}
            onChange={() => onSelect(order.id)}
            className="mt-1 h-4 w-4 rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
          />
          <div>
            <Link
              href={`/admin/orders/${order.id}`}
              className="font-semibold text-gray-900 hover:text-emerald-600"
            >
              {order.order_number || `#${order.id.slice(0, 8)}`}
            </Link>
            <p className="text-sm text-gray-500">{formatDate(order.created_at)}</p>
          </div>
        </div>
        <StatusBadge status={order.status} />
      </div>

      <div className="mt-3 flex items-center justify-between">
        <div>
          <p className="font-medium text-gray-900">
            {order.customer_name ||
              (order.profiles?.first_name || order.profiles?.last_name
                ? `${order.profiles?.first_name || ''} ${order.profiles?.last_name || ''}`.trim()
                : 'Guest')}
          </p>
          <p className="text-sm text-gray-500">
            {itemCount} item{itemCount !== 1 ? 's' : ''}
          </p>
        </div>
        <p className="text-lg font-bold text-gray-900">{formatCurrency(order.total)}</p>
      </div>

      <div className="mt-3 flex gap-2 opacity-0 transition-opacity group-hover:opacity-100">
        <Link
          href={`/admin/orders/${order.id}`}
          className="flex-1 rounded-lg border px-3 py-1.5 text-center text-xs font-medium text-gray-700 hover:bg-gray-50"
        >
          View Details
        </Link>
        <button
          onClick={() => onQuickAction(order)}
          className="rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-emerald-700"
        >
          Next Step
        </button>
      </div>
    </div>
  );
}

function KanbanColumn({ status, orders, selectedOrders, onSelect, onQuickAction, onDrop }) {
  const statusInfo = ORDER_STATUSES.find((s) => s.id === status.id);
  const colors = STATUS_COLORS[status.id] || STATUS_COLORS.pending;
  const columnOrders = orders.filter((o) => o.status === status.id);

  const handleDragOver = (e) => {
    e.preventDefault();
  };
  const handleDrop = (e) => {
    e.preventDefault();
    const orderId = e.dataTransfer.getData('orderId');
    if (orderId) onDrop(orderId, status.id);
  };

  return (
    <div
      className="flex w-80 flex-shrink-0 flex-col rounded-lg bg-gray-50"
      onDragOver={handleDragOver}
      onDrop={handleDrop}
    >
      <div className={`flex items-center justify-between rounded-t-lg border-b p-3 ${colors.bg}`}>
        <div className="flex items-center gap-2">
          <statusInfo.icon className={`h-4 w-4 ${colors.text}`} />
          <span className={`font-semibold ${colors.text}`}>{status.label}</span>
        </div>
        <span
          className={`rounded-full px-2 py-0.5 text-xs font-medium ${colors.bg} ${colors.text}`}
        >
          {columnOrders.length}
        </span>
      </div>
      <div
        className="flex-1 space-y-3 overflow-y-auto p-3"
        style={{ maxHeight: 'calc(100vh - 320px)' }}
      >
        {columnOrders.length === 0 ? (
          <p className="py-8 text-center text-sm text-gray-400">No orders</p>
        ) : (
          columnOrders.map((order) => (
            <div
              key={order.id}
              draggable
              onDragStart={(e) => e.dataTransfer.setData('orderId', order.id)}
              className="cursor-move"
            >
              <OrderCard
                order={order}
                selected={selectedOrders.includes(order.id)}
                onSelect={onSelect}
                onQuickAction={onQuickAction}
              />
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export function OrdersPageClient({ initialOrders }) {
  const router = useRouter();
  const [orders, setOrders] = React.useState(initialOrders);
  const [search, setSearch] = React.useState('');
  const [statusFilter, setStatusFilter] = React.useState('all');
  const [selectedOrders, setSelectedOrders] = React.useState([]);
  const [isUpdating, setIsUpdating] = React.useState(false);

  // Filter orders
  const filteredOrders = React.useMemo(() => {
    return orders.filter((order) => {
      const matchesSearch =
        !search ||
        order.order_number?.toLowerCase().includes(search.toLowerCase()) ||
        order.profiles?.first_name?.toLowerCase().includes(search.toLowerCase()) ||
        order.profiles?.last_name?.toLowerCase().includes(search.toLowerCase()) ||
        order.profiles?.email?.toLowerCase().includes(search.toLowerCase());
      const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [orders, search, statusFilter]);

  // Stats
  const stats = React.useMemo(
    () => ({
      total: orders.length,
      pending: orders.filter((o) => o.status === 'pending').length,
      processing: orders.filter((o) =>
        ['confirmed', 'processing', 'printing', 'quality_check'].includes(o.status)
      ).length,
      shipped: orders.filter((o) => o.status === 'shipped').length,
      delivered: orders.filter((o) => o.status === 'delivered').length,
      revenue: orders.reduce((sum, o) => sum + (parseFloat(o.total) || 0), 0),
      needsAction: orders.filter((o) => ['pending', 'confirmed'].includes(o.status)).length,
    }),
    [orders]
  );

  const handleSelectOrder = (orderId) => {
    setSelectedOrders((prev) =>
      prev.includes(orderId) ? prev.filter((id) => id !== orderId) : [...prev, orderId]
    );
  };

  const handleSelectAll = () => {
    if (selectedOrders.length === filteredOrders.length) {
      setSelectedOrders([]);
    } else {
      setSelectedOrders(filteredOrders.map((o) => o.id));
    }
  };

  const updateOrderStatus = async (orderId, newStatus) => {
    setIsUpdating(true);
    try {
      const response = await fetch('/api/admin/orders', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderId, status: newStatus }),
      });

      if (response.ok) {
        setOrders((prev) => prev.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o)));
      } else {
        const data = await response.json();
        console.error('Failed to update order:', data.error);
      }
    } catch (err) {
      console.error('Failed to update order:', err);
    }
    setIsUpdating(false);
  };

  const handleBulkStatusUpdate = async (newStatus) => {
    if (selectedOrders.length === 0) return;
    setIsUpdating(true);
    try {
      // Update each order individually via API
      const updatePromises = selectedOrders.map((orderId) =>
        fetch('/api/admin/orders', {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ orderId, status: newStatus }),
        })
      );

      await Promise.all(updatePromises);
      setOrders((prev) =>
        prev.map((o) => (selectedOrders.includes(o.id) ? { ...o, status: newStatus } : o))
      );
      setSelectedOrders([]);
    } catch (err) {
      console.error('Failed to bulk update:', err);
    }
    setIsUpdating(false);
  };

  const getNextStatus = (currentStatus) => {
    const flow = [
      'pending',
      'confirmed',
      'processing',
      'printing',
      'quality_check',
      'shipped',
      'delivered',
    ];
    const idx = flow.indexOf(currentStatus);
    return idx >= 0 && idx < flow.length - 1 ? flow[idx + 1] : null;
  };

  const handleQuickAction = (order) => {
    const nextStatus = getNextStatus(order.status);
    if (nextStatus) updateOrderStatus(order.id, nextStatus);
  };

  const handleDrop = (orderId, newStatus) => {
    updateOrderStatus(orderId, newStatus);
  };

  return (
    <div className="min-w-0">
      {/* Header */}
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-900 sm:text-2xl">Orders</h1>
          <p className="text-sm text-gray-500">Manage and fulfill customer orders</p>
        </div>
        <div className="flex items-center gap-2">
          <Link
            href="/admin/orders/board"
            className="inline-flex flex-1 items-center justify-center gap-2 rounded-lg border bg-white px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 sm:flex-none"
          >
            <LayoutGrid className="h-4 w-4" />
            <span className="hidden sm:inline">Fulfillment</span> Board
          </Link>
          <Button variant="outline" size="sm" className="hidden sm:flex">
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
        </div>
      </div>

      {/* Stats - Horizontal scroll on mobile */}
      <div className="mb-6 overflow-x-auto">
        <div
          className="grid grid-cols-3 gap-3 sm:grid-cols-6 sm:gap-4"
          style={{ minWidth: '500px' }}
        >
          <Card className="cursor-pointer hover:shadow-md" onClick={() => setStatusFilter('all')}>
            <CardContent className="p-3 sm:p-4">
              <p className="text-xs text-gray-500 sm:text-sm">Total</p>
              <p className="text-xl font-bold sm:text-2xl">{stats.total}</p>
            </CardContent>
          </Card>
          <Card
            className={`cursor-pointer hover:shadow-md ${stats.needsAction > 0 ? 'border-yellow-300 bg-yellow-50' : ''}`}
            onClick={() => setStatusFilter('pending')}
          >
            <CardContent className="p-3 sm:p-4">
              <p className="text-xs text-gray-500 sm:text-sm">Action</p>
              <p className="text-xl font-bold text-yellow-600 sm:text-2xl">{stats.needsAction}</p>
            </CardContent>
          </Card>
          <Card
            className="cursor-pointer hover:shadow-md"
            onClick={() => setStatusFilter('processing')}
          >
            <CardContent className="p-3 sm:p-4">
              <p className="text-xs text-gray-500 sm:text-sm">Production</p>
              <p className="text-xl font-bold text-blue-600 sm:text-2xl">{stats.processing}</p>
            </CardContent>
          </Card>
          <Card
            className="cursor-pointer hover:shadow-md"
            onClick={() => setStatusFilter('shipped')}
          >
            <CardContent className="p-3 sm:p-4">
              <p className="text-xs text-gray-500 sm:text-sm">Shipped</p>
              <p className="text-xl font-bold text-purple-600 sm:text-2xl">{stats.shipped}</p>
            </CardContent>
          </Card>
          <Card
            className="cursor-pointer hover:shadow-md"
            onClick={() => setStatusFilter('delivered')}
          >
            <CardContent className="p-3 sm:p-4">
              <p className="text-xs text-gray-500 sm:text-sm">Delivered</p>
              <p className="text-xl font-bold text-emerald-600 sm:text-2xl">{stats.delivered}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-3 sm:p-4">
              <p className="text-xs text-gray-500 sm:text-sm">Revenue</p>
              <p className="text-lg font-bold text-emerald-600 sm:text-2xl">
                {formatCurrency(stats.revenue)}
              </p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Search & Filters */}
      <div className="mb-6 space-y-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search orders, customers..."
            className="pl-10"
          />
        </div>
        <div className="flex gap-2 overflow-x-auto pb-1">
          {[{ value: 'all', label: 'All' }, ...ORDER_STATUSES.slice(0, 7)].map((status) => (
            <button
              key={status.value || status.id}
              onClick={() => setStatusFilter(status.value || status.id)}
              className={`flex-shrink-0 rounded-full px-3 py-1.5 text-sm font-medium transition-colors ${
                statusFilter === (status.value || status.id)
                  ? 'bg-emerald-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {status.label}
            </button>
          ))}
        </div>
      </div>

      {/* Bulk Actions */}
      {selectedOrders.length > 0 && (
        <div className="mb-4 flex flex-col gap-3 rounded-lg bg-emerald-50 p-3 sm:flex-row sm:items-center sm:gap-4 sm:p-4">
          <span className="font-medium text-emerald-700">{selectedOrders.length} selected</span>
          <div className="flex flex-wrap gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={() => handleBulkStatusUpdate('confirmed')}
              disabled={isUpdating}
            >
              <CheckCircle className="mr-1 h-4 w-4" />
              <span className="hidden sm:inline">Confirm</span>
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => handleBulkStatusUpdate('processing')}
              disabled={isUpdating}
            >
              <RefreshCw className="mr-1 h-4 w-4" />
              <span className="hidden sm:inline">Process</span>
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => handleBulkStatusUpdate('shipped')}
              disabled={isUpdating}
            >
              <Truck className="mr-1 h-4 w-4" />
              <span className="hidden sm:inline">Ship</span>
            </Button>
            <Button size="sm" variant="ghost" onClick={() => setSelectedOrders([])}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}

      {/* Orders Table */}
      <Card>
        <CardContent className="p-0">
          {filteredOrders.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <ShoppingCart className="h-12 w-12 text-gray-300" />
              <h3 className="mt-4 text-lg font-medium text-gray-900">No orders found</h3>
              <p className="mt-1 text-sm text-gray-500">
                {search
                  ? 'Try a different search term.'
                  : 'Orders will appear here when customers make purchases.'}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="border-b bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left">
                      <input
                        type="checkbox"
                        checked={
                          selectedOrders.length === filteredOrders.length &&
                          filteredOrders.length > 0
                        }
                        onChange={handleSelectAll}
                        className="h-4 w-4 rounded border-gray-300 text-emerald-600"
                      />
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium uppercase text-gray-500">
                      Order
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium uppercase text-gray-500">
                      Customer
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium uppercase text-gray-500">
                      Items
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium uppercase text-gray-500">
                      Date
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium uppercase text-gray-500">
                      Status
                    </th>
                    <th className="px-4 py-3 text-right text-xs font-medium uppercase text-gray-500">
                      Total
                    </th>
                    <th className="px-4 py-3 text-right text-xs font-medium uppercase text-gray-500">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y bg-white">
                  {filteredOrders.map((order) => {
                    const itemCount =
                      order.order_items?.reduce((sum, item) => sum + item.quantity, 0) || 0;
                    return (
                      <tr
                        key={order.id}
                        className={`hover:bg-gray-50 ${selectedOrders.includes(order.id) ? 'bg-emerald-50' : ''}`}
                      >
                        <td className="px-4 py-3">
                          <input
                            type="checkbox"
                            checked={selectedOrders.includes(order.id)}
                            onChange={() => handleSelectOrder(order.id)}
                            className="h-4 w-4 rounded border-gray-300 text-emerald-600"
                          />
                        </td>
                        <td className="px-4 py-3">
                          <Link
                            href={`/admin/orders/${order.id}`}
                            className="font-medium text-emerald-600 hover:text-emerald-700"
                          >
                            {order.order_number || `#${order.id.slice(0, 8)}`}
                          </Link>
                        </td>
                        <td className="px-4 py-3">
                          <p className="font-medium text-gray-900">
                            {order.customer_name ||
                              (order.profiles?.first_name || order.profiles?.last_name
                                ? `${order.profiles?.first_name || ''} ${order.profiles?.last_name || ''}`.trim()
                                : 'Guest')}
                          </p>
                          <p className="text-sm text-gray-500">
                            {order.customer_email || order.profiles?.email || '—'}
                          </p>
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-500">
                          {itemCount} item{itemCount !== 1 ? 's' : ''}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-500">
                          {formatDate(order.created_at)}
                        </td>
                        <td className="px-4 py-3">
                          <select
                            value={order.status}
                            onChange={(e) => updateOrderStatus(order.id, e.target.value)}
                            disabled={isUpdating}
                            className={`rounded-full px-3 py-1.5 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-offset-1 disabled:opacity-50 cursor-pointer ${STATUS_COLORS[order.status]?.bg || 'bg-gray-100'} ${STATUS_COLORS[order.status]?.text || 'text-gray-700'} ${STATUS_COLORS[order.status]?.border || 'border-gray-300'} border`}
                          >
                            {ORDER_STATUSES.map((status) => (
                              <option key={status.id} value={status.id}>
                                {status.label}
                              </option>
                            ))}
                          </select>
                        </td>
                        <td className="px-4 py-3 text-right font-medium">
                          {formatCurrency(order.total)}
                        </td>
                        <td className="px-4 py-3 text-right">
                          <Link
                            href={`/admin/orders/${order.id}`}
                            className="inline-flex items-center justify-center gap-1.5 rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-xs font-medium text-gray-700 shadow-sm transition-colors hover:bg-gray-50 hover:border-gray-400"
                          >
                            <Eye className="h-3.5 w-3.5" />
                            <span>View</span>
                          </Link>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
