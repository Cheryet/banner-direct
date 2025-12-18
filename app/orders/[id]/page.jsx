import { redirect, notFound } from 'next/navigation';
import { createClient, getUser } from '@/lib/supabase/server';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { LinkButton } from '@/components/ui/link-button';
import { Separator } from '@/components/ui/separator';
import {
  Package,
  ArrowLeft,
  RefreshCw,
  Truck,
  Calendar,
  MapPin,
  CreditCard,
  FileText,
  CheckCircle,
  Clock,
  Printer,
  Search,
  PackageCheck,
} from 'lucide-react';
import Link from 'next/link';
import { formatCurrency, formatDate } from '@/lib/format';

export async function generateMetadata({ params }) {
  return {
    title: `Order Details`,
    description: 'View your order details and tracking information.',
  };
}

function getStatusInfo(status) {
  const statusMap = {
    pending: {
      label: 'Pending',
      color: 'bg-yellow-100 text-yellow-700 border-yellow-200',
      icon: Clock,
      description: 'Your order has been received and is awaiting confirmation.',
    },
    confirmed: {
      label: 'Confirmed',
      color: 'bg-blue-100 text-blue-700 border-blue-200',
      icon: CheckCircle,
      description: 'Your order has been confirmed and is being prepared.',
    },
    processing: {
      label: 'Processing',
      color: 'bg-blue-100 text-blue-700 border-blue-200',
      icon: Clock,
      description: 'Your order is being processed.',
    },
    printing: {
      label: 'Printing',
      color: 'bg-purple-100 text-purple-700 border-purple-200',
      icon: Printer,
      description: 'Your banners are currently being printed.',
    },
    quality_check: {
      label: 'Quality Check',
      color: 'bg-indigo-100 text-indigo-700 border-indigo-200',
      icon: Search,
      description: 'Your order is undergoing quality inspection.',
    },
    shipped: {
      label: 'Shipped',
      color: 'bg-emerald-100 text-emerald-700 border-emerald-200',
      icon: Truck,
      description: 'Your order is on its way!',
    },
    delivered: {
      label: 'Delivered',
      color: 'bg-emerald-100 text-emerald-700 border-emerald-200',
      icon: PackageCheck,
      description: 'Your order has been delivered.',
    },
    cancelled: {
      label: 'Cancelled',
      color: 'bg-gray-100 text-gray-700 border-gray-200',
      icon: Clock,
      description: 'This order has been cancelled.',
    },
    refunded: {
      label: 'Refunded',
      color: 'bg-red-100 text-red-700 border-red-200',
      icon: CreditCard,
      description: 'This order has been refunded.',
    },
  };

  return statusMap[status] || statusMap.pending;
}


