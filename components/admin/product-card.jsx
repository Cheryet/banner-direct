import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { Package, Edit, Trash2, Eye } from 'lucide-react';
import { formatCurrency } from '@/lib/format';

/**
 * Admin product card for product listing grid
 * Server component - displays product info with action links
 */
export function AdminProductCard({ product, onDelete }) {
  return (
    <Card className="overflow-hidden">
      <div className="aspect-video bg-gray-100 relative">
        {product.image_url ? (
          <img src={product.image_url} alt={product.name} className="h-full w-full object-cover" />
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
          {onDelete && (
            <button
              onClick={() => onDelete(product.id)}
              className="inline-flex items-center justify-center gap-1.5 rounded-lg border border-red-300 bg-white px-3 py-2 text-sm font-medium text-red-600 shadow-sm transition-colors hover:bg-red-50 hover:border-red-400"
            >
              <Trash2 className="h-4 w-4" />
              Delete
            </button>
          )}
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
  );
}

/**
 * Empty state for product listing
 */
export function ProductsEmptyState() {
  return (
    <Card>
      <CardContent className="flex flex-col items-center justify-center py-16 text-center">
        <Package className="h-12 w-12 text-gray-300" />
        <h3 className="mt-4 text-lg font-medium text-gray-900">No products found</h3>
        <p className="mt-1 text-sm text-gray-500">Get started by adding your first product.</p>
        <Link
          href="/admin/products/new"
          className="mt-4 inline-flex items-center gap-2 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition-colors hover:bg-emerald-700"
        >
          <Package className="h-4 w-4" />
          Add Product
        </Link>
      </CardContent>
    </Card>
  );
}

/**
 * Product grid container
 */
export function ProductsGrid({ products, onDelete }) {
  if (!products || products.length === 0) {
    return <ProductsEmptyState />;
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {products.map((product) => (
        <AdminProductCard key={product.id} product={product} onDelete={onDelete} />
      ))}
    </div>
  );
}
