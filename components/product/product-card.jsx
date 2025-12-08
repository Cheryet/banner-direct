import * as React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { ImageIcon } from 'lucide-react';

// =============================================================================
// PRODUCT CARD - Memoized for performance
// =============================================================================
const ProductCard = React.memo(function ProductCard({
  slug,
  title,
  image,
  specs,
  priceFrom,
  badges = [],
  className,
}) {
  return (
    <Card className={cn('group overflow-hidden transition-shadow hover:shadow-card-hover', className)}>
      <Link href={`/product/${slug}`} className="block" prefetch={false}>
        <div className="relative aspect-[4/3] overflow-hidden bg-gradient-to-br from-muted to-muted/50">
          {image ? (
            <Image
              src={image}
              alt={title}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
              className="object-cover transition-transform duration-300 group-hover:scale-105"
              loading="lazy"
              placeholder="empty"
            />
          ) : (
            <div className="flex h-full w-full flex-col items-center justify-center gap-2 text-muted-foreground">
              <ImageIcon className="h-10 w-10 opacity-40" aria-hidden="true" />
              <span className="text-sm">Product Image</span>
            </div>
          )}
          {badges.length > 0 && (
            <div className="absolute left-3 top-3 flex flex-wrap gap-1">
              {badges.map((badge) => (
                <Badge key={badge} variant={badge === 'Made in Canada' ? 'canada' : 'secondary'}>
                  {badge}
                </Badge>
              ))}
            </div>
          )}
        </div>
      </Link>
      <CardContent className="p-4">
        <Link href={`/product/${slug}`} className="block">
          <h3 className="mb-1 font-heading text-lg font-semibold leading-tight hover:text-primary">
            {title}
          </h3>
        </Link>
        {specs && (
          <p className="mb-2 text-sm text-muted-foreground">{specs}</p>
        )}
        <p className="text-lg font-semibold text-foreground">
          From <span className="text-primary">${priceFrom.toFixed(2)}</span>
        </p>
      </CardContent>
      <CardFooter className="p-4 pt-0">
        <Button asChild className="w-full">
          <Link href={`/product/${slug}`}>Customize</Link>
        </Button>
      </CardFooter>
    </Card>
  );
});

export { ProductCard };
