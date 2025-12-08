'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Truck, Clock, MapPin } from 'lucide-react';

function PriceSummary({
  unitPrice,
  quantity,
  addOns = [],
  rushFee = 0,
  estimatedDate,
  isValid = false,
  onCheckout,
  className,
}) {
  const subtotal = unitPrice * quantity;
  const addOnsTotal = addOns.reduce((sum, addon) => sum + addon.price, 0);
  const total = subtotal + addOnsTotal + rushFee;

  return (
    <div
      className={cn(
        'rounded-lg border bg-card p-6 shadow-card',
        className
      )}
    >
      <h3 className="mb-4 font-heading text-lg font-semibold">Order Summary</h3>

      <div className="space-y-3 text-sm">
        <div className="flex justify-between">
          <span className="text-muted-foreground">Unit price</span>
          <span>${unitPrice.toFixed(2)}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">Quantity</span>
          <span>×{quantity}</span>
        </div>
        <div className="flex justify-between font-medium">
          <span>Subtotal</span>
          <span>${subtotal.toFixed(2)}</span>
        </div>

        {addOns.length > 0 && (
          <>
            <Separator />
            {addOns.map((addon) => (
              <div key={addon.name} className="flex justify-between">
                <span className="text-muted-foreground">{addon.name}</span>
                <span>+${addon.price.toFixed(2)}</span>
              </div>
            ))}
          </>
        )}

        {rushFee > 0 && (
          <div className="flex justify-between text-orange-600">
            <span>Rush processing</span>
            <span>+${rushFee.toFixed(2)}</span>
          </div>
        )}

        <Separator />

        <div className="flex justify-between text-lg font-bold">
          <span>Total</span>
          <span className="text-primary">${total.toFixed(2)}</span>
        </div>
      </div>

      {estimatedDate && (
        <div className="mt-4 rounded-md bg-muted/50 p-3">
          <div className="flex items-center gap-2 text-sm">
            <Clock className="h-4 w-4 text-muted-foreground" />
            <span>
              Estimated delivery: <strong>{estimatedDate}</strong>
            </span>
          </div>
        </div>
      )}

      <div className="mt-4 space-y-2">
        <Button
          variant="cta"
          size="xl"
          className="w-full"
          disabled={!isValid}
          onClick={onCheckout}
        >
          {isValid ? 'Add to Cart' : 'Complete Configuration'}
        </Button>

        <div className="flex flex-wrap justify-center gap-2 pt-2">
          <Badge variant="outline" className="gap-1">
            <Truck className="h-3 w-3" />
            Free shipping $200+
          </Badge>
          <Badge variant="canada" className="gap-1">
            <MapPin className="h-3 w-3" />
            Made in Canada
          </Badge>
        </div>
      </div>
    </div>
  );
}

export { PriceSummary };
