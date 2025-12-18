import { getProducts } from '@/lib/products';
import { getCategories } from '@/lib/db/categories';
import { ProductCard } from '@/components/product/product-card';
import { Button } from '@/components/ui/button';
import { LinkButton } from '@/components/ui/link-button';
import Link from 'next/link';
import { Package } from 'lucide-react';

export async function generateMetadata({ searchParams }) {
  const params = await searchParams;
  const categorySlug = params?.category;

  if (categorySlug && categorySlug !== 'all') {
    const categories = await getCategories({ includeEmpty: true });
    const category = categories.find((c) => c.slug === categorySlug);
    if (category) {
      return {
        title: `${category.name} - Custom Banners | Banner Direct`,
        description:
          category.description ||
          `Browse our selection of ${category.name.toLowerCase()}. Made in Canada with fast shipping.`,
      };
    }
  }

  return {
    title: 'Products - Custom Banners | Banner Direct',
    description:
      'Browse our selection of custom banners. Vinyl, mesh, fabric, and retractable banners made in Canada.',
  };
}

export default async function ProductsPage({ searchParams }) {
  const params = await searchParams;
  const categoryFilter = params?.category || 'all';

  // Fetch products and categories in parallel
  const [products, categories] = await Promise.all([
    getProducts({
      category: categoryFilter !== 'all' ? categoryFilter : null,
    }),
    getCategories({ includeEmpty: false }),
  ]);

  // Find current category for display
  const currentCategory =
    categoryFilter !== 'all' ? categories.find((c) => c.slug === categoryFilter) : null;

  return (
    <div className="container py-8 md:py-12">
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="mb-2">{currentCategory?.name || 'Custom Banners'}</h1>
        <p className="text-lg text-muted-foreground">
          {currentCategory?.description ||
            'Select a size or start from a template. All banners made in Canada.'}
        </p>
      </div>

      {/* Category Filters */}
      <div className="mb-8 flex flex-wrap gap-2">
        <LinkButton
          href="/products"
          variant={categoryFilter === 'all' ? 'default' : 'outline'}
          size="sm"
        >
          All Products
        </LinkButton>
        {categories.map((category) => (
          <LinkButton
            key={category.id}
            href={`/products?category=${category.slug}`}
            variant={categoryFilter === category.slug ? 'default' : 'outline'}
            size="sm"
          >
            {category.name}
            {category.product_count > 0 && (
              <span className="ml-1.5 text-xs opacity-70">({category.product_count})</span>
            )}
          </LinkButton>
        ))}
      </div>

      {/* Product Grid */}
      {products.length > 0 ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {products.map((product) => (
            <ProductCard
              key={product.id}
              slug={product.slug}
              title={product.title || product.name}
              image={product.image_url}
              specs={product.specs}
              priceFrom={product.base_price}
              badges={(product.badges || []).map((b) => (typeof b === 'string' ? b : b.label))}
            />
          ))}
        </div>
      ) : (
        <div className="py-16 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-muted">
            <Package className="h-8 w-8 text-muted-foreground" />
          </div>
          <h3 className="mb-2 text-lg font-semibold">No products found</h3>
          <p className="mb-6 text-muted-foreground">
            {currentCategory
              ? `No products available in ${currentCategory.name} yet.`
              : 'No products match your current filters.'}
          </p>
          <LinkButton href="/products">View All Products</LinkButton>
        </div>
      )}
    </div>
  );
}
