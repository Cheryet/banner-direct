'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, X, GripVertical } from 'lucide-react';

/**
 * Reusable array field editor for product variants
 * Handles add/edit/remove operations for array fields like sizes, materials, etc.
 * Client component - handles user interactions
 */
export function ArrayFieldEditor({
  title,
  description,
  items,
  onAdd,
  onUpdate,
  onRemove,
  renderItem,
  addButtonLabel = 'Add Item',
  emptyMessage = 'No items defined',
}) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>{title}</CardTitle>
            {description && <CardDescription>{description}</CardDescription>}
          </div>
          <Button variant="outline" size="sm" onClick={onAdd}>
            <Plus className="mr-1 h-4 w-4" />
            {addButtonLabel}
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {items.length === 0 ? (
          <p className="py-4 text-center text-sm text-gray-500">{emptyMessage}</p>
        ) : (
          <div className="space-y-3">
            {items.map((item, index) => (
              <div
                key={item.id || index}
                className="flex items-center gap-3 rounded-lg border p-3"
              >
                <GripVertical className="h-4 w-4 flex-shrink-0 cursor-grab text-gray-400" />
                <div className="flex-1">{renderItem(item, index, onUpdate)}</div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onRemove(index)}
                  className="flex-shrink-0 text-red-600 hover:bg-red-50"
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
 * Simple size/option field with label and price
 */
export function SizeFieldRow({ item, index, onUpdate }) {
  return (
    <div className="grid flex-1 gap-3 sm:grid-cols-2">
      <Input
        value={item.label || ''}
        onChange={(e) => onUpdate(index, { label: e.target.value })}
        placeholder="Size label (e.g., 2x4 ft)"
      />
      <div className="relative">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
        <Input
          type="number"
          step="0.01"
          min="0"
          value={item.price || ''}
          onChange={(e) => onUpdate(index, { price: parseFloat(e.target.value) || 0 })}
          placeholder="0.00"
          className="pl-7"
        />
      </div>
    </div>
  );
}

/**
 * Material field with label, price, and description
 */
export function MaterialFieldRow({ item, index, onUpdate }) {
  return (
    <div className="grid flex-1 gap-3 sm:grid-cols-3">
      <Input
        value={item.label || ''}
        onChange={(e) => onUpdate(index, { label: e.target.value })}
        placeholder="Material name"
      />
      <div className="relative">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
        <Input
          type="number"
          step="0.01"
          min="0"
          value={item.price || ''}
          onChange={(e) => onUpdate(index, { price: parseFloat(e.target.value) || 0 })}
          placeholder="0.00"
          className="pl-7"
        />
      </div>
      <Input
        value={item.description || ''}
        onChange={(e) => onUpdate(index, { description: e.target.value })}
        placeholder="Description (optional)"
      />
    </div>
  );
}

/**
 * Lead time field with label, price, and days
 */
export function LeadTimeFieldRow({ item, index, onUpdate }) {
  return (
    <div className="grid flex-1 gap-3 sm:grid-cols-3">
      <Input
        value={item.label || ''}
        onChange={(e) => onUpdate(index, { label: e.target.value })}
        placeholder="Lead time label"
      />
      <div className="relative">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
        <Input
          type="number"
          step="0.01"
          min="0"
          value={item.price || ''}
          onChange={(e) => onUpdate(index, { price: parseFloat(e.target.value) || 0 })}
          placeholder="Rush fee"
          className="pl-7"
        />
      </div>
      <Input
        type="number"
        min="1"
        value={item.days || ''}
        onChange={(e) => onUpdate(index, { days: parseInt(e.target.value) || 1 })}
        placeholder="Days"
      />
    </div>
  );
}
