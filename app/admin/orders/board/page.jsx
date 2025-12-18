'use client';

import * as React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { LinkButton } from '@/components/ui/link-button';
import { Input } from '@/components/ui/input';
import {
  Clock,
  CheckCircle,
  Truck,
  Package,
  RefreshCw,
  Printer,
  ClipboardCheck,
  Search,
  Loader2,
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  AlertCircle,
} from 'lucide-react';
import { formatCurrency, formatRelativeTime } from '@/lib/format';
import { ORDER_PIPELINE, STATUS_COLORS } from '@/lib/constants/orders';

// Board uses a subset of pipeline stages
const PIPELINE_STAGES = ORDER_PIPELINE.filter((s) =>
  ['pending', 'confirmed', 'processing', 'printing', 'quality_check', 'shipped'].includes(s.id)
);

// Board-specific color mappings (extends STATUS_COLORS with header variants)
const COLORS = {
  yellow: {
    bg: 'bg-yellow-50',
    header: 'bg-yellow-100',
    text: 'text-yellow-700',
    border: 'border-yellow-200',
    badge: 'bg-yellow-500',
  },
  blue: {
    bg: 'bg-blue-50',
    header: 'bg-blue-100',
    text: 'text-blue-700',
    border: 'border-blue-200',
    badge: 'bg-blue-500',
  },
  purple: {
    bg: 'bg-purple-50',
    header: 'bg-purple-100',
    text: 'text-purple-700',
    border: 'border-purple-200',
    badge: 'bg-purple-500',
  },
  indigo: {
    bg: 'bg-indigo-50',
    header: 'bg-indigo-100',
    text: 'text-indigo-700',
    border: 'border-indigo-200',
    badge: 'bg-indigo-500',
  },
  emerald: {
    bg: 'bg-emerald-50',
    header: 'bg-emerald-100',
    text: 'text-emerald-700',
    border: 'border-emerald-200',
    badge: 'bg-emerald-500',
  },
};

function OrderCard({ order, onDragStart }) {
  const itemCount = order.order_items?.reduce((sum, item) => sum + item.quantity, 0) || 0;

  return (
    <div
      draggable
      onDragStart={(e) => {
        e.dataTransfer.setData('orderId', order.id);
        onDragStart?.(order.id);
      }}
      className="group cursor-grab rounded-lg border border-gray-200 bg-white p-3 shadow-sm transition-all hover:shadow-md active:cursor-grabbing active:shadow-lg"
    >
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0 flex-1">
          <Link
            href={`/admin/orders/${order.id}`}
            className="font-semibold text-gray-900 hover:text-emerald-600 text-sm"
          >
            {order.order_number || `#${order.id.slice(0, 8)}`}
          </Link>
          <p className="truncate text-xs text-gray-500">
            {order.customer_name ||
              (order.profiles?.first_name || order.profiles?.last_name
                ? `${order.profiles?.first_name || ''} ${order.profiles?.last_name || ''}`.trim()
                : 'Guest')}
          </p>
        </div>
        <span className="text-xs text-gray-400">{formatRelativeTime(order.created_at)}</span>
      </div>

      <div className="mt-2 flex items-center justify-between">
        <span className="text-xs text-gray-500">
          {itemCount} item{itemCount !== 1 ? 's' : ''}
        </span>
        <span className="font-semibold text-sm text-gray-900">{formatCurrency(order.total)}</span>
      </div>

      <div className="mt-2 flex gap-1 opacity-0 transition-opacity group-hover:opacity-100">
        <Link
          href={`/admin/orders/${order.id}`}
          className="flex-1 rounded bg-gray-100 px-2 py-1 text-center text-xs font-medium text-gray-700 hover:bg-gray-200"
        >
          View
        </Link>
      </div>
    </div>
  );
}

function KanbanColumn({ stage, orders, onDrop, isUpdating }) {
  const [isDragOver, setIsDragOver] = React.useState(false);
  const colors = COLORS[stage.color];
  const Icon = stage.icon;
  const columnOrders = orders.filter((o) => o.status === stage.id);

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = () => setIsDragOver(false);

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);
    const orderId = e.dataTransfer.getData('orderId');
    if (orderId) onDrop(orderId, stage.id);
  };

  return (
    <div
      className={`flex w-52 flex-shrink-0 flex-col rounded-lg border bg-white ${isDragOver ? colors.border : 'border-gray-200'} transition-colors`}
      style={{ height: '400px' }}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      {/* Column Header */}
      <div
        className={`flex flex-shrink-0 items-center justify-between rounded-t-lg px-3 py-2 ${colors.header}`}
      >
        <div className="flex items-center gap-2">
          <Icon className={`h-4 w-4 ${colors.text}`} />
          <span className={`text-sm font-semibold ${colors.text}`}>{stage.label}</span>
        </div>
        <span
          className={`flex h-5 w-5 items-center justify-center rounded-full text-xs font-bold text-white ${colors.badge}`}
        >
          {columnOrders.length}
        </span>
      </div>

      {/* Column Body - Scrollable vertically */}
      <div className="flex-1 space-y-2 overflow-y-auto p-2">
        {columnOrders.length === 0 ? (
          <div
            className={`flex h-16 items-center justify-center rounded-lg border-2 border-dashed ${isDragOver ? colors.border : 'border-gray-200'}`}
          >
            <p className="text-xs text-gray-400">Drop here</p>
          </div>
        ) : (
          columnOrders.map((order) => <OrderCard key={order.id} order={order} />)
        )}
      </div>
    </div>
  );
}

