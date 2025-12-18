import { createClient } from '@/lib/supabase/server';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { LinkButton } from '@/components/ui/link-button';
import Link from 'next/link';
import {
  Package,
  Plus,
  Eye,
  EyeOff,
  DollarSign,
} from 'lucide-react';
import { formatCurrency } from '@/lib/format';
import { ProductsGrid } from '@/components/admin/product-card';

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
      <ProductsGrid products={products} />
    </div>
  );
}
