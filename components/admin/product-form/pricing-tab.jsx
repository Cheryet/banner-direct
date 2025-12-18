'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, X } from 'lucide-react';

/**
 * Tier Pricing editor
 */
export function ProductPricingTab({ product, onAddItem, onUpdateItem, onRemoveItem }) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Volume Discounts</CardTitle>
            <CardDescription>Set quantity-based pricing tiers</CardDescription>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onAddItem('tier_pricing', { minQty: 1, maxQty: null, discount: 0 })}
          >
            <Plus className="mr-1 h-4 w-4" />
            Add Tier
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {product.tier_pricing.length === 0 ? (
          <p className="text-center text-sm text-gray-500 py-4">No pricing tiers defined</p>
        ) : (
          <div className="space-y-3">
            {product.tier_pricing.map((tier, index) => (
              <div key={index} className="flex items-center gap-3 rounded-lg border p-3">
                <div className="flex items-center gap-2">
                  <Input
                    type="number"
                    min="1"
                    value={tier.minQty}
                    onChange={(e) =>
                      onUpdateItem('tier_pricing', index, {
                        minQty: parseInt(e.target.value) || 1,
                      })
                    }
                    className="w-20"
                    placeholder="Min"
                  />
                  <span className="text-gray-500">to</span>
                  <Input
                    type="number"
                    min="1"
                    value={tier.maxQty || ''}
                    onChange={(e) =>
                      onUpdateItem('tier_pricing', index, {
                        maxQty: e.target.value ? parseInt(e.target.value) : null,
                      })
                    }
                    className="w-20"
                    placeholder="∞"
                  />
                  <span className="text-gray-500">units</span>
                </div>
                <div className="flex items-center gap-2">
                  <Input
                    type="number"
                    min="0"
                    max="100"
                    value={tier.discount}
                    onChange={(e) =>
                      onUpdateItem('tier_pricing', index, {
                        discount: parseFloat(e.target.value) || 0,
                      })
                    }
                    className="w-20"
                  />
                  <span className="text-gray-500">% off</span>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onRemoveItem('tier_pricing', index)}
                  className="ml-auto text-red-600 hover:bg-red-50"
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
