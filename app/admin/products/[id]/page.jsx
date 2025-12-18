'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  ArrowLeft,
  Package,
  Save,
  Loader2,
  Trash2,
  DollarSign,
  Image as ImageIcon,
  FileText,
  AlertCircle,
  CheckCircle,
  Plus,
  X,
  GripVertical,
  Truck,
  Layers,
  Percent,
} from 'lucide-react';
import {
  ProductVariantsTab,
  ProductShippingTab,
  ProductPricingTab,
  ProductAddonsTab,
} from '@/components/admin/product-form';

export default function AdminProductEditPage({ params }) {
  const router = useRouter();
  const [isLoading, setIsLoading] = React.useState(true);
  const [isSaving, setIsSaving] = React.useState(false);
  const [isDeleting, setIsDeleting] = React.useState(false);
  const [error, setError] = React.useState(null);
  const [success, setSuccess] = React.useState(null);
  const [isNew, setIsNew] = React.useState(false);
  const [activeTab, setActiveTab] = React.useState('basic');

  const [product, setProduct] = React.useState({
    name: '',
    title: '',
    slug: '',
    description: '',
    category: '',
    base_price: '',
    compare_price: '',
    sku: '',
    image_url: '',
    gallery_images: [],
    is_active: true,
    is_featured: false,
    meta_title: '',
    meta_description: '',
    sizes: [],
    materials: [],
    finishings: [],
    lead_times: [],
    shipping_weight: '',
    shipping_dimensions: { length: '', width: '', height: '' },
    free_shipping_threshold: '',
    tier_pricing: [],
    addons: [],
    badges: [],
    specs: '',
  });

  React.useEffect(() => {
    async function fetchProduct() {
      const { id } = await params;
      if (id === 'new') {
        setIsNew(true);
        setProduct((prev) => ({
          ...prev,
          sizes: [{ id: 'default', label: 'Standard', price: 0 }],
          materials: [{ id: 'standard', label: 'Standard Material', price: 0, description: '' }],
          lead_times: [
            { id: 'standard', label: 'Standard (5-7 days)', price: 0, days: 7 },
            { id: 'rush', label: 'Rush (2-3 days)', price: 25, days: 3 },
          ],
          tier_pricing: [
            { minQty: 1, maxQty: 4, discount: 0 },
            { minQty: 5, maxQty: 9, discount: 10 },
            { minQty: 10, maxQty: null, discount: 15 },
          ],
        }));
        setIsLoading(false);
        return;
      }
      const supabase = createClient();
      const { data, error } = await supabase.from('products').select('*').eq('id', id).single();
      if (error || !data) {
        setError('Product not found');
        setIsLoading(false);
        return;
      }
      setProduct({
        name: data.name || '',
        title: data.title || '',
        slug: data.slug || '',
        description: data.description || '',
        category: data.category || '',
        base_price: data.base_price?.toString() || '',
        compare_price: data.compare_price?.toString() || '',
        sku: data.sku || '',
        image_url: data.image_url || '',
        gallery_images: data.gallery_images || [],
        is_active: data.is_active ?? true,
        is_featured: data.is_featured ?? false,
        meta_title: data.meta_title || '',
        meta_description: data.meta_description || '',
        sizes: data.sizes || [],
        materials: data.materials || [],
        finishings: data.finishings || [],
        lead_times: data.lead_times || [],
        shipping_weight: data.shipping_weight?.toString() || '',
        shipping_dimensions: data.shipping_dimensions || { length: '', width: '', height: '' },
        free_shipping_threshold: data.free_shipping_threshold?.toString() || '',
        tier_pricing: data.tier_pricing || [],
        addons: data.addons || [],
        badges: data.badges || [],
        specs: data.specs || '',
      });
      setIsLoading(false);
    }
    fetchProduct();
  }, [params]);

  const generateSlug = (name) =>
    name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  const handleNameChange = (e) => {
    const name = e.target.value;
    setProduct({ ...product, name, slug: product.slug || generateSlug(name) });
  };

  const handleSave = async () => {
    setIsSaving(true);
    setError(null);
    setSuccess(null);
    if (!product.name || !product.base_price) {
      setError('Name and base price are required');
      setIsSaving(false);
      return;
    }
    try {
      const supabase = createClient();
      const { id } = await params;
      const productData = {
        name: product.name,
        title: product.title?.trim() || product.name,
        slug: product.slug || generateSlug(product.name),
        description: product.description || null,
        category: product.category || null,
        base_price: parseFloat(product.base_price),
        compare_price: product.compare_price ? parseFloat(product.compare_price) : null,
        sku: product.sku || null,
        image_url: product.image_url || null,
        gallery_images: product.gallery_images,
        is_active: product.is_active,
        is_featured: product.is_featured,
        meta_title: product.meta_title || null,
        meta_description: product.meta_description || null,
        sizes: product.sizes,
        materials: product.materials,
        finishings: product.finishings,
        lead_times: product.lead_times,
        shipping_weight: product.shipping_weight ? parseFloat(product.shipping_weight) : null,
        shipping_dimensions: product.shipping_dimensions,
        free_shipping_threshold: product.free_shipping_threshold
          ? parseFloat(product.free_shipping_threshold)
          : null,
        tier_pricing: product.tier_pricing,
        addons: product.addons,
        badges: product.badges,
        specs: product.specs || null,
        updated_at: new Date().toISOString(),
      };
      if (isNew) {
        const { data, error } = await supabase
          .from('products')
          .insert(productData)
          .select()
          .single();
        if (error) throw error;
        setSuccess('Product created successfully');
        setTimeout(() => router.push(`/admin/products/${data.id}`), 1500);
      } else {
        const { error } = await supabase.from('products').update(productData).eq('id', id);
        if (error) throw error;
        setSuccess('Product updated successfully');
        setTimeout(() => setSuccess(null), 3000);
      }
    } catch (err) {
      setError(err.message || 'Failed to save product');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this product?')) return;
    setIsDeleting(true);
    try {
      const supabase = createClient();
      const { id } = await params;
      const { error } = await supabase.from('products').delete().eq('id', id);
      if (error) throw error;
      router.push('/admin/products');
    } catch (err) {
      setError(err.message || 'Failed to delete');
      setIsDeleting(false);
    }
  };

  const addArrayItem = (field, defaultItem) => {
    setProduct((prev) => ({
      ...prev,
      [field]: [...prev[field], { ...defaultItem, id: `${field}-${Date.now()}` }],
    }));
  };
  const updateArrayItem = (field, index, updates) => {
    setProduct((prev) => ({
      ...prev,
      [field]: prev[field].map((item, i) => (i === index ? { ...item, ...updates } : item)),
    }));
  };
  const removeArrayItem = (field, index) => {
    setProduct((prev) => ({ ...prev, [field]: prev[field].filter((_, i) => i !== index) }));
  };

  if (isLoading)
    return (
      <div className="flex items-center justify-center py-16">
        <Loader2 className="h-8 w-8 animate-spin text-emerald-600" />
      </div>
    );

  const tabs = [
    { id: 'basic', label: 'Basic Info', icon: Package },
    { id: 'variants', label: 'Variants & Options', icon: Layers },
    { id: 'shipping', label: 'Shipping & Lead Times', icon: Truck },
    { id: 'pricing', label: 'Pricing Tiers', icon: Percent },
    { id: 'addons', label: 'Add-ons', icon: Plus },
    { id: 'seo', label: 'SEO', icon: FileText },
  ];

  return (
    <div className="min-w-0">
      <div className="mb-6 space-y-4">
        <Link
          href="/admin/products"
          className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-emerald-600"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Products
        </Link>
        <div>
          <h1 className="text-xl font-bold text-gray-900">
            {isNew ? 'Add New Product' : 'Edit Product'}
          </h1>
          <p className="text-sm text-muted-foreground">
            {isNew ? 'Create a new product' : 'Update product details'}
          </p>
        </div>
        <div className="flex gap-2">
          {!isNew && (
            <Button
              variant="outline"
              onClick={handleDelete}
              disabled={isDeleting}
              className="flex-1 text-red-600 hover:bg-red-50"
            >
              {isDeleting ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Trash2 className="mr-2 h-4 w-4" />
              )}
              Delete
            </Button>
          )}
          <Button onClick={handleSave} disabled={isSaving} className="flex-1">
            {isSaving ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                {isNew ? 'Create' : 'Save'}
              </>
            )}
          </Button>
        </div>
      </div>

      {error && (
        <div className="mb-6 flex items-center gap-2 rounded-lg bg-red-50 p-4 text-red-700">
          <AlertCircle className="h-5 w-5" />
          {error}
        </div>
      )}
      {success && (
        <div className="mb-6 flex items-center gap-2 rounded-lg bg-emerald-50 p-4 text-emerald-700">
          <CheckCircle className="h-5 w-5" />
          {success}
        </div>
      )}

      <div className="mb-6 flex flex-wrap gap-2 border-b">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 border-b-2 px-4 py-3 text-sm font-medium transition-colors ${activeTab === tab.id ? 'border-emerald-600 text-emerald-600' : 'border-transparent text-gray-600 hover:border-gray-300'}`}
            >
              <Icon className="h-4 w-4" />
              {tab.label}
            </button>
          );
        })}
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          {activeTab === 'basic' && (
            <>
              <Card>
                <CardHeader>
                  <CardTitle>Basic Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="name">Product Name *</Label>
                    <Input
                      id="name"
                      value={product.name}
                      onChange={handleNameChange}
                      placeholder="e.g., PVC Banner"
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="title">Display Title</Label>
                    <Input
                      id="title"
                      value={product.title}
                      onChange={(e) => setProduct({ ...product, title: e.target.value })}
                      placeholder="e.g., Premium PVC Banner - Weather Resistant"
                      className="mt-1"
                    />
                    <p className="mt-1 text-xs text-gray-500">
                      Optional display title (defaults to name if empty)
                    </p>
                  </div>
                  <div>
                    <Label htmlFor="slug">URL Slug</Label>
                    <Input
                      id="slug"
                      value={product.slug}
                      onChange={(e) => setProduct({ ...product, slug: e.target.value })}
                      placeholder="pvc-banner"
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="description">Description</Label>
                    <textarea
                      id="description"
                      value={product.description}
                      onChange={(e) => setProduct({ ...product, description: e.target.value })}
                      placeholder="Describe your product..."
                      rows={4}
                      className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                    />
                  </div>
                  <div>
                    <Label htmlFor="specs">Specifications</Label>
                    <textarea
                      id="specs"
                      value={product.specs}
                      onChange={(e) => setProduct({ ...product, specs: e.target.value })}
                      placeholder="Product specifications (dimensions, weight, materials, etc.)"
                      rows={3}
                      className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                    />
                  </div>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <Label htmlFor="category">Category</Label>
                      <Input
                        id="category"
                        value={product.category}
                        onChange={(e) => setProduct({ ...product, category: e.target.value })}
                        placeholder="e.g., pvc-banners"
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="sku">SKU</Label>
                      <Input
                        id="sku"
                        value={product.sku}
                        onChange={(e) => setProduct({ ...product, sku: e.target.value })}
                        placeholder="e.g., BNR-PVC-001"
                        className="mt-1"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Base Pricing</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <Label htmlFor="base_price">Base Price (CAD) *</Label>
                      <div className="relative mt-1">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
                          $
                        </span>
                        <Input
                          id="base_price"
                          type="number"
                          step="0.01"
                          min="0"
                          value={product.base_price}
                          onChange={(e) => setProduct({ ...product, base_price: e.target.value })}
                          placeholder="0.00"
                          className="pl-7"
                        />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="compare_price">Compare at Price</Label>
                      <div className="relative mt-1">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
                          $
                        </span>
                        <Input
                          id="compare_price"
                          type="number"
                          step="0.01"
                          min="0"
                          value={product.compare_price}
                          onChange={(e) =>
                            setProduct({ ...product, compare_price: e.target.value })
                          }
                          placeholder="0.00"
                          className="pl-7"
                        />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>Badges</CardTitle>
                      <CardDescription>Product badges (e.g., "Best Seller", "New")</CardDescription>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => addArrayItem('badges', { label: '', color: 'emerald' })}
                    >
                      <Plus className="mr-1 h-4 w-4" />
                      Add Badge
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  {product.badges.length === 0 ? (
                    <p className="text-center text-sm text-gray-500 py-4">No badges defined</p>
                  ) : (
                    <div className="space-y-3">
                      {product.badges.map((badge, index) => (
                        <div
                          key={badge.id || index}
                          className="flex items-center gap-3 rounded-lg border p-3"
                        >
                          <Input
                            value={badge.label}
                            onChange={(e) =>
                              updateArrayItem('badges', index, { label: e.target.value })
                            }
                            placeholder="Badge label (e.g., Best Seller)"
                            className="flex-1"
                          />
                          <select
                            value={badge.color || 'emerald'}
                            onChange={(e) =>
                              updateArrayItem('badges', index, { color: e.target.value })
                            }
                            className="rounded-md border border-gray-300 px-3 py-2 text-sm"
                          >
                            <option value="emerald">Green</option>
                            <option value="blue">Blue</option>
                            <option value="red">Red</option>
                            <option value="yellow">Yellow</option>
                            <option value="purple">Purple</option>
                            <option value="gray">Gray</option>
                          </select>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeArrayItem('badges', index)}
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
            </>
          )}

          {activeTab === 'variants' && (
            <ProductVariantsTab
              product={product}
              onAddItem={addArrayItem}
              onUpdateItem={updateArrayItem}
              onRemoveItem={removeArrayItem}
            />
          )}

          {activeTab === 'shipping' && (
            <ProductShippingTab
              product={product}
              onProductUpdate={(updates) => setProduct({ ...product, ...updates })}
              onAddItem={addArrayItem}
              onUpdateItem={updateArrayItem}
              onRemoveItem={removeArrayItem}
            />
          )}

          {activeTab === 'pricing' && (
            <ProductPricingTab
              product={product}
              onAddItem={addArrayItem}
              onUpdateItem={updateArrayItem}
              onRemoveItem={removeArrayItem}
            />
          )}

          {activeTab === 'addons' && (
            <ProductAddonsTab
              product={product}
              onAddItem={addArrayItem}
              onUpdateItem={updateArrayItem}
              onRemoveItem={removeArrayItem}
            />
          )}

          {activeTab === 'seo' && (
            <Card>
              <CardHeader>
                <CardTitle>Search Engine Optimization</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="meta_title">Meta Title</Label>
                  <Input
                    id="meta_title"
                    value={product.meta_title}
                    onChange={(e) => setProduct({ ...product, meta_title: e.target.value })}
                    placeholder="SEO title"
                    className="mt-1"
                  />
                  <p className="mt-1 text-xs text-gray-500">
                    {product.meta_title.length}/60 characters
                  </p>
                </div>
                <div>
                  <Label htmlFor="meta_description">Meta Description</Label>
                  <textarea
                    id="meta_description"
                    value={product.meta_description}
                    onChange={(e) => setProduct({ ...product, meta_description: e.target.value })}
                    placeholder="Brief description for search results..."
                    rows={3}
                    className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                  />
                  <p className="mt-1 text-xs text-gray-500">
                    {product.meta_description.length}/160 characters
                  </p>
                </div>
                <div className="rounded-lg border bg-gray-50 p-4">
                  <p className="text-xs font-medium text-gray-500 mb-2">Search Preview</p>
                  <div className="text-blue-600 text-lg hover:underline cursor-pointer">
                    {product.meta_title || product.name || 'Product Title'}
                  </div>
                  <div className="text-emerald-700 text-sm">
                    bannerdirect.ca/product/{product.slug || 'product-slug'}
                  </div>
                  <div className="text-gray-600 text-sm mt-1">
                    {product.meta_description ||
                      product.description?.slice(0, 160) ||
                      'Product description...'}
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Status</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={product.is_active}
                  onChange={(e) => setProduct({ ...product, is_active: e.target.checked })}
                  className="h-4 w-4 rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
                />
                <div>
                  <p className="font-medium text-gray-900">Active</p>
                  <p className="text-sm text-gray-500">Visible on storefront</p>
                </div>
              </label>
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={product.is_featured}
                  onChange={(e) => setProduct({ ...product, is_featured: e.target.checked })}
                  className="h-4 w-4 rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
                />
                <div>
                  <p className="font-medium text-gray-900">Featured</p>
                  <p className="text-sm text-gray-500">Show on homepage</p>
                </div>
              </label>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Product Image</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="aspect-video rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 mb-4 overflow-hidden">
                {product.image_url ? (
                  <img
                    src={product.image_url}
                    alt="Product preview"
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center">
                    <ImageIcon className="h-12 w-12 text-gray-300" />
                  </div>
                )}
              </div>
              <div>
                <Label htmlFor="image_url">Image URL</Label>
                <Input
                  id="image_url"
                  value={product.image_url}
                  onChange={(e) => setProduct({ ...product, image_url: e.target.value })}
                  placeholder="https://..."
                  className="mt-1"
                />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
