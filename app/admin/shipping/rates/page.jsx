'use client';

import * as React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  DollarSign,
  Plus,
  Save,
  Loader2,
  Trash2,
  CheckCircle,
  X,
  Edit2,
  Package,
  Truck,
} from 'lucide-react';

export default function AdminShippingRatesPage() {
  const [rates, setRates] = React.useState([
    {
      id: '1',
      name: 'Standard Shipping',
      description: '5-7 business days',
      base_rate: 12.99,
      per_item_rate: 2.0,
      weight_rate: 0.5,
      is_default: true,
      is_active: true,
    },
    {
      id: '2',
      name: 'Express Shipping',
      description: '2-3 business days',
      base_rate: 24.99,
      per_item_rate: 3.0,
      weight_rate: 0.75,
      is_default: false,
      is_active: true,
    },
    {
      id: '3',
      name: 'Same Day (Toronto)',
      description: 'Same day delivery',
      base_rate: 49.99,
      per_item_rate: 5.0,
      weight_rate: 1.0,
      is_default: false,
      is_active: true,
    },
    {
      id: '4',
      name: 'Local Pickup',
      description: 'Free - Toronto location',
      base_rate: 0,
      per_item_rate: 0,
      weight_rate: 0,
      is_default: false,
      is_active: true,
    },
  ]);
  const [editingRate, setEditingRate] = React.useState(null);
  const [isSaving, setIsSaving] = React.useState(false);
  const [success, setSuccess] = React.useState(null);

  const handleSave = async () => {
    setIsSaving(true);
    await new Promise((r) => setTimeout(r, 1000));
    setSuccess('Shipping rates saved successfully');
    setIsSaving(false);
    setTimeout(() => setSuccess(null), 3000);
  };

  const addRate = () => {
    const newRate = {
      id: `rate-${Date.now()}`,
      name: 'New Rate',
      description: '',
      base_rate: 0,
      per_item_rate: 0,
      weight_rate: 0,
      is_default: false,
      is_active: true,
    };
    setRates([...rates, newRate]);
    setEditingRate(newRate.id);
  };

  const updateRate = (id, updates) => {
    setRates(
      rates.map((r) => {
        if (r.id === id) return { ...r, ...updates };
        if (updates.is_default && r.is_default) return { ...r, is_default: false };
        return r;
      })
    );
  };

  const removeRate = (id) => {
    if (confirm('Delete this shipping rate?')) {
      setRates(rates.filter((r) => r.id !== id));
    }
  };

  return (
    <div className="min-w-0">
      <div className="mb-6 space-y-4">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Shipping Rates</h1>
          <p className="text-sm text-muted-foreground">Configure shipping methods and pricing</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={addRate} className="flex-1">
            <Plus className="mr-2 h-4 w-4" />
            Add Rate
          </Button>
          <Button onClick={handleSave} disabled={isSaving} className="flex-1">
            {isSaving ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                Save
              </>
            )}
          </Button>
        </div>
      </div>

      {success && (
        <div className="mb-6 flex items-center gap-2 rounded-lg bg-emerald-50 p-4 text-emerald-700">
          <CheckCircle className="h-5 w-5" />
          {success}
        </div>
      )}

      <div className="space-y-4">
        {rates.map((rate) => (
          <Card key={rate.id} className={!rate.is_active ? 'opacity-60' : ''}>
            <CardContent className="p-6">
              {editingRate === rate.id ? (
                <div className="space-y-4">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <Label>Rate Name</Label>
                      <Input
                        value={rate.name}
                        onChange={(e) => updateRate(rate.id, { name: e.target.value })}
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label>Description</Label>
                      <Input
                        value={rate.description}
                        onChange={(e) => updateRate(rate.id, { description: e.target.value })}
                        placeholder="e.g., 5-7 business days"
                        className="mt-1"
                      />
                    </div>
                  </div>
                  <div className="grid gap-4 sm:grid-cols-3">
                    <div>
                      <Label>Base Rate ($)</Label>
                      <Input
                        type="number"
                        step="0.01"
                        value={rate.base_rate}
                        onChange={(e) =>
                          updateRate(rate.id, { base_rate: parseFloat(e.target.value) || 0 })
                        }
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label>Per Item Rate ($)</Label>
                      <Input
                        type="number"
                        step="0.01"
                        value={rate.per_item_rate}
                        onChange={(e) =>
                          updateRate(rate.id, { per_item_rate: parseFloat(e.target.value) || 0 })
                        }
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label>Per lb Rate ($)</Label>
                      <Input
                        type="number"
                        step="0.01"
                        value={rate.weight_rate}
                        onChange={(e) =>
                          updateRate(rate.id, { weight_rate: parseFloat(e.target.value) || 0 })
                        }
                        className="mt-1"
                      />
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex gap-4">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={rate.is_active}
                          onChange={(e) => updateRate(rate.id, { is_active: e.target.checked })}
                          className="h-4 w-4 rounded border-gray-300 text-emerald-600"
                        />
                        <span className="text-sm">Active</span>
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={rate.is_default}
                          onChange={(e) => updateRate(rate.id, { is_default: e.target.checked })}
                          className="h-4 w-4 rounded border-gray-300 text-emerald-600"
                        />
                        <span className="text-sm">Default</span>
                      </label>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => removeRate(rate.id)}
                        className="text-red-600"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                      <Button size="sm" onClick={() => setEditingRate(null)}>
                        Done
                      </Button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100">
                      <Truck className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-gray-900">{rate.name}</h3>
                        {rate.is_default && (
                          <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-medium text-emerald-700">
                            Default
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-gray-500">{rate.description}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right text-sm">
                      <p className="font-semibold">${rate.base_rate.toFixed(2)} base</p>
                      <p className="text-gray-500">
                        +${rate.per_item_rate.toFixed(2)}/item, +${rate.weight_rate.toFixed(2)}/lb
                      </p>
                    </div>
                    <Button variant="ghost" size="sm" onClick={() => setEditingRate(rate.id)}>
                      <Edit2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
