'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Truck, Loader2 } from 'lucide-react';

/**
 * Shipping information form for marking orders as shipped
 * Client component - handles form state and submission
 */
export function OrderShippingForm({
  trackingNumber,
  trackingCarrier,
  onTrackingNumberChange,
  onTrackingCarrierChange,
  onSubmit,
  onCancel,
  isLoading,
}) {
  return (
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
              onChange={(e) => onTrackingCarrierChange(e.target.value)}
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
              onChange={(e) => onTrackingNumberChange(e.target.value)}
              placeholder="Enter tracking number"
              className="mt-1"
            />
          </div>
        </div>
        <div className="mt-4 flex gap-2">
          <Button onClick={onSubmit} disabled={isLoading}>
            {isLoading ? (
              <Loader2 className="mr-1 h-4 w-4 animate-spin" />
            ) : (
              <Truck className="mr-1 h-4 w-4" />
            )}
            Mark as Shipped
          </Button>
          <Button variant="outline" onClick={onCancel}>
            Cancel
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

/**
 * Tracking info display card
 * Server component - displays tracking information
 */
export function OrderTrackingInfo({
  trackingNumber,
  trackingCarrier,
  onCopy,
  trackingUrl,
}) {
  return (
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
          <Button variant="outline" size="sm" onClick={onCopy}>
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
          </Button>
          {trackingUrl && (
            <a href={trackingUrl} target="_blank" rel="noopener noreferrer">
              <Button variant="outline" size="sm">
                <svg className="mr-1 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
                Track
              </Button>
            </a>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
