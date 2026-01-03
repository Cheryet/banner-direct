'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { CurrencyInput } from '@/components/ui/currency-input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, X, GripVertical } from 'lucide-react';

/**
 * Sizes editor section
 */
function SizesEditor({ sizes, onAdd, onUpdate, onRemove }) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Sizes</CardTitle>
            <CardDescription>Define available size options</CardDescription>
          </div>
          <Button variant="outline" size="sm" onClick={onAdd}>
            <Plus className="mr-1 h-4 w-4" />
            Add Size
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {sizes.length === 0 ? (
          <p className="text-center text-sm text-gray-500 py-4">No sizes defined</p>
        ) : (
          <div className="space-y-3">
            {sizes.map((size, index) => (
              <div key={size.id || index} className="flex items-center gap-3 rounded-lg border p-3">
                <GripVertical className="h-4 w-4 text-gray-400" />
                <Input
                  value={size.label}
                  onChange={(e) => onUpdate(index, { label: e.target.value })}
                  placeholder="Size label (e.g., 3×6 ft)"
                  className="flex-1"
                />
                <div className="w-32">
                  <CurrencyInput
                    value={size.price?.toString() ?? ''}
                    onChange={(val) =>
                      onUpdate(index, { price: val === '' ? 0 : parseFloat(val) || 0 })
                    }
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
 * Materials editor section
 */
function MaterialsEditor({ materials, onAdd, onUpdate, onRemove }) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Materials</CardTitle>
            <CardDescription>Define material options with price modifiers</CardDescription>
          </div>
          <Button variant="outline" size="sm" onClick={onAdd}>
            <Plus className="mr-1 h-4 w-4" />
            Add Material
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {materials.length === 0 ? (
          <p className="text-center text-sm text-gray-500 py-4">No materials defined</p>
        ) : (
          <div className="space-y-3">
            {materials.map((material, index) => (
              <div key={material.id || index} className="rounded-lg border p-4">
                <div className="flex items-start gap-3">
                  <GripVertical className="mt-2 h-4 w-4 text-gray-400" />
                  <div className="flex-1 space-y-3">
                    <div className="flex gap-3">
                      <Input
                        value={material.label}
                        onChange={(e) => onUpdate(index, { label: e.target.value })}
                        placeholder="Material name"
                        className="flex-1"
                      />
                      <div className="w-32">
                        <CurrencyInput
                          value={material.price?.toString() ?? ''}
                          onChange={(val) =>
                            onUpdate(index, { price: val === '' ? 0 : parseFloat(val) || 0 })
                          }
                        />
                      </div>
                    </div>
                    <Input
                      value={material.description || ''}
                      onChange={(e) => onUpdate(index, { description: e.target.value })}
                      placeholder="Description (e.g., Best for outdoor use)"
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
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

/**
 * Finishings editor section
 */
function FinishingsEditor({ finishings, onAdd, onUpdate, onRemove }) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Finishing Options</CardTitle>
            <CardDescription>Optional add-on finishings</CardDescription>
          </div>
          <Button variant="outline" size="sm" onClick={onAdd}>
            <Plus className="mr-1 h-4 w-4" />
            Add Finishing
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {finishings.length === 0 ? (
          <p className="text-center text-sm text-gray-500 py-4">No finishings defined</p>
        ) : (
          <div className="space-y-3">
            {finishings.map((finishing, index) => (
              <div key={finishing.id || index} className="rounded-lg border p-4">
                <div className="flex items-start gap-3">
                  <GripVertical className="mt-2 h-4 w-4 text-gray-400" />
                  <div className="flex-1 space-y-3">
                    <div className="flex gap-3">
                      <Input
                        value={finishing.label}
                        onChange={(e) => onUpdate(index, { label: e.target.value })}
                        placeholder="Finishing name"
                        className="flex-1"
                      />
                      <div className="w-32">
                        <CurrencyInput
                          value={finishing.price?.toString() ?? ''}
                          onChange={(val) =>
                            onUpdate(index, { price: val === '' ? 0 : parseFloat(val) || 0 })
                          }
                        />
                      </div>
                    </div>
                    <Input
                      value={finishing.description || ''}
                      onChange={(e) => onUpdate(index, { description: e.target.value })}
                      placeholder="Description"
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
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

/**
 * Product Variants Tab - combines sizes, materials, and finishings editors
 */
export function ProductVariantsTab({ product, onAddItem, onUpdateItem, onRemoveItem }) {
  return (
    <>
      <SizesEditor
        sizes={product.sizes}
        onAdd={() => onAddItem('sizes', { label: '', price: 0 })}
        onUpdate={(index, updates) => onUpdateItem('sizes', index, updates)}
        onRemove={(index) => onRemoveItem('sizes', index)}
      />
      <MaterialsEditor
        materials={product.materials}
        onAdd={() => onAddItem('materials', { label: '', price: 0, description: '' })}
        onUpdate={(index, updates) => onUpdateItem('materials', index, updates)}
        onRemove={(index) => onRemoveItem('materials', index)}
      />
      <FinishingsEditor
        finishings={product.finishings}
        onAdd={() => onAddItem('finishings', { label: '', price: 0, description: '' })}
        onUpdate={(index, updates) => onUpdateItem('finishings', index, updates)}
        onRemove={(index) => onRemoveItem('finishings', index)}
      />
    </>
  );
}
