import { createClient } from '@/lib/supabase/server';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { LinkButton } from '@/components/ui/link-button';
import Link from 'next/link';
import {
  Package,
  Plus,
  Edit,
  Trash2,
  Eye,
  EyeOff,
  DollarSign,
} from 'lucide-react';
import { formatCurrency } from '@/lib/format';

export const metadata = {
  title: 'Products - Admin',
  description: 'Manage your product catalog',
};

export default async function AdminProductsPage({ searchParams }) {
  const supabase = await createClient();
  const params = await searchParams;

  const categoryFilter = params?.category || 'all';
  const statusFilter = params?.status || 'all';

  // Fetch products
  let query = supabase.from('products').select('*').order('created_at', { ascending: false });

  if (categoryFilter !== 'all') {
    query = query.eq('category', categoryFilter);
  }

  if (statusFilter === 'active') {
    query = query.eq('is_active', true);
  } else if (statusFilter === 'inactive') {
    query = query.eq('is_active', false);
  }

  const { data: products, error } = await query;

  // Get categories for filter
  const { data: categories } = await supabase
    .from('products')
    .select('category')
    .not('category', 'is', null);

  const uniqueCategories = [...new Set(categories?.map((c) => c.category).filter(Boolean) || [])];

  // Calculate stats
  const stats = {
    total: products?.length || 0,
    active: products?.filter((p) => p.is_active).length || 0,
    inactive: products?.filter((p) => !p.is_active).length || 0,
    avgPrice: products?.length
      ? products.reduce((sum, p) => sum + (parseFloat(p.base_price) || 0), 0) / products.length
      : 0,
  };

  return (
    <div className="min-w-0">
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-900 sm:text-2xl">Products</h1>
          <p className="text-sm text-muted-foreground">Manage your product catalog and pricing</p>
        </div>
        <LinkButton href="/admin/products/new" className="w-full sm:w-auto">
          <Plus className="mr-2 h-4 w-4" />
          Add Product
        </LinkButton>
      </div>

      {/* Stats Cards */}
      <div className="mb-6 grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Products</p>
                <p className="text-2xl font-bold">{stats.total}</p>
              </div>
              <Package className="h-8 w-8 text-gray-400" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Active</p>
                <p className="text-2xl font-bold text-emerald-600">{stats.active}</p>
              </div>
              <Eye className="h-8 w-8 text-emerald-400" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Inactive</p>
                <p className="text-2xl font-bold text-gray-600">{stats.inactive}</p>
              </div>
              <EyeOff className="h-8 w-8 text-gray-400" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Avg. Price</p>
                <p className="text-2xl font-bold">{formatCurrency(stats.avgPrice)}</p>
              </div>
              <DollarSign className="h-8 w-8 text-gray-400" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card className="mb-6">
        <CardContent className="p-4">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            {/* Status Filter */}
            <div className="flex items-center gap-3">
              <span className="text-sm font-medium text-gray-500">Status:</span>
              <div className="inline-flex rounded-lg border border-gray-200 bg-gray-50 p-1">
                <Link
                  href="/admin/products"
                  className={`inline-flex items-center rounded-md px-3 py-1.5 text-sm font-medium transition-all ${
                    statusFilter === 'all' && categoryFilter === 'all'
                      ? 'bg-white text-gray-900 shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  All
                </Link>
                <Link
                  href="/admin/products?status=active"
                  className={`inline-flex items-center rounded-md px-3 py-1.5 text-sm font-medium transition-all ${
                    statusFilter === 'active'
                      ? 'bg-white text-emerald-600 shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <span className="mr-1.5 h-2 w-2 rounded-full bg-emerald-500"></span>
                  Active
                </Link>
                <Link
                  href="/admin/products?status=inactive"
                  className={`inline-flex items-center rounded-md px-3 py-1.5 text-sm font-medium transition-all ${
                    statusFilter === 'inactive'
                      ? 'bg-white text-gray-700 shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <span className="mr-1.5 h-2 w-2 rounded-full bg-gray-400"></span>
                  Inactive
                </Link>
              </div>
            </div>

            {/* Category Filter */}
            {uniqueCategories.length > 0 && (
              <div className="flex items-center gap-3">
                <span className="text-sm font-medium text-gray-500">Category:</span>
                <div className="inline-flex rounded-lg border border-gray-200 bg-gray-50 p-1">
                  <Link
                    href="/admin/products"
                    className={`inline-flex items-center rounded-md px-3 py-1.5 text-sm font-medium transition-all ${
                      categoryFilter === 'all'
                        ? 'bg-white text-gray-900 shadow-sm'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    All
                  </Link>
                  {uniqueCategories.map((cat) => (
                    <Link
                      key={cat}
                      href={`/admin/products?category=${cat}`}
                      className={`inline-flex items-center rounded-md px-3 py-1.5 text-sm font-medium transition-all ${
                        categoryFilter === cat
                          ? 'bg-white text-gray-900 shadow-sm'
                          : 'text-gray-600 hover:text-gray-900'
                      }`}
                    >
                      {cat}
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Products Grid */}
      {!products || products.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16 text-center">
            <Package className="h-12 w-12 text-gray-300" />
            <h3 className="mt-4 text-lg font-medium text-gray-900">No products found</h3>
            <p className="mt-1 text-sm text-gray-500">Get started by adding your first product.</p>
            <LinkButton href="/admin/products/new" className="mt-4">
              <Plus className="mr-2 h-4 w-4" />
              Add Product
            </LinkButton>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {products.map((product) => (
            <Card key={product.id} className="overflow-hidden">
              <div className="aspect-video bg-gray-100 relative">
                {product.image_url ? (
                  <img
                    src={product.image_url}
                    alt={product.name}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center">
                    <Package className="h-12 w-12 text-gray-300" />
                  </div>
                )}
                {!product.is_active && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                    <span className="rounded-full bg-gray-900 px-3 py-1 text-sm font-medium text-white">
                      Inactive
                    </span>
                  </div>
                )}
              </div>
              <CardContent className="p-4">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-semibold text-gray-900">{product.name}</h3>
                    <p className="text-sm text-gray-500">{product.category || 'Uncategorized'}</p>
                  </div>
                  <p className="font-bold text-emerald-600">{formatCurrency(product.base_price)}</p>
                </div>
                {product.description && (
                  <p className="mt-2 line-clamp-2 text-sm text-gray-600">{product.description}</p>
                )}
                <div className="mt-4 flex gap-2">
                  <Link
                    href={`/admin/products/${product.id}`}
                    className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-lg bg-emerald-600 px-3 py-2 text-sm font-medium text-white shadow-sm transition-colors hover:bg-emerald-700"
                  >
                    <Edit className="h-4 w-4" />
                    Edit
                  </Link>
                  <button
                    className="inline-flex items-center justify-center gap-1.5 rounded-lg border border-red-300 bg-white px-3 py-2 text-sm font-medium text-red-600 shadow-sm transition-colors hover:bg-red-50 hover:border-red-400"
                  >
                    <Trash2 className="h-4 w-4" />
                    Delete
                  </button>
                  <Link
                    href={`/product/${product.slug || product.id}`}
                    target="_blank"
                    className="inline-flex items-center justify-center gap-1.5 rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 shadow-sm transition-colors hover:bg-gray-50 hover:border-gray-400"
                  >
                    <Eye className="h-4 w-4" />
                    View
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
