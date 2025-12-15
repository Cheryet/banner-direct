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
  Search,
  Filter,
  MoreHorizontal,
  DollarSign,
  TrendingUp,
  Archive
} from 'lucide-react';

export const metadata = {
  title: 'Products - Admin',
  description: 'Manage your product catalog',
};

function formatCurrency(amount) {
  return new Intl.NumberFormat('en-CA', {
    style: 'currency',
    currency: 'CAD',
  }).format(amount);
}

export default async function AdminProductsPage({ searchParams }) {
  const supabase = await createClient();
  const params = await searchParams;
  
  const categoryFilter = params?.category || 'all';
  const statusFilter = params?.status || 'all';

  // Fetch products
  let query = supabase
    .from('products')
    .select('*')
    .order('created_at', { ascending: false });

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

  const uniqueCategories = [...new Set(categories?.map(c => c.category).filter(Boolean) || [])];

  // Calculate stats
  const stats = {
    total: products?.length || 0,
    active: products?.filter(p => p.is_active).length || 0,
    inactive: products?.filter(p => !p.is_active).length || 0,
    avgPrice: products?.length 
      ? products.reduce((sum, p) => sum + (parseFloat(p.base_price) || 0), 0) / products.length 
      : 0,
  };

  return (
    <div className="min-w-0">
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-900 sm:text-2xl">Products</h1>
          <p className="text-sm text-muted-foreground">
            Manage your product catalog and pricing
          </p>
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
      <div className="mb-6 flex flex-wrap items-center gap-4">
        <div className="flex gap-2">
          <Link
            href="/admin/products"
            className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
              statusFilter === 'all' && categoryFilter === 'all'
                ? 'bg-emerald-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            All
          </Link>
          <Link
            href="/admin/products?status=active"
            className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
              statusFilter === 'active'
                ? 'bg-emerald-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Active
          </Link>
          <Link
            href="/admin/products?status=inactive"
            className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
              statusFilter === 'inactive'
                ? 'bg-emerald-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Inactive
          </Link>
        </div>

        {uniqueCategories.length > 0 && (
          <select
            defaultValue={categoryFilter}
            onChange={(e) => {
              const url = new URL(window.location.href);
              if (e.target.value === 'all') {
                url.searchParams.delete('category');
              } else {
                url.searchParams.set('category', e.target.value);
              }
              window.location.href = url.toString();
            }}
            className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm"
          >
            <option value="all">All Categories</option>
            {uniqueCategories.map((cat) => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        )}
      </div>

      {/* Products Grid */}
      {!products || products.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16 text-center">
            <Package className="h-12 w-12 text-gray-300" />
            <h3 className="mt-4 text-lg font-medium text-gray-900">No products found</h3>
            <p className="mt-1 text-sm text-gray-500">
              Get started by adding your first product.
            </p>
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
                  <p className="font-bold text-emerald-600">
                    {formatCurrency(product.base_price)}
                  </p>
                </div>
                {product.description && (
                  <p className="mt-2 line-clamp-2 text-sm text-gray-600">
                    {product.description}
                  </p>
                )}
                <div className="mt-4 flex gap-2">
                  <Link
                    href={`/admin/products/${product.id}`}
                    className="flex-1 rounded-lg border px-3 py-2 text-center text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
                  >
                    <Edit className="mr-1 inline h-4 w-4" />
                    Edit
                  </Link>
                  <Link
                    href={`/product/${product.slug || product.id}`}
                    target="_blank"
                    className="rounded-lg border px-3 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
                  >
                    <Eye className="h-4 w-4" />
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
