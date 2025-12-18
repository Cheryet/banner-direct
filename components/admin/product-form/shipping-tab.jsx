'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, X, GripVertical } from 'lucide-react';

/**
 * Lead Times editor section
 */
function LeadTimesEditor({ leadTimes, onAdd, onUpdate, onRemove }) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Lead Times / Turnaround</CardTitle>
            <CardDescription>Define production and shipping timelines</CardDescription>
          </div>
          <Button variant="outline" size="sm" onClick={onAdd}>
            <Plus className="mr-1 h-4 w-4" />
            Add Lead Time
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {leadTimes.length === 0 ? (
          <p className="text-center text-sm text-gray-500 py-4">No lead times defined</p>
        ) : (
          <div className="space-y-3">
            {leadTimes.map((lt, index) => (
              <div key={lt.id || index} className="flex items-center gap-3 rounded-lg border p-3">
                <GripVertical className="h-4 w-4 text-gray-400" />
                <Input
                  value={lt.label}
                  onChange={(e) => onUpdate(index, { label: e.target.value })}
                  placeholder="Label (e.g., Standard 5-7 days)"
                  className="flex-1"
                />
                <div className="w-20">
                  <Input
                    type="number"
                    value={lt.days}
                    onChange={(e) => onUpdate(index, { days: parseInt(e.target.value) || 0 })}
                    placeholder="Days"
                  />
                </div>
                <div className="relative w-28">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                  <Input
                    type="number"
                    step="0.01"
                    value={lt.price}
                    onChange={(e) => onUpdate(index, { price: parseFloat(e.target.value) || 0 })}
                    placeholder="Fee"
                    className="pl-7"
                  />
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onRemove(index)}
                  className="text-red-600 hover:bg-red-50"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

/**
 * Shipping dimensions editor
 */
function ShippingDimensionsEditor({ product, onUpdate }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Shipping Details</CardTitle>
        <CardDescription>Weight and dimensions for shipping calculations</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label>Shipping Weight (lbs)</Label>
          <Input
            type="number"
            step="0.1"
            value={product.shipping_weight || ''}
            onChange={(e) => onUpdate({ shipping_weight: e.target.value })}
            placeholder="0.0"
            className="mt-1"
          />
        </div>
        <div>
          <Label>Package Dimensions (inches)</Label>
          <div className="mt-1 grid grid-cols-3 gap-2">
            <Input
              type="number"
              value={product.shipping_dimensions?.length || ''}
              onChange={(e) =>
                onUpdate({
                  shipping_dimensions: {
                    ...product.shipping_dimensions,
                    length: e.target.value,
                  },
                })
              }
              placeholder="Length"
            />
            <Input
              type="number"
              value={product.shipping_dimensions?.width || ''}
              onChange={(e) =>
                onUpdate({
                  shipping_dimensions: {
                    ...product.shipping_dimensions,
                    width: e.target.value,
                  },
                })
              }
              placeholder="Width"
            />
            <Input
              type="number"
              value={product.shipping_dimensions?.height || ''}
              onChange={(e) =>
                onUpdate({
                  shipping_dimensions: {
                    ...product.shipping_dimensions,
                    height: e.target.value,
                  },
                })
              }
              placeholder="Height"
            />
          </div>
        </div>
        <div>
          <Label>Free Shipping Threshold (CAD)</Label>
          <div className="relative mt-1">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
            <Input
              type="number"
              step="0.01"
              value={product.free_shipping_threshold || ''}
              onChange={(e) => onUpdate({ free_shipping_threshold: e.target.value })}
              placeholder="0.00"
              className="pl-7"
            />
          </div>
          <p className="mt-1 text-xs text-gray-500">
            Orders above this amount qualify for free shipping
          </p>
        </div>
      </CardContent>
    </Card>
  );
}

/**
 * Product Shipping Tab - combines lead times and shipping details
 */
export function ProductShippingTab({
  product,
  onProductUpdate,
  onAddItem,
  onUpdateItem,
  onRemoveItem,
}) {
  return (
    <>
      <LeadTimesEditor
        leadTimes={product.lead_times}
        onAdd={() => onAddItem('lead_times', { label: '', price: 0, days: 5 })}
        onUpdate={(index, updates) => onUpdateItem('lead_times', index, updates)}
        onRemove={(index) => onRemoveItem('lead_times', index)}
      />
      <ShippingDimensionsEditor product={product} onUpdate={onProductUpdate} />
    </>
  );
}
