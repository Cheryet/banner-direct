'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import {
  ArrowLeft,
  ArrowRight,
  Package,
  User,
  MapPin,
  CreditCard,
  Truck,
  Clock,
  CheckCircle,
  Printer,
  Search,
  PackageCheck,
  XCircle,
  Save,
  Loader2,
  Mail,
  Phone,
  FileText,
  RefreshCw,
  Send,
  MessageSquare,
  AlertCircle,
  Copy,
  ExternalLink,
  ChevronDown,
  History,
  Plus,
  ClipboardCheck,
  Download,
  Eye,
  Image as ImageIcon,
} from 'lucide-react';

const ORDER_PIPELINE = [
  {
    id: 'pending',
    label: 'Pending',
    icon: Clock,
    color: 'yellow',
    description: 'Awaiting confirmation',
  },
  {
    id: 'confirmed',
    label: 'Confirmed',
    icon: CheckCircle,
    color: 'blue',
    description: 'Payment verified',
  },
  {
    id: 'processing',
    label: 'Processing',
    icon: RefreshCw,
    color: 'blue',
    description: 'Preparing artwork',
  },
  {
    id: 'printing',
    label: 'Printing',
    icon: Printer,
    color: 'purple',
    description: 'In production',
  },
  {
    id: 'quality_check',
    label: 'QC',
    icon: ClipboardCheck,
    color: 'indigo',
    description: 'Final inspection',
  },
  { id: 'shipped', label: 'Shipped', icon: Truck, color: 'emerald', description: 'On the way' },
  {
    id: 'delivered',
    label: 'Delivered',
    icon: PackageCheck,
    color: 'emerald',
    description: 'Complete',
  },
];

const STATUS_COLORS = {
  pending: {
    bg: 'bg-yellow-100',
    text: 'text-yellow-700',
    border: 'border-yellow-300',
    accent: 'bg-yellow-500',
  },
  confirmed: {
    bg: 'bg-blue-100',
    text: 'text-blue-700',
    border: 'border-blue-300',
    accent: 'bg-blue-500',
  },
  processing: {
    bg: 'bg-blue-100',
    text: 'text-blue-700',
    border: 'border-blue-300',
    accent: 'bg-blue-500',
  },
  printing: {
    bg: 'bg-purple-100',
    text: 'text-purple-700',
    border: 'border-purple-300',
    accent: 'bg-purple-500',
  },
  quality_check: {
    bg: 'bg-indigo-100',
    text: 'text-indigo-700',
    border: 'border-indigo-300',
    accent: 'bg-indigo-500',
  },
  shipped: {
    bg: 'bg-emerald-100',
    text: 'text-emerald-700',
    border: 'border-emerald-300',
    accent: 'bg-emerald-500',
  },
  delivered: {
    bg: 'bg-emerald-100',
    text: 'text-emerald-700',
    border: 'border-emerald-300',
    accent: 'bg-emerald-500',
  },
  cancelled: {
    bg: 'bg-gray-100',
    text: 'text-gray-700',
    border: 'border-gray-300',
    accent: 'bg-gray-500',
  },
};

