'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/lib/supabase/auth-context';
import { createClient } from '@/lib/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { LinkButton } from '@/components/ui/link-button';
import {
  Package,
  ArrowLeft,
  ShoppingCart,
  Loader2,
  CheckCircle,
  AlertCircle,
  Minus,
  Plus,
  Trash2,
} from 'lucide-react';

function formatCurrency(amount) {
  return new Intl.NumberFormat('en-CA', {
    style: 'currency',
    currency: 'CAD',
  }).format(amount);
}

export default function ReorderPage({ params }) {
  const router = useRouter();
  const { user, isLoading: authLoading } = useAuth();
  const [order, setOrder] = React.useState(null);
  const [items, setItems] = React.useState([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [error, setError] = React.useState(null);
  const [success, setSuccess] = React.useState(false);

  // Fetch order data
  React.useEffect(() => {
    async function fetchOrder() {
      if (authLoading) return;

      if (!user) {
        router.push('/login?redirectTo=/orders');
        return;
      }

      const supabase = createClient();
      const { id } = await params;

      const { data, error } = await supabase
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
        .eq('id', id)
        .eq('user_id', user.id)
        .single();

      if (error || !data) {
        setError('Order not found');
        setIsLoading(false);
        return;
      }

      setOrder(data);
      setItems(
        data.order_items?.map((item) => ({
          ...item,
          selected: true,
          newQuantity: item.quantity,
        })) || []
      );
      setIsLoading(false);
    }

    fetchOrder();
  }, [user, authLoading, params, router]);

  const toggleItem = (itemId) => {
    setItems(
      items.map((item) => (item.id === itemId ? { ...item, selected: !item.selected } : item))
    );
  };

  const updateQuantity = (itemId, delta) => {
    setItems(
      items.map((item) => {
        if (item.id === itemId) {
          const newQty = Math.max(1, item.newQuantity + delta);
          return { ...item, newQuantity: newQty };
        }
        return item;
      })
    );
  };

  const selectedItems = items.filter((item) => item.selected);
  const subtotal = selectedItems.reduce((sum, item) => sum + item.unit_price * item.newQuantity, 0);

  const handleAddToCart = async () => {
    if (selectedItems.length === 0) {
      setError('Please select at least one item to reorder');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const supabase = createClient();

      // Add items to cart
      for (const item of selectedItems) {
        const { error: cartError } = await supabase.from('cart_items').upsert(
          {
            user_id: user.id,
            product_name: item.product_name,
            product_options: item.product_options,
            quantity: item.newQuantity,
            unit_price: item.unit_price,
          },
          {
            onConflict: 'user_id,product_name',
          }
        );

        if (cartError) {
          console.error('Cart error:', cartError);
        }
      }

      setSuccess(true);

      // Redirect to cart after a short delay
      setTimeout(() => {
        router.push('/cart');
      }, 1500);
    } catch (err) {
      setError('Failed to add items to cart. Please try again.');
      setIsSubmitting(false);
    }
  };

  if (isLoading || authLoading) {
    return (
      <div className="container py-16">
        <div className="flex flex-col items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-emerald-600" />
          <p className="mt-4 text-gray-600">Loading order...</p>
        </div>
      </div>
    );
  }

  if (error && !order) {
    return (
      <div className="container py-16">
        <Card className="mx-auto max-w-md">
          <CardContent className="pt-6 text-center">
            <AlertCircle className="mx-auto h-12 w-12 text-red-500" />
            <h2 className="mt-4 text-xl font-semibold text-gray-900">Order Not Found</h2>
            <p className="mt-2 text-gray-600">{error}</p>
            <LinkButton href="/orders" className="mt-6">
              Back to Orders
            </LinkButton>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (success) {
    return (
      <div className="container py-16">
        <Card className="mx-auto max-w-md">
          <CardContent className="pt-6 text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100">
              <CheckCircle className="h-8 w-8 text-emerald-600" />
            </div>
            <h2 className="mt-4 text-xl font-semibold text-gray-900">Added to Cart!</h2>
            <p className="mt-2 text-gray-600">Your items have been added to your cart.</p>
            <p className="mt-1 text-sm text-gray-500">Redirecting to cart...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container py-8 md:py-12">
      {/* Breadcrumb */}
      <nav className="mb-6">
        <Link
          href={`/orders/${order.id}`}
          className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-emerald-600 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Order Details
        </Link>
      </nav>

      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Reorder from {order.order_number}</h1>
        <p className="mt-2 text-gray-600">
          Select the items you'd like to reorder and adjust quantities as needed.
        </p>
      </div>

      {error && (
        <div className="mb-6 rounded-lg bg-red-50 p-4 text-red-700">
          <div className="flex items-center gap-2">
            <AlertCircle className="h-5 w-5" />
            <span>{error}</span>
          </div>
        </div>
      )}

      <div className="grid gap-8 lg:grid-cols-3">
        {/* Items List */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Select Items to Reorder</CardTitle>
              <CardDescription>
                {selectedItems.length} of {items.length} items selected
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {items.map((item) => (
                  <div
                    key={item.id}
                    className={`rounded-lg border-2 p-4 transition-colors ${
                      item.selected
                        ? 'border-emerald-500 bg-emerald-50/50'
                        : 'border-gray-200 bg-gray-50'
                    }`}
                  >
                    <div className="flex items-start gap-4">
                      {/* Checkbox */}
                      <button
                        onClick={() => toggleItem(item.id)}
                        className={`mt-1 flex h-5 w-5 items-center justify-center rounded border-2 transition-colors ${
                          item.selected
                            ? 'border-emerald-500 bg-emerald-500 text-white'
                            : 'border-gray-300 bg-white'
                        }`}
                      >
                        {item.selected && <CheckCircle className="h-3 w-3" />}
                      </button>

                      {/* Item Icon */}
                      <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-white shadow-sm">
                        <Package className="h-6 w-6 text-gray-400" />
                      </div>

                      {/* Item Details */}
                      <div className="flex-1">
                        <h3 className="font-medium text-gray-900">{item.product_name}</h3>
                        {item.product_options && (
                          <p className="mt-1 text-sm text-gray-500">
                            {typeof item.product_options === 'object'
                              ? Object.entries(item.product_options)
                                  .map(([k, v]) => `${k}: ${v}`)
                                  .join(', ')
                              : item.product_options}
                          </p>
                        )}
                        <p className="mt-1 text-sm text-gray-600">
                          {formatCurrency(item.unit_price)} each
                        </p>
                      </div>

                      {/* Quantity Controls */}
                      {item.selected && (
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => updateQuantity(item.id, -1)}
                            disabled={item.newQuantity <= 1}
                            className="flex h-8 w-8 items-center justify-center rounded-lg border bg-white text-gray-600 hover:bg-gray-50 disabled:opacity-50"
                          >
                            <Minus className="h-4 w-4" />
                          </button>
                          <span className="w-8 text-center font-medium">{item.newQuantity}</span>
                          <button
                            onClick={() => updateQuantity(item.id, 1)}
                            className="flex h-8 w-8 items-center justify-center rounded-lg border bg-white text-gray-600 hover:bg-gray-50"
                          >
                            <Plus className="h-4 w-4" />
                          </button>
                        </div>
                      )}

                      {/* Item Total */}
                      <div className="text-right">
                        <p className="font-semibold text-gray-900">
                          {formatCurrency(
                            item.unit_price * (item.selected ? item.newQuantity : item.quantity)
                          )}
                        </p>
                        {item.newQuantity !== item.quantity && item.selected && (
                          <p className="text-xs text-gray-500">was {item.quantity}</p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Order Summary Sidebar */}
        <div>
          <Card className="sticky top-24">
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {selectedItems.length === 0 ? (
                <p className="text-center text-sm text-gray-500">Select items to see the total</p>
              ) : (
                <>
                  {selectedItems.map((item) => (
                    <div key={item.id} className="flex justify-between text-sm">
                      <span className="text-gray-600">
                        {item.product_name} × {item.newQuantity}
                      </span>
                      <span className="font-medium">
                        {formatCurrency(item.unit_price * item.newQuantity)}
                      </span>
                    </div>
                  ))}

                  <div className="border-t pt-4">
                    <div className="flex justify-between font-semibold">
                      <span>Subtotal</span>
                      <span className="text-lg">{formatCurrency(subtotal)}</span>
                    </div>
                    <p className="mt-1 text-xs text-gray-500">
                      Shipping and taxes calculated at checkout
                    </p>
                  </div>
                </>
              )}

              <Button
                onClick={handleAddToCart}
                disabled={selectedItems.length === 0 || isSubmitting}
                className="w-full"
                size="lg"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Adding to Cart...
                  </>
                ) : (
                  <>
                    <ShoppingCart className="mr-2 h-4 w-4" />
                    Add to Cart
                  </>
                )}
              </Button>

              <LinkButton href="/products" variant="outline" className="w-full">
                Continue Shopping
              </LinkButton>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
