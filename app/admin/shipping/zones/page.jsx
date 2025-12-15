'use client';

import * as React from 'react';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  MapPin,
  Plus,
  Save,
  Loader2,
  Trash2,
  AlertCircle,
  CheckCircle,
  X,
  Edit2,
  Globe,
} from 'lucide-react';

export default function AdminShippingZonesPage() {
  const [zones, setZones] = React.useState([
    {
      id: '1',
      name: 'Canada - Standard',
      countries: ['CA'],
      provinces: [],
      rate_type: 'flat',
      flat_rate: 12.99,
      free_threshold: 150,
      is_active: true,
    },
    {
      id: '2',
      name: 'Ontario - Local',
      countries: ['CA'],
      provinces: ['ON'],
      rate_type: 'flat',
      flat_rate: 9.99,
      free_threshold: 100,
      is_active: true,
    },
    {
      id: '3',
      name: 'USA',
      countries: ['US'],
      provinces: [],
      rate_type: 'flat',
      flat_rate: 24.99,
      free_threshold: 250,
      is_active: false,
    },
  ]);
  const [editingZone, setEditingZone] = React.useState(null);
  const [isSaving, setIsSaving] = React.useState(false);
  const [success, setSuccess] = React.useState(null);

  const handleSave = async () => {
    setIsSaving(true);
    // Simulate save
    await new Promise((r) => setTimeout(r, 1000));
    setSuccess('Shipping zones saved successfully');
    setIsSaving(false);
    setTimeout(() => setSuccess(null), 3000);
  };

  const addZone = () => {
    const newZone = {
      id: `zone-${Date.now()}`,
      name: 'New Zone',
      countries: [],
      provinces: [],
      rate_type: 'flat',
      flat_rate: 0,
      free_threshold: 0,
      is_active: true,
    };
    setZones([...zones, newZone]);
    setEditingZone(newZone.id);
  };

  const updateZone = (id, updates) => {
    setZones(zones.map((z) => (z.id === id ? { ...z, ...updates } : z)));
  };

  const removeZone = (id) => {
    if (confirm('Delete this shipping zone?')) {
      setZones(zones.filter((z) => z.id !== id));
    }
  };

  return (
    <div className="min-w-0">
      <div className="mb-6 space-y-4">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Shipping Zones</h1>
          <p className="text-sm text-muted-foreground">Define shipping regions and rates</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={addZone} className="flex-1">
            <Plus className="mr-2 h-4 w-4" />
            Add Zone
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
        {zones.map((zone) => (
          <Card key={zone.id} className={!zone.is_active ? 'opacity-60' : ''}>
            <CardContent className="p-6">
              {editingZone === zone.id ? (
                <div className="space-y-4">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <Label>Zone Name</Label>
                      <Input
                        value={zone.name}
                        onChange={(e) => updateZone(zone.id, { name: e.target.value })}
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label>Countries (comma separated)</Label>
                      <Input
                        value={zone.countries.join(', ')}
                        onChange={(e) =>
                          updateZone(zone.id, {
                            countries: e.target.value
                              .split(',')
                              .map((c) => c.trim())
                              .filter(Boolean),
                          })
                        }
                        placeholder="CA, US"
                        className="mt-1"
                      />
                    </div>
                  </div>
                  <div className="grid gap-4 sm:grid-cols-3">
                    <div>
                      <Label>Provinces/States (optional)</Label>
                      <Input
                        value={zone.provinces.join(', ')}
                        onChange={(e) =>
                          updateZone(zone.id, {
                            provinces: e.target.value
                              .split(',')
                              .map((p) => p.trim())
                              .filter(Boolean),
                          })
                        }
                        placeholder="ON, BC, QC"
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label>Flat Rate ($)</Label>
                      <Input
                        type="number"
                        step="0.01"
                        value={zone.flat_rate}
                        onChange={(e) =>
                          updateZone(zone.id, { flat_rate: parseFloat(e.target.value) || 0 })
                        }
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label>Free Shipping Above ($)</Label>
                      <Input
                        type="number"
                        step="0.01"
                        value={zone.free_threshold}
                        onChange={(e) =>
                          updateZone(zone.id, { free_threshold: parseFloat(e.target.value) || 0 })
                        }
                        className="mt-1"
                      />
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={zone.is_active}
                        onChange={(e) => updateZone(zone.id, { is_active: e.target.checked })}
                        className="h-4 w-4 rounded border-gray-300 text-emerald-600"
                      />
                      <span className="text-sm">Active</span>
                    </label>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => removeZone(zone.id)}
                        className="text-red-600"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                      <Button size="sm" onClick={() => setEditingZone(null)}>
                        Done
                      </Button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-100">
                      <Globe className="h-5 w-5 text-emerald-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{zone.name}</h3>
                      <p className="text-sm text-gray-500">
                        {zone.countries.join(', ')}
                        {zone.provinces.length > 0 && ` (${zone.provinces.join(', ')})`}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p className="font-semibold">${zone.flat_rate.toFixed(2)}</p>
                      <p className="text-xs text-gray-500">Free over ${zone.free_threshold}</p>
                    </div>
                    <Button variant="ghost" size="sm" onClick={() => setEditingZone(zone.id)}>
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
