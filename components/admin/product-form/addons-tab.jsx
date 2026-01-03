'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { CurrencyInput } from '@/components/ui/currency-input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, X, GripVertical } from 'lucide-react';

/**
 * Product Add-ons Tab
 */
export function ProductAddonsTab({ product, onAddItem, onUpdateItem, onRemoveItem }) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Product Add-ons</CardTitle>
            <CardDescription>Optional extras customers can add to their order</CardDescription>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onAddItem('addons', { label: '', price: 0, description: '' })}
          >
            <Plus className="mr-1 h-4 w-4" />
            Add Add-on
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {product.addons.length === 0 ? (
          <p className="text-center text-sm text-gray-500 py-4">No add-ons defined</p>
        ) : (
          <div className="space-y-3">
            {product.addons.map((addon, index) => (
              <div key={addon.id || index} className="rounded-lg border p-4">
                <div className="flex items-start gap-3">
                  <GripVertical className="mt-2 h-4 w-4 text-gray-400" />
                  <div className="flex-1 space-y-3">
                    <div className="flex gap-3">
                      <Input
                        value={addon.label}
                        onChange={(e) => onUpdateItem('addons', index, { label: e.target.value })}
                        placeholder="Add-on name"
                        className="flex-1"
                      />
                      <div className="w-32">
                        <CurrencyInput
                          value={addon.price?.toString() ?? ''}
                          onChange={(val) =>
                            onUpdateItem('addons', index, {
                              price: val === '' ? 0 : parseFloat(val) || 0,
                            })
                          }
                        />
                      </div>
                    </div>
                    <Input
                      value={addon.description || ''}
                      onChange={(e) =>
                        onUpdateItem('addons', index, { description: e.target.value })
                      }
                      placeholder="Description"
                    />
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onRemoveItem('addons', index)}
                    className="text-red-600 hover:bg-red-50"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
