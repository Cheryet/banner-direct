'use client';

import * as React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Clock, Plus, Save, Loader2, Trash2, CheckCircle, Edit2, Zap } from 'lucide-react';

export default function AdminLeadTimesPage() {
  const [leadTimes, setLeadTimes] = React.useState([
    {
      id: '1',
      name: 'Standard',
      description: '5-7 business days',
      min_days: 5,
      max_days: 7,
      rush_fee: 0,
      is_default: true,
      is_active: true,
    },
    {
      id: '2',
      name: 'Rush',
      description: '2-3 business days',
      min_days: 2,
      max_days: 3,
      rush_fee: 25,
      is_default: false,
      is_active: true,
    },
    {
      id: '3',
      name: 'Same Day',
      description: 'Order by 10am for same day',
      min_days: 0,
      max_days: 1,
      rush_fee: 50,
      is_default: false,
      is_active: true,
    },
    {
      id: '4',
      name: 'Economy',
      description: '7-10 business days',
      min_days: 7,
      max_days: 10,
      rush_fee: -10,
      is_default: false,
      is_active: true,
    },
  ]);
  const [editingLT, setEditingLT] = React.useState(null);
  const [isSaving, setIsSaving] = React.useState(false);
  const [success, setSuccess] = React.useState(null);

  const handleSave = async () => {
    setIsSaving(true);
    await new Promise((r) => setTimeout(r, 1000));
    setSuccess('Lead times saved successfully');
    setIsSaving(false);
    setTimeout(() => setSuccess(null), 3000);
  };

  const addLeadTime = () => {
    const newLT = {
      id: `lt-${Date.now()}`,
      name: 'New Lead Time',
      description: '',
      min_days: 5,
      max_days: 7,
      rush_fee: 0,
      is_default: false,
      is_active: true,
    };
    setLeadTimes([...leadTimes, newLT]);
    setEditingLT(newLT.id);
  };

  const updateLeadTime = (id, updates) => {
    setLeadTimes(
      leadTimes.map((lt) => {
        if (lt.id === id) return { ...lt, ...updates };
        if (updates.is_default && lt.is_default) return { ...lt, is_default: false };
        return lt;
      })
    );
  };

  const removeLeadTime = (id) => {
    if (confirm('Delete this lead time option?')) {
      setLeadTimes(leadTimes.filter((lt) => lt.id !== id));
    }
  };

  return (
    <div className="min-w-0">
      <div className="mb-6 space-y-4">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Lead Times</h1>
          <p className="text-sm text-muted-foreground">Configure production turnaround options</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={addLeadTime} className="flex-1">
            <Plus className="mr-2 h-4 w-4" />
            Add Lead Time
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

      <Card className="mb-6">
        <CardContent className="p-4">
          <p className="text-sm text-gray-600">
            <strong>Note:</strong> Lead times defined here are the global defaults. You can override
            these per-product in the product editor.
          </p>
        </CardContent>
      </Card>

      <div className="space-y-4">
        {leadTimes.map((lt) => (
          <Card key={lt.id} className={!lt.is_active ? 'opacity-60' : ''}>
            <CardContent className="p-6">
              {editingLT === lt.id ? (
                <div className="space-y-4">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <Label>Name</Label>
                      <Input
                        value={lt.name}
                        onChange={(e) => updateLeadTime(lt.id, { name: e.target.value })}
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label>Description</Label>
                      <Input
                        value={lt.description}
                        onChange={(e) => updateLeadTime(lt.id, { description: e.target.value })}
                        placeholder="e.g., 5-7 business days"
                        className="mt-1"
                      />
                    </div>
                  </div>
                  <div className="grid gap-4 sm:grid-cols-3">
                    <div>
                      <Label>Min Days</Label>
                      <Input
                        type="number"
                        value={lt.min_days}
                        onChange={(e) =>
                          updateLeadTime(lt.id, { min_days: parseInt(e.target.value) || 0 })
                        }
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label>Max Days</Label>
                      <Input
                        type="number"
                        value={lt.max_days}
                        onChange={(e) =>
                          updateLeadTime(lt.id, { max_days: parseInt(e.target.value) || 0 })
                        }
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label>Rush Fee ($)</Label>
                      <Input
                        type="number"
                        step="0.01"
                        value={lt.rush_fee}
                        onChange={(e) =>
                          updateLeadTime(lt.id, { rush_fee: parseFloat(e.target.value) || 0 })
                        }
                        className="mt-1"
                      />
                      <p className="mt-1 text-xs text-gray-500">Use negative for discount</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex gap-4">
                      <Checkbox
                        checked={lt.is_active}
                        onCheckedChange={(checked) => updateLeadTime(lt.id, { is_active: checked })}
                        label="Active"
                      />
                      <Checkbox
                        checked={lt.is_default}
                        onCheckedChange={(checked) =>
                          updateLeadTime(lt.id, { is_default: checked })
                        }
                        label="Default"
                      />
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => removeLeadTime(lt.id)}
                        className="text-red-600"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                      <Button size="sm" onClick={() => setEditingLT(null)}>
                        Done
                      </Button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div
                      className={`flex h-10 w-10 items-center justify-center rounded-lg ${lt.rush_fee > 0 ? 'bg-orange-100' : lt.rush_fee < 0 ? 'bg-green-100' : 'bg-gray-100'}`}
                    >
                      {lt.rush_fee > 0 ? (
                        <Zap className="h-5 w-5 text-orange-600" />
                      ) : (
                        <Clock className="h-5 w-5 text-gray-600" />
                      )}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-gray-900">{lt.name}</h3>
                        {lt.is_default && (
                          <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-medium text-emerald-700">
                            Default
                          </span>
                        )}
                        {lt.rush_fee > 0 && (
                          <span className="rounded-full bg-orange-100 px-2 py-0.5 text-xs font-medium text-orange-700">
                            Rush
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-gray-500">{lt.description}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p className="font-semibold">
                        {lt.min_days}-{lt.max_days} days
                      </p>
                      <p
                        className={`text-sm ${lt.rush_fee > 0 ? 'text-orange-600' : lt.rush_fee < 0 ? 'text-green-600' : 'text-gray-500'}`}
                      >
                        {lt.rush_fee > 0
                          ? `+$${lt.rush_fee.toFixed(2)}`
                          : lt.rush_fee < 0
                            ? `-$${Math.abs(lt.rush_fee).toFixed(2)}`
                            : 'Included'}
                      </p>
                    </div>
                    <Button variant="ghost" size="sm" onClick={() => setEditingLT(lt.id)}>
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