export default function FulfillmentBoardPage() {
  const [orders, setOrders] = React.useState([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [isUpdating, setIsUpdating] = React.useState(false);
  const [search, setSearch] = React.useState('');
  const [error, setError] = React.useState(null);
  const scrollRef = React.useRef(null);
  const boardRef = React.useRef(null);

  // Fetch orders - exclude cancelled and refunded from fulfillment workflow
  React.useEffect(() => {
    async function fetchOrders() {
      try {
        const response = await fetch('/api/admin/orders?exclude=cancelled,refunded');
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || 'Failed to load orders');
        }

        setOrders(data.orders || []);
      } catch (err) {
        console.error('Fulfillment board fetch error:', err);
        setError('Failed to load orders');
      }
      setIsLoading(false);
    }
    fetchOrders();
  }, []);

  // Filter orders by search
  const filteredOrders = React.useMemo(() => {
    if (!search) return orders;
    const term = search.toLowerCase();
    return orders.filter(
      (o) =>
        o.order_number?.toLowerCase().includes(term) ||
        o.profiles?.first_name?.toLowerCase().includes(term) ||
        o.profiles?.last_name?.toLowerCase().includes(term) ||
        o.profiles?.email?.toLowerCase().includes(term)
    );
  }, [orders, search]);

  // Handle drag and drop
  const handleDrop = async (orderId, newStatus) => {
    const order = orders.find((o) => o.id === orderId);
    if (!order || order.status === newStatus) return;

    setIsUpdating(true);

    // Optimistic update
    setOrders((prev) => prev.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o)));

    try {
      const response = await fetch('/api/admin/orders', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderId, status: newStatus }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to update order');
      }
    } catch (err) {
      // Revert on error
      setOrders((prev) => prev.map((o) => (o.id === orderId ? { ...o, status: order.status } : o)));
      setError('Failed to update order');
      setTimeout(() => setError(null), 3000);
    }

    setIsUpdating(false);
  };

  // Scroll helpers
  const scrollLeft = () => scrollRef.current?.scrollBy({ left: -240, behavior: 'smooth' });
  const scrollRight = () => scrollRef.current?.scrollBy({ left: 240, behavior: 'smooth' });

  // Stats
  const stats = PIPELINE_STAGES.reduce((acc, stage) => {
    acc[stage.id] = filteredOrders.filter((o) => o.status === stage.id).length;
    return acc;
  }, {});

  if (isLoading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-emerald-600" />
      </div>
    );
  }

  return (
    <div className="min-w-0">
      {/* Header */}
      <div className="mb-4 space-y-3">
        <div className="flex items-center gap-3">
          <Link href="/admin/orders" className="text-gray-400 hover:text-gray-600">
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <div>
            <h1 className="text-xl font-bold text-gray-900">Fulfillment Board</h1>
            <p className="text-sm text-gray-500">Drag orders between columns</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search orders..."
              className="w-full pl-9 text-sm"
            />
          </div>
          <LinkButton href="/admin/orders" variant="outline" size="sm">
            List View
          </LinkButton>
        </div>
      </div>

      {/* Error Alert */}
      {error && (
        <div className="mb-4 flex items-center gap-2 rounded-lg bg-red-50 p-3 text-sm text-red-700">
          <AlertCircle className="h-4 w-4" />
          {error}
        </div>
      )}

      {/* Scroll Controls */}
      <div className="mb-2 flex items-center justify-between">
        <div className="flex items-center gap-2 text-xs text-gray-500">
          {isUpdating && (
            <>
              <Loader2 className="h-3 w-3 animate-spin" /> Updating...
            </>
          )}
        </div>
        <div className="flex gap-1">
          <button
            onClick={scrollLeft}
            className="rounded-lg border bg-white p-1.5 hover:bg-gray-50"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <button
            onClick={scrollRight}
            className="rounded-lg border bg-white p-1.5 hover:bg-gray-50"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Kanban Board - Only this scrolls horizontally */}
      <div
        ref={scrollRef}
        className="overflow-x-auto rounded-lg border bg-gray-100 p-3"
        style={{ maxWidth: '100%' }}
      >
        <div className="inline-flex gap-3" style={{ minWidth: 'max-content' }}>
          {PIPELINE_STAGES.map((stage) => (
            <KanbanColumn
              key={stage.id}
              stage={stage}
              orders={filteredOrders}
              onDrop={handleDrop}
              isUpdating={isUpdating}
            />
          ))}
        </div>
      </div>

      {/* Summary Footer */}
      <div className="mt-3 flex items-center justify-between rounded-lg border bg-white p-3">
        <div className="flex gap-4 text-sm">
          <span className="text-gray-500">
            <strong className="text-yellow-600">{stats.pending + stats.confirmed}</strong> need
            action
          </span>
          <span className="text-gray-500">
            <strong className="text-blue-600">
              {stats.processing + stats.printing + stats.quality_check}
            </strong>{' '}
            in production
          </span>
          <span className="text-gray-500">
            <strong className="text-emerald-600">{stats.shipped}</strong> shipped
          </span>
        </div>
        <span className="text-sm text-gray-500">{filteredOrders.length} total orders</span>
      </div>
    </div>
  );
}
