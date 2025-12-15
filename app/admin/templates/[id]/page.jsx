'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  ArrowLeft,
  Layers,
  Save,
  Loader2,
  Trash2,
  Image as ImageIcon,
  AlertCircle,
  CheckCircle,
  Plus,
  X,
} from 'lucide-react';

export default function AdminTemplateEditPage({ params }) {
  const router = useRouter();
  const [isLoading, setIsLoading] = React.useState(true);
  const [isSaving, setIsSaving] = React.useState(false);
  const [isDeleting, setIsDeleting] = React.useState(false);
  const [error, setError] = React.useState(null);
  const [success, setSuccess] = React.useState(null);
  const [isNew, setIsNew] = React.useState(false);

  const [template, setTemplate] = React.useState({
    title: '',
    slug: '',
    description: '',
    category: '',
    thumbnail_url: '',
    preview_url: '',
    file_url: '',
    is_active: true,
    is_premium: false,
    price: '',
    compatible_products: [],
    tags: [],
  });

  React.useEffect(() => {
    async function fetchTemplate() {
      const { id } = await params;
      if (id === 'new') {
        setIsNew(true);
        setIsLoading(false);
        return;
      }
      const supabase = createClient();
      const { data, error } = await supabase.from('templates').select('*').eq('id', id).single();
      if (error || !data) {
        setError('Template not found');
        setIsLoading(false);
        return;
      }
      setTemplate({
        title: data.title || '',
        slug: data.slug || '',
        description: data.description || '',
        category: data.category || '',
        thumbnail_url: data.thumbnail_url || '',
        preview_url: data.preview_url || '',
        file_url: data.file_url || '',
        is_active: data.is_active ?? true,
        is_premium: data.is_premium ?? false,
        price: data.price?.toString() || '',
        compatible_products: data.compatible_products || [],
        tags: data.tags || [],
      });
      setIsLoading(false);
    }
    fetchTemplate();
  }, [params]);

  const generateSlug = (title) =>
    title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');

  const handleSave = async () => {
    setIsSaving(true);
    setError(null);
    setSuccess(null);
    if (!template.title) {
      setError('Title is required');
      setIsSaving(false);
      return;
    }
    try {
      const supabase = createClient();
      const { id } = await params;
      const templateData = {
        title: template.title,
        slug: template.slug || generateSlug(template.title),
        description: template.description || null,
        category: template.category || null,
        thumbnail_url: template.thumbnail_url || null,
        preview_url: template.preview_url || null,
        file_url: template.file_url || null,
        is_active: template.is_active,
        is_premium: template.is_premium,
        price: template.price ? parseFloat(template.price) : null,
        compatible_products: template.compatible_products,
        tags: template.tags,
        updated_at: new Date().toISOString(),
      };
      if (isNew) {
        const { data, error } = await supabase
          .from('templates')
          .insert(templateData)
          .select()
          .single();
        if (error) throw error;
        setSuccess('Template created successfully');
        setTimeout(() => router.push(`/admin/templates/${data.id}`), 1500);
      } else {
        const { error } = await supabase.from('templates').update(templateData).eq('id', id);
        if (error) throw error;
        setSuccess('Template updated successfully');
        setTimeout(() => setSuccess(null), 3000);
      }
    } catch (err) {
      setError(err.message || 'Failed to save template');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm('Delete this template?')) return;
    setIsDeleting(true);
    try {
      const supabase = createClient();
      const { id } = await params;
      const { error } = await supabase.from('templates').delete().eq('id', id);
      if (error) throw error;
      router.push('/admin/templates');
    } catch (err) {
      setError(err.message);
      setIsDeleting(false);
    }
  };

  const addTag = (tag) => {
    if (tag && !template.tags.includes(tag)) {
      setTemplate((prev) => ({ ...prev, tags: [...prev.tags, tag] }));
    }
  };

  const removeTag = (tag) => {
    setTemplate((prev) => ({ ...prev, tags: prev.tags.filter((t) => t !== tag) }));
  };

  if (isLoading)
    return (
      <div className="flex items-center justify-center py-16">
        <Loader2 className="h-8 w-8 animate-spin text-emerald-600" />
      </div>
    );

  return (
    <div className="min-w-0">
      <div className="mb-6">
        <Link
          href="/admin/templates"
          className="mb-3 inline-flex items-center gap-2 text-sm text-gray-600 hover:text-emerald-600"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Templates
        </Link>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h1 className="text-xl font-bold text-gray-900 sm:text-2xl">
              {isNew ? 'Add New Template' : 'Edit Template'}
            </h1>
            <p className="text-sm text-muted-foreground">
              {isNew ? 'Create a new design template' : 'Update template details'}
            </p>
          </div>
          <div className="flex gap-2">
            {!isNew && (
              <Button
                variant="outline"
                onClick={handleDelete}
                disabled={isDeleting}
                className="flex-1 text-red-600 hover:bg-red-50 sm:flex-none"
              >
                {isDeleting ? (
                  <Loader2 className="h-4 w-4 animate-spin sm:mr-2" />
                ) : (
                  <Trash2 className="h-4 w-4 sm:mr-2" />
                )}
                <span className="hidden sm:inline">Delete</span>
              </Button>
            )}
            <Button onClick={handleSave} disabled={isSaving} className="flex-1 sm:flex-none">
              {isSaving ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin sm:mr-2" />
                  <span className="hidden sm:inline">Saving...</span>
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 sm:mr-2" />
                  <span className="hidden sm:inline">{isNew ? 'Create' : 'Save'}</span>
                </>
              )}
            </Button>
          </div>
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

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Template Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="title">Title *</Label>
                <Input
                  id="title"
                  value={template.title}
                  onChange={(e) =>
                    setTemplate({
                      ...template,
                      title: e.target.value,
                      slug: template.slug || generateSlug(e.target.value),
                    })
                  }
                  placeholder="e.g., Grand Opening Banner"
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="slug">URL Slug</Label>
                <Input
                  id="slug"
                  value={template.slug}
                  onChange={(e) => setTemplate({ ...template, slug: e.target.value })}
                  placeholder="grand-opening-banner"
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="description">Description</Label>
                <textarea
                  id="description"
                  value={template.description}
                  onChange={(e) => setTemplate({ ...template, description: e.target.value })}
                  placeholder="Describe this template..."
                  rows={3}
                  className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                />
              </div>
              <div>
                <Label htmlFor="category">Category</Label>
                <Input
                  id="category"
                  value={template.category}
                  onChange={(e) => setTemplate({ ...template, category: e.target.value })}
                  placeholder="e.g., business, events, sales"
                  className="mt-1"
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Files & Images</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="thumbnail_url">Thumbnail URL</Label>
                <Input
                  id="thumbnail_url"
                  value={template.thumbnail_url}
                  onChange={(e) => setTemplate({ ...template, thumbnail_url: e.target.value })}
                  placeholder="https://..."
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="preview_url">Preview Image URL</Label>
                <Input
                  id="preview_url"
                  value={template.preview_url}
                  onChange={(e) => setTemplate({ ...template, preview_url: e.target.value })}
                  placeholder="https://..."
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="file_url">Template File URL</Label>
                <Input
                  id="file_url"
                  value={template.file_url}
                  onChange={(e) => setTemplate({ ...template, file_url: e.target.value })}
                  placeholder="https://... (PDF, AI, PSD)"
                  className="mt-1"
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Tags</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2 mb-3">
                {template.tags.map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center gap-1 rounded-full bg-gray-100 px-3 py-1 text-sm"
                  >
                    {tag}
                    <button
                      onClick={() => removeTag(tag)}
                      className="text-gray-500 hover:text-red-600"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                ))}
              </div>
              <div className="flex gap-2">
                <Input
                  placeholder="Add a tag..."
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      addTag(e.target.value);
                      e.target.value = '';
                    }
                  }}
                />
                <Button
                  variant="outline"
                  size="sm"
                  onClick={(e) => {
                    const input = e.target.previousSibling;
                    addTag(input.value);
                    input.value = '';
                  }}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
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
                  checked={template.is_active}
                  onChange={(e) => setTemplate({ ...template, is_active: e.target.checked })}
                  className="h-4 w-4 rounded border-gray-300 text-emerald-600"
                />
                <div>
                  <p className="font-medium text-gray-900">Active</p>
                  <p className="text-sm text-gray-500">Visible to customers</p>
                </div>
              </label>
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={template.is_premium}
                  onChange={(e) => setTemplate({ ...template, is_premium: e.target.checked })}
                  className="h-4 w-4 rounded border-gray-300 text-emerald-600"
                />
                <div>
                  <p className="font-medium text-gray-900">Premium</p>
                  <p className="text-sm text-gray-500">Requires payment</p>
                </div>
              </label>
              {template.is_premium && (
                <div>
                  <Label htmlFor="price">Price ($)</Label>
                  <div className="relative mt-1">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
                      $
                    </span>
                    <Input
                      id="price"
                      type="number"
                      step="0.01"
                      value={template.price}
                      onChange={(e) => setTemplate({ ...template, price: e.target.value })}
                      placeholder="0.00"
                      className="pl-7"
                    />
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Preview</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="aspect-[4/3] rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 overflow-hidden">
                {template.thumbnail_url ? (
                  <img
                    src={template.thumbnail_url}
                    alt="Preview"
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center">
                    <Layers className="h-12 w-12 text-gray-300" />
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