function formatDate(dateString) {
  return new Date(dateString).toLocaleDateString('en-CA', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

function formatShortDate(dateString) {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now - date;
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  return date.toLocaleDateString('en-CA', { month: 'short', day: 'numeric' });
}

function formatCurrency(amount) {
  return new Intl.NumberFormat('en-CA', { style: 'currency', currency: 'CAD' }).format(amount);
}

// Pipeline Progress Component
function OrderPipeline({ currentStatus, onStatusChange }) {
  const currentIndex = ORDER_PIPELINE.findIndex((s) => s.id === currentStatus);

  return (
    <div className="relative">
      <div className="flex items-center justify-between" style={{ minWidth: '500px' }}>
        {ORDER_PIPELINE.map((stage, index) => {
          const Icon = stage.icon;
          const isComplete = index < currentIndex;
          const isCurrent = index === currentIndex;
          const colors = STATUS_COLORS[stage.id];

          return (
            <div key={stage.id} className="flex flex-1 items-center">
              <button
                onClick={() => onStatusChange(stage.id)}
                className={`relative z-10 flex flex-col items-center ${isCurrent || isComplete ? 'cursor-pointer' : 'cursor-pointer opacity-60 hover:opacity-100'}`}
              >
                <div
                  className={`flex h-8 w-8 items-center justify-center rounded-full border-2 transition-all sm:h-10 sm:w-10 ${
                    isComplete
                      ? `${colors.accent} border-transparent text-white`
                      : isCurrent
                        ? `${colors.bg} ${colors.border} ${colors.text}`
                        : 'border-gray-300 bg-white text-gray-400'
                  }`}
                >
                  {isComplete ? (
                    <CheckCircle className="h-4 w-4 sm:h-5 sm:w-5" />
                  ) : (
                    <Icon className="h-4 w-4 sm:h-5 sm:w-5" />
                  )}
                </div>
                <span
                  className={`mt-1 text-xs font-medium sm:mt-2 ${isCurrent ? colors.text : isComplete ? 'text-gray-700' : 'text-gray-400'}`}
                >
                  {stage.label}
                </span>
              </button>
              {index < ORDER_PIPELINE.length - 1 && (
                <div
                  className={`h-0.5 flex-1 mx-1 sm:mx-2 ${index < currentIndex ? 'bg-emerald-500' : 'bg-gray-200'}`}
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// Quick Action Buttons
function QuickActions({ status, onAction, isLoading }) {
  const currentIndex = ORDER_PIPELINE.findIndex((s) => s.id === status);
  const nextStage =
    currentIndex < ORDER_PIPELINE.length - 1 ? ORDER_PIPELINE[currentIndex + 1] : null;
  const prevStage = currentIndex > 0 ? ORDER_PIPELINE[currentIndex - 1] : null;

  return (
    <div className="flex flex-wrap gap-2">
      {prevStage && (
        <Button
          variant="outline"
          size="sm"
          onClick={() => onAction(prevStage.id)}
          disabled={isLoading}
        >
          <ArrowLeft className="h-4 w-4 sm:mr-1" />
          <span className="hidden sm:inline">Back to {prevStage.label}</span>
        </Button>
      )}
      {nextStage && (
        <Button
          size="sm"
          onClick={() => onAction(nextStage.id)}
          disabled={isLoading}
          className="bg-emerald-600 hover:bg-emerald-700"
        >
          {isLoading ? (
            <Loader2 className="h-4 w-4 animate-spin sm:mr-1" />
          ) : (
            <ArrowRight className="h-4 w-4 sm:mr-1" />
          )}
          <span className="hidden sm:inline">Move to</span> {nextStage.label}
        </Button>
      )}
      {status !== 'cancelled' && status !== 'delivered' && (
        <Button
          variant="outline"
          size="sm"
          onClick={() => onAction('cancelled')}
          disabled={isLoading}
          className="text-red-600 hover:bg-red-50"
        >
          <XCircle className="h-4 w-4 sm:mr-1" />
          <span className="hidden sm:inline">Cancel</span>
        </Button>
      )}
    </div>
  );
}

export default function AdminOrderDetailPage({ params }) {
  const router = useRouter();
  const [order, setOrder] = React.useState(null);
  const [isLoading, setIsLoading] = React.useState(true);
  const [isSaving, setIsSaving] = React.useState(false);
  const [error, setError] = React.useState(null);
  const [success, setSuccess] = React.useState(null);

  const [status, setStatus] = React.useState('');
  const [trackingNumber, setTrackingNumber] = React.useState('');
  const [trackingCarrier, setTrackingCarrier] = React.useState('');
  const [notes, setNotes] = React.useState('');
  const [newNote, setNewNote] = React.useState('');
  const [activityLog, setActivityLog] = React.useState([]);
  const [showShippingForm, setShowShippingForm] = React.useState(false);

  React.useEffect(() => {
    async function fetchOrder() {
      const supabase = createClient();
      const { id } = await params;

      const { data, error } = await supabase
        .from('orders')
        .select(
          `
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
            unit_price,
            product_name,
            product_options,
            artwork_url
          )
        `
        )
        .eq('id', id)
        .single();

      if (error || !data) {
        setError('Order not found');
        setIsLoading(false);
        return;
      }

      setOrder(data);
      setStatus(data.status);
      setTrackingNumber(data.tracking_number || '');
      setTrackingCarrier(data.tracking_carrier || 'canada_post');
      setNotes(data.admin_notes || '');

      // Mock activity log - in production this would come from a separate table
      setActivityLog([
        {
          id: 1,
          type: 'status',
          message: 'Order created',
          timestamp: data.created_at,
          user: 'System',
        },
        ...(data.status !== 'pending'
          ? [
              {
                id: 2,
                type: 'status',
                message: 'Order confirmed',
                timestamp: data.updated_at,
                user: 'Admin',
              },
            ]
          : []),
      ]);

      setIsLoading(false);
    }

    fetchOrder();
  }, [params]);

  const handleStatusChange = async (newStatus) => {
    if (newStatus === status) return;
    setIsSaving(true);
    setError(null);

    try {
      const supabase = createClient();
      const { id } = await params;

      const updates = {
        status: newStatus,
        updated_at: new Date().toISOString(),
      };

      // If moving to shipped, prompt for tracking
      if (newStatus === 'shipped' && !trackingNumber) {
        setShowShippingForm(true);
        setIsSaving(false);
        return;
      }

      const { error } = await supabase.from('orders').update(updates).eq('id', id);
      if (error) throw error;

      setStatus(newStatus);
      setOrder({ ...order, status: newStatus });
      setActivityLog((prev) => [
        ...prev,
        {
          id: Date.now(),
          type: 'status',
          message: `Status changed to ${newStatus}`,
          timestamp: new Date().toISOString(),
          user: 'Admin',
        },
      ]);
      setSuccess(`Order moved to ${newStatus}`);
      setTimeout(() => setSuccess(null), 2000);
    } catch (err) {
      setError(err.message || 'Failed to update status');
    } finally {
      setIsSaving(false);
    }
  };

  const handleSaveShipping = async () => {
    if (!trackingNumber) {
      setError('Please enter a tracking number');
      return;
    }
    setIsSaving(true);
    setError(null);

    try {
      const supabase = createClient();
      const { id } = await params;

      const { error } = await supabase
        .from('orders')
        .update({
          status: 'shipped',
          tracking_number: trackingNumber,
          tracking_carrier: trackingCarrier,
          updated_at: new Date().toISOString(),
        })
        .eq('id', id);

      if (error) throw error;

      setStatus('shipped');
      setOrder({
        ...order,
        status: 'shipped',
        tracking_number: trackingNumber,
        tracking_carrier: trackingCarrier,
      });
      setShowShippingForm(false);
      setSuccess('Order shipped with tracking info');
      setTimeout(() => setSuccess(null), 2000);
    } catch (err) {
      setError(err.message || 'Failed to save shipping info');
    } finally {
      setIsSaving(false);
    }
  };

  const handleAddNote = async () => {
    if (!newNote.trim()) return;
    setIsSaving(true);

    try {
      const supabase = createClient();
      const { id } = await params;
      const updatedNotes = notes
        ? `${notes}\n\n[${new Date().toLocaleString()}] ${newNote}`
        : `[${new Date().toLocaleString()}] ${newNote}`;

      const { error } = await supabase
        .from('orders')
        .update({
          admin_notes: updatedNotes,
          updated_at: new Date().toISOString(),
        })
        .eq('id', id);

      if (error) throw error;

      setNotes(updatedNotes);
      setNewNote('');
      setActivityLog((prev) => [
        ...prev,
        {
          id: Date.now(),
          type: 'note',
          message: newNote,
          timestamp: new Date().toISOString(),
          user: 'Admin',
        },
      ]);
    } catch (err) {
      setError(err.message || 'Failed to add note');
    } finally {
      setIsSaving(false);
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    setSuccess('Copied to clipboard');
    setTimeout(() => setSuccess(null), 1500);
  };

  const getTrackingUrl = () => {
    const carriers = {
      canada_post: `https://www.canadapost-postescanada.ca/track-reperage/en#/search?searchFor=${trackingNumber}`,
      ups: `https://www.ups.com/track?tracknum=${trackingNumber}`,
      fedex: `https://www.fedex.com/fedextrack/?trknbr=${trackingNumber}`,
      purolator: `https://www.purolator.com/en/shipping/tracker?pin=${trackingNumber}`,
    };
    return carriers[trackingCarrier] || carriers.canada_post;
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-16">
        <Loader2 className="h-8 w-8 animate-spin text-emerald-600" />
      </div>
    );
  }

  if (error && !order) {
    return (
      <div className="py-16 text-center">
        <p className="text-red-600">{error}</p>
        <Link href="/admin/orders" className="mt-4 text-emerald-600 hover:underline">
          Back to Orders
        </Link>
      </div>
    );
  }

  const colors = STATUS_COLORS[status] || STATUS_COLORS.pending;

  return (
    <div className="min-w-0">
      {/* Header */}
      <div className="mb-6">
        <Link
          href="/admin/orders"
          className="mb-3 inline-flex items-center gap-2 text-sm text-gray-600 hover:text-emerald-600"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Orders
        </Link>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-xl font-bold text-gray-900 sm:text-2xl">
                {order.order_number || `#${order.id.slice(0, 8)}`}
              </h1>
              <span
                className={`inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-xs font-medium sm:px-3 sm:py-1 sm:text-sm ${colors.bg} ${colors.text}`}
              >
                {ORDER_PIPELINE.find((s) => s.id === status)?.label || status}
              </span>
            </div>
            <p className="mt-1 text-sm text-gray-500">
              Placed {formatShortDate(order.created_at)} • {formatCurrency(order.total)}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => copyToClipboard(order.order_number || order.id)}
            >
              <Copy className="h-4 w-4 sm:mr-1" />
              <span className="hidden sm:inline">Copy ID</span>
            </Button>
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 sm:mr-1" />
              <span className="hidden sm:inline">Invoice</span>
            </Button>
          </div>
        </div>
      </div>

      {/* Alerts */}
      {error && (
        <div className="mb-4 flex items-center gap-2 rounded-lg bg-red-50 p-3 text-sm text-red-700">
          <AlertCircle className="h-4 w-4 flex-shrink-0" />
          {error}
        </div>
      )}
      {success && (
        <div className="mb-4 flex items-center gap-2 rounded-lg bg-emerald-50 p-3 text-sm text-emerald-700">
          <CheckCircle className="h-4 w-4 flex-shrink-0" />
          {success}
        </div>
      )}

      {/* Pipeline Progress - Horizontal scroll on mobile */}
      <Card className="mb-6">
        <CardContent className="overflow-x-auto p-4 sm:p-6">
          <OrderPipeline currentStatus={status} onStatusChange={handleStatusChange} />
          <div className="mt-4 flex flex-col gap-3 border-t pt-4 sm:mt-6 sm:flex-row sm:items-center sm:justify-between">
            <QuickActions status={status} onAction={handleStatusChange} isLoading={isSaving} />
            {order.profiles?.email && (
              <a
                href={`mailto:${order.profiles.email}?subject=Order ${order.order_number || order.id}`}
                className="inline-flex items-center gap-1 text-sm text-emerald-600 hover:text-emerald-700"
              >
                <Mail className="h-4 w-4" />
                Email Customer
              </a>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Shipping Modal */}
      {showShippingForm && (
        <Card className="mb-6 border-emerald-300 bg-emerald-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-emerald-700">
              <Truck className="h-5 w-5" />
              Add Shipping Information
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <Label>Carrier</Label>
                <select
                  value={trackingCarrier}
                  onChange={(e) => setTrackingCarrier(e.target.value)}
                  className="mt-1 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm"
                >
                  <option value="canada_post">Canada Post</option>
                  <option value="ups">UPS</option>
                  <option value="fedex">FedEx</option>
                  <option value="purolator">Purolator</option>
                </select>
              </div>
              <div>
                <Label>Tracking Number *</Label>
                <Input
                  value={trackingNumber}
                  onChange={(e) => setTrackingNumber(e.target.value)}
                  placeholder="Enter tracking number"
                  className="mt-1"
                />
              </div>
            </div>
            <div className="mt-4 flex gap-2">
              <Button onClick={handleSaveShipping} disabled={isSaving}>
                {isSaving ? (
                  <Loader2 className="mr-1 h-4 w-4 animate-spin" />
                ) : (
                  <Truck className="mr-1 h-4 w-4" />
                )}
                Mark as Shipped
              </Button>
              <Button variant="outline" onClick={() => setShowShippingForm(false)}>
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Tracking Info (if shipped) */}
      {trackingNumber && status !== 'pending' && (
        <Card className="mb-6 border-emerald-200 bg-emerald-50/50">
          <CardContent className="flex items-center justify-between p-4">
            <div className="flex items-center gap-3">
              <Truck className="h-5 w-5 text-emerald-600" />
              <div>
                <p className="font-medium text-gray-900">Tracking: {trackingNumber}</p>
                <p className="text-sm text-gray-500 capitalize">
                  {trackingCarrier.replace('_', ' ')}
                </p>
              </div>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={() => copyToClipboard(trackingNumber)}>
                <Copy className="h-4 w-4" />
              </Button>
              <a href={getTrackingUrl()} target="_blank" rel="noopener noreferrer">
                <Button variant="outline" size="sm">
                  <ExternalLink className="mr-1 h-4 w-4" />
                  Track
                </Button>
              </a>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main Content */}
        <div className="space-y-6 lg:col-span-2">
          {/* Order Items */}
          <Card>
            <CardHeader className="p-4 sm:p-6">
              <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
                <Package className="h-5 w-5" />
                Order Items ({order.order_items?.length || 0})
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 pt-0 sm:p-6 sm:pt-0">
              {order.order_items && order.order_items.length > 0 ? (
                <div className="space-y-3 sm:space-y-4">
                  {order.order_items.map((item) => (
                    <div
                      key={item.id}
                      className="flex flex-col gap-3 rounded-lg border p-3 sm:flex-row sm:items-start sm:gap-4 sm:p-4"
                    >
                      <div className="flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-lg bg-gray-100 overflow-hidden sm:h-20 sm:w-20">
                        {item.artwork_url ? (
                          <img
                            src={item.artwork_url}
                            alt={item.product_name}
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <Package className="h-6 w-6 text-gray-400 sm:h-8 sm:w-8" />
                        )}
                      </div>
                      <div className="min-w-0 flex-1">
                        <h3 className="font-medium text-gray-900 text-sm sm:text-base">
                          {item.product_name}
                        </h3>
                        {item.product_options && (
                          <div className="mt-1 flex flex-wrap gap-1 sm:gap-2">
                            {typeof item.product_options === 'object' ? (
                              Object.entries(item.product_options).map(([key, value]) => (
                                <span
                                  key={key}
                                  className="inline-flex rounded-full bg-gray-100 px-2 py-0.5 text-xs"
                                >
                                  <span className="font-medium text-gray-700">{key}:</span>
                                  <span className="ml-1 text-gray-600">
                                    {String(value).substring(0, 20)}
                                  </span>
                                </span>
                              ))
                            ) : (
                              <span className="text-sm text-gray-500">{item.product_options}</span>
                            )}
                          </div>
                        )}
                        <div className="mt-2 flex items-center justify-between text-sm text-gray-600">
                          <div className="flex items-center gap-3">
                            <span>
                              Qty: <strong>{item.quantity}</strong>
                            </span>
                            <span className="hidden sm:inline">
                              {formatCurrency(item.unit_price)} each
                            </span>
                          </div>
                          <p className="font-semibold text-gray-900 sm:hidden">
                            {formatCurrency(item.unit_price * item.quantity)}
                          </p>
                        </div>
                        {item.artwork_url && (
                          <a
                            href={item.artwork_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="mt-2 inline-flex items-center gap-1 text-xs text-emerald-600 hover:text-emerald-700"
                          >
                            <Eye className="h-3 w-3" />
                            View Artwork
                          </a>
                        )}
                      </div>
                      <div className="hidden text-right sm:block">
                        <p className="text-lg font-semibold text-gray-900">
                          {formatCurrency(item.unit_price * item.quantity)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="py-8 text-center text-gray-500">No items found</p>
              )}
            </CardContent>
          </Card>

          {/* Internal Notes & Activity */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="h-5 w-5" />
                Notes & Activity
              </CardTitle>
            </CardHeader>
            <CardContent>
              {/* Add Note */}
              <div className="mb-4 flex gap-2">
                <Input
                  value={newNote}
                  onChange={(e) => setNewNote(e.target.value)}
                  placeholder="Add an internal note..."
                  onKeyDown={(e) => e.key === 'Enter' && handleAddNote()}
                />
                <Button onClick={handleAddNote} disabled={isSaving || !newNote.trim()}>
                  <Plus className="mr-1 h-4 w-4" />
                  Add
                </Button>
              </div>

              {/* Activity Timeline */}
              <div className="space-y-4">
                {activityLog
                  .slice()
                  .reverse()
                  .map((activity) => (
                    <div key={activity.id} className="flex gap-3">
                      <div
                        className={`mt-1 flex h-6 w-6 items-center justify-center rounded-full ${activity.type === 'note' ? 'bg-blue-100' : 'bg-gray-100'}`}
                      >
                        {activity.type === 'note' ? (
                          <MessageSquare className="h-3 w-3 text-blue-600" />
                        ) : (
                          <History className="h-3 w-3 text-gray-600" />
                        )}
                      </div>
                      <div className="flex-1">
                        <p className="text-sm text-gray-900">{activity.message}</p>
                        <p className="text-xs text-gray-500">
                          {activity.user} • {formatShortDate(activity.timestamp)}
                        </p>
                      </div>
                    </div>
                  ))}
              </div>

              {/* Existing Notes */}
              {notes && (
                <div className="mt-4 rounded-lg bg-gray-50 p-3">
                  <p className="text-xs font-medium text-gray-500 mb-2">Saved Notes</p>
                  <pre className="whitespace-pre-wrap text-sm text-gray-700 font-sans">{notes}</pre>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Order Summary */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Order Summary
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Subtotal</span>
                <span>{formatCurrency(order.subtotal || order.total)}</span>
              </div>
              {order.shipping_cost > 0 && (
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Shipping</span>
                  <span>{formatCurrency(order.shipping_cost)}</span>
                </div>
              )}
              {order.tax > 0 && (
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Tax</span>
                  <span>{formatCurrency(order.tax)}</span>
                </div>
              )}
              {order.discount > 0 && (
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Discount</span>
                  <span className="text-emerald-600">-{formatCurrency(order.discount)}</span>
                </div>
              )}
              <Separator />
              <div className="flex justify-between font-semibold">
                <span>Total</span>
                <span className="text-lg">{formatCurrency(order.total)}</span>
              </div>
            </CardContent>
          </Card>

          {/* Customer Info */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Customer
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <p className="font-medium text-gray-900">
                  {order.profiles?.full_name || 'Guest Customer'}
                </p>
              </div>
              {order.profiles?.email && (
                <a
                  href={`mailto:${order.profiles.email}`}
                  className="flex items-center gap-2 text-sm text-gray-600 hover:text-emerald-600"
                >
                  <Mail className="h-4 w-4" />
                  {order.profiles.email}
                </a>
              )}
              {order.profiles?.phone && (
                <a
                  href={`tel:${order.profiles.phone}`}
                  className="flex items-center gap-2 text-sm text-gray-600 hover:text-emerald-600"
                >
                  <Phone className="h-4 w-4" />
                  {order.profiles.phone}
                </a>
              )}
              {order.profiles?.id && (
                <Link
                  href={`/admin/customers/${order.profiles.id}`}
                  className="mt-2 inline-block text-sm text-emerald-600 hover:underline"
                >
                  View Customer Profile →
                </Link>
              )}
            </CardContent>
          </Card>

          {/* Shipping Address */}
          {order.shipping_address && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="h-5 w-5" />
                  Shipping Address
                </CardTitle>
              </CardHeader>
              <CardContent>
                <address className="text-sm not-italic text-gray-600">
                  {typeof order.shipping_address === 'object' ? (
                    <>
                      <p className="font-medium text-gray-900">{order.shipping_address.name}</p>
                      <p>{order.shipping_address.line1}</p>
                      {order.shipping_address.line2 && <p>{order.shipping_address.line2}</p>}
                      <p>
                        {order.shipping_address.city}, {order.shipping_address.province}{' '}
                        {order.shipping_address.postal_code}
                      </p>
                      <p>{order.shipping_address.country}</p>
                    </>
                  ) : (
                    <p>{order.shipping_address}</p>
                  )}
                </address>
              </CardContent>
            </Card>
          )}

          {/* Payment Info */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="h-5 w-5" />
                Payment
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-sm text-gray-600">
                <p className="font-medium text-gray-900">{order.payment_method || 'Credit Card'}</p>
                {order.payment_status && (
                  <p className="mt-1">
                    Status: <span className="capitalize">{order.payment_status}</span>
                  </p>
                )}
                {order.stripe_payment_id && (
                  <p className="mt-1 font-mono text-xs">{order.stripe_payment_id}</p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