export default async function OrderDetailPage({ params }) {
  const { id } = await params;
  const supabase = await createClient();
  const { user, error } = await getUser();

  if (!user || error) {
    redirect('/login?redirectTo=/orders');
  }

  // Fetch the order with items
  const { data: order, error: orderError } = await supabase
    .from('orders')
    .select(
      `
      *,
      order_items (
        id,
        quantity,
        unit_price,
        product_name,
        product_options,
        upload_id
      )
    `
    )
    .eq('id', id)
    .eq('user_id', user.id)
    .single();

  if (orderError || !order) {
    notFound();
  }

  const statusInfo = getStatusInfo(order.status);
  const StatusIcon = statusInfo.icon;

  // Calculate order timeline steps
  const timelineSteps = [
    { status: 'confirmed', label: 'Order Confirmed', icon: CheckCircle },
    { status: 'printing', label: 'Printing', icon: Printer },
    { status: 'quality_check', label: 'Quality Check', icon: Search },
    { status: 'shipped', label: 'Shipped', icon: Truck },
    { status: 'delivered', label: 'Delivered', icon: PackageCheck },
  ];

  const statusOrder = [
    'pending',
    'confirmed',
    'processing',
    'printing',
    'quality_check',
    'shipped',
    'delivered',
  ];
  const currentStatusIndex = statusOrder.indexOf(order.status);

  return (
    <div className="container py-8 md:py-12">
      {/* Breadcrumb */}
      <nav className="mb-6">
        <Link
          href="/orders"
          className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-emerald-600 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Order History
        </Link>
      </nav>

      {/* Page Header */}
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-bold text-gray-900">Order {order.order_number}</h1>
            <span
              className={`rounded-full border px-3 py-1 text-sm font-medium ${statusInfo.color}`}
            >
              {statusInfo.label}
            </span>
          </div>
          <p className="mt-2 text-gray-600">Placed on {formatDate(order.created_at)}</p>
        </div>
        <LinkButton href={`/orders/${order.id}/reorder`}>
          <RefreshCw className="mr-2 h-4 w-4" />
          Reorder
        </LinkButton>
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        {/* Main Content */}
        <div className="space-y-6 lg:col-span-2">
          {/* Order Status Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <StatusIcon className="h-5 w-5" />
                Order Status
              </CardTitle>
              <CardDescription>{statusInfo.description}</CardDescription>
            </CardHeader>
            <CardContent>
              {/* Progress Timeline */}
              {order.status !== 'cancelled' && order.status !== 'refunded' && (
                <div className="relative">
                  <div className="flex justify-between">
                    {timelineSteps.map((step, index) => {
                      const stepIndex = statusOrder.indexOf(step.status);
                      const isCompleted = currentStatusIndex >= stepIndex;
                      const isCurrent = order.status === step.status;
                      const StepIcon = step.icon;

                      return (
                        <div key={step.status} className="flex flex-col items-center">
                          <div
                            className={`flex h-10 w-10 items-center justify-center rounded-full border-2 transition-colors ${
                              isCompleted
                                ? 'border-emerald-500 bg-emerald-500 text-white'
                                : 'border-gray-300 bg-white text-gray-400'
                            } ${isCurrent ? 'ring-4 ring-emerald-100' : ''}`}
                          >
                            <StepIcon className="h-5 w-5" />
                          </div>
                          <span
                            className={`mt-2 text-xs font-medium ${isCompleted ? 'text-emerald-600' : 'text-gray-500'}`}
                          >
                            {step.label}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                  {/* Progress Line */}
                  <div className="absolute left-0 right-0 top-5 -z-10 h-0.5 bg-gray-200">
                    <div
                      className="h-full bg-emerald-500 transition-all"
                      style={{
                        width: `${Math.min(100, (currentStatusIndex / (timelineSteps.length - 1)) * 100)}%`,
                      }}
                    />
                  </div>
                </div>
              )}

              {/* Tracking Info */}
              {order.tracking_number && (
                <div className="mt-6 rounded-lg bg-emerald-50 p-4">
                  <div className="flex items-center gap-2 text-emerald-700">
                    <Truck className="h-5 w-5" />
                    <span className="font-medium">Tracking Number:</span>
                    <span>{order.tracking_number}</span>
                  </div>
                  {order.tracking_url && (
                    <a
                      href={order.tracking_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-2 inline-block text-sm text-emerald-600 hover:underline"
                    >
                      Track your package →
                    </a>
                  )}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Order Items */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="h-5 w-5" />
                Order Items
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {order.order_items && order.order_items.length > 0 ? (
                  order.order_items.map((item) => (
                    <div key={item.id} className="flex items-start gap-4 rounded-lg border p-4">
                      <div className="flex h-16 w-16 items-center justify-center rounded-lg bg-gray-100">
                        <Package className="h-8 w-8 text-gray-400" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-medium text-gray-900">{item.product_name}</h3>
                        {item.product_options && (
                          <div className="mt-1 text-sm text-gray-500">
                            {typeof item.product_options === 'object'
                              ? Object.entries(item.product_options).map(([key, value]) => (
                                  <span key={key} className="mr-3">
                                    {key}: {value}
                                  </span>
                                ))
                              : item.product_options}
                          </div>
                        )}
                        <div className="mt-2 flex items-center gap-4 text-sm">
                          <span className="text-gray-600">Qty: {item.quantity}</span>
                          <span className="text-gray-600">
                            {formatCurrency(item.unit_price)} each
                          </span>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-gray-900">
                          {formatCurrency(item.unit_price * item.quantity)}
                        </p>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-center text-gray-500">No items found</p>
                )}
              </div>
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
                <span className="text-gray-900">
                  {formatCurrency(order.subtotal || order.total)}
                </span>
              </div>
              {order.shipping_cost > 0 && (
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Shipping</span>
                  <span className="text-gray-900">{formatCurrency(order.shipping_cost)}</span>
                </div>
              )}
              {order.tax > 0 && (
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Tax</span>
                  <span className="text-gray-900">{formatCurrency(order.tax)}</span>
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
              </div>
            </CardContent>
          </Card>

          {/* Need Help */}
          <Card className="bg-gray-50">
            <CardContent className="pt-6">
              <h3 className="font-medium text-gray-900">Need help?</h3>
              <p className="mt-1 text-sm text-gray-600">
                Contact our support team for assistance with this order.
              </p>
              <LinkButton href="/contact" variant="outline" size="sm" className="mt-4 w-full">
                Contact Support
              </LinkButton>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
