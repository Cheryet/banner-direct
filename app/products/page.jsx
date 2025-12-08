import { products } from '@/lib/mock-data';
import { ProductCard } from '@/components/product/product-card';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

export const metadata = {
  title: 'Products',
  description: 'Browse our selection of custom banners. Vinyl, mesh, fabric, and retractable banners made in Canada.',
};

export default function ProductsPage() {
  return (
    <div className="container py-8 md:py-12">
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="mb-2">Custom Banners</h1>
        <p className="text-lg text-muted-foreground">
          Select a size or start from a template. All banners made in Canada.
        </p>
      </div>

      {/* Filters */}
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap gap-2">
          <Button variant="default" size="sm">All</Button>
          <Button variant="outline" size="sm">Vinyl Banners</Button>
          <Button variant="outline" size="sm">Mesh Banners</Button>
          <Button variant="outline" size="sm">Fabric Banners</Button>
          <Button variant="outline" size="sm">Retractable</Button>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">Sort by:</span>
          <Select defaultValue="popular">
            <SelectTrigger className="w-[160px]">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="popular">Most Popular</SelectItem>
              <SelectItem value="price-low">Price: Low to High</SelectItem>
              <SelectItem value="price-high">Price: High to Low</SelectItem>
              <SelectItem value="fastest">Fastest Shipping</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Product Grid */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {products.map((product) => (
          <ProductCard
            key={product.id}
            slug={product.slug}
            title={product.title}
            image={product.image}
            specs={product.specs}
            priceFrom={product.priceFrom}
            badges={product.badges}
          />
        ))}
      </div>

      {/* Empty state placeholder */}
      {products.length === 0 && (
        <div className="py-12 text-center">
          <p className="text-muted-foreground">No products found matching your criteria.</p>
          <Button className="mt-4">Clear Filters</Button>
        </div>
      )}
    </div>
  );
}
