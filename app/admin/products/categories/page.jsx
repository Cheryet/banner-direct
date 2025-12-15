'use client';

import * as React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Tag,
  Plus,
  Save,
  Loader2,
  Trash2,
  CheckCircle,
  Edit2,
  GripVertical,
  FolderOpen,
} from 'lucide-react';

export default function AdminCategoriesPage() {
  const [categories, setCategories] = React.useState([
    {
      id: '1',
      name: 'PVC Banners',
      slug: 'pvc-banners',
      description: 'Durable vinyl banners for indoor and outdoor use',
      product_count: 4,
      is_active: true,
    },
    {
      id: '2',
      name: 'Mesh Banners',
      slug: 'mesh-banners',
      description: 'Wind-resistant mesh banners',
      product_count: 2,
      is_active: true,
    },
    {
      id: '3',
      name: 'Fabric Banners',
      slug: 'fabric-banners',
      description: 'Premium fabric banners',
      product_count: 3,
      is_active: true,
    },
    {
      id: '4',
      name: 'Retractable Banners',
      slug: 'retractable-banners',
      description: 'Pull-up banner stands',
      product_count: 2,
      is_active: true,
    },
    {
      id: '5',
      name: 'Yard Signs',
      slug: 'yard-signs',
      description: 'Corrugated plastic signs',
      product_count: 0,
      is_active: false,
    },
  ]);
  const [editingCat, setEditingCat] = React.useState(null);
  const [isSaving, setIsSaving] = React.useState(false);
  const [success, setSuccess] = React.useState(null);

  const handleSave = async () => {
    setIsSaving(true);
    await new Promise((r) => setTimeout(r, 1000));
    setSuccess('Categories saved successfully');
    setIsSaving(false);
    setTimeout(() => setSuccess(null), 3000);
  };

  const generateSlug = (name) =>
    name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');

  const addCategory = () => {
    const newCat = {
      id: `cat-${Date.now()}`,
      name: 'New Category',
      slug: 'new-category',
      description: '',
      product_count: 0,
      is_active: true,
    };
    setCategories([...categories, newCat]);
    setEditingCat(newCat.id);
  };

  const updateCategory = (id, updates) => {
    setCategories(categories.map((c) => (c.id === id ? { ...c, ...updates } : c)));
  };

  const removeCategory = (id) => {
    const cat = categories.find((c) => c.id === id);
    if (cat?.product_count > 0) {
      alert('Cannot delete a category with products. Move or delete the products first.');
      return;
    }
    if (confirm('Delete this category?')) {
      setCategories(categories.filter((c) => c.id !== id));
    }
  };

  return (
    <div className="min-w-0">
      <div className="mb-6 space-y-4">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Categories</h1>
          <p className="text-sm text-muted-foreground">Organize your products into categories</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={addCategory} className="flex-1">
            <Plus className="mr-2 h-4 w-4" />
            Add Category
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

      <div className="space-y-3">
        {categories.map((cat) => (
          <Card key={cat.id} className={!cat.is_active ? 'opacity-60' : ''}>
            <CardContent className="p-4">
              {editingCat === cat.id ? (
                <div className="space-y-4">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <Label>Category Name</Label>
                      <Input
                        value={cat.name}
                        onChange={(e) =>
                          updateCategory(cat.id, {
                            name: e.target.value,
                            slug: cat.slug || generateSlug(e.target.value),
                          })
                        }
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label>URL Slug</Label>
                      <Input
                        value={cat.slug}
                        onChange={(e) => updateCategory(cat.id, { slug: e.target.value })}
                        className="mt-1"
                      />
                    </div>
                  </div>
                  <div>
                    <Label>Description</Label>
                    <Input
                      value={cat.description}
                      onChange={(e) => updateCategory(cat.id, { description: e.target.value })}
                      placeholder="Brief description..."
                      className="mt-1"
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={cat.is_active}
                        onChange={(e) => updateCategory(cat.id, { is_active: e.target.checked })}
                        className="h-4 w-4 rounded border-gray-300 text-emerald-600"
                      />
                      <span className="text-sm">Active</span>
                    </label>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => removeCategory(cat.id)}
                        className="text-red-600"
                        disabled={cat.product_count > 0}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                      <Button size="sm" onClick={() => setEditingCat(null)}>
                        Done
                      </Button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <GripVertical className="h-5 w-5 text-gray-400 cursor-move" />
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-100">
                      <FolderOpen className="h-5 w-5 text-emerald-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{cat.name}</h3>
                      <p className="text-sm text-gray-500">{cat.description || 'No description'}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p className="font-semibold">{cat.product_count} products</p>
                      <p className="text-xs text-gray-500">/{cat.slug}</p>
                    </div>
                    <Button variant="ghost" size="sm" onClick={() => setEditingCat(cat.id)}>
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
