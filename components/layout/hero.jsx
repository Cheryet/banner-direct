import * as React from 'react';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { LinkButton } from '@/components/ui/link-button';

function Hero({
  title,
  subtitle,
  primaryCta,
  primaryCtaHref,
  secondaryCta,
  secondaryCtaHref,
  image,
  imageAlt,
  className,
}) {
  return (
    <section
      className={cn(
        'relative overflow-hidden bg-gradient-to-b from-muted/50 to-background',
        className
      )}
    >
      <div className="container py-16 md:py-24 lg:py-32">
        <div className="grid items-center gap-8 lg:grid-cols-2 lg:gap-16">
          {/* Content */}
          <div className="max-w-xl">
            <h1 className="text-balance">{title}</h1>
            {subtitle && (
              <p className="mt-6 text-lg text-muted-foreground md:text-xl">{subtitle}</p>
            )}
            <div className="mt-8 flex flex-col gap-4 sm:flex-row">
              {primaryCta && primaryCtaHref && (
                <LinkButton href={primaryCtaHref} size="xl">
                  {primaryCta}
                </LinkButton>
              )}
              {secondaryCta && secondaryCtaHref && (
                <LinkButton href={secondaryCtaHref} variant="outline" size="xl">
                  {secondaryCta}
                </LinkButton>
              )}
            </div>
          </div>

          {/* Image */}
          {image && (
            <div className="relative aspect-[4/3] overflow-hidden rounded-lg shadow-xl lg:aspect-square">
              <img src={image} alt={imageAlt || ''} className="h-full w-full object-cover" />
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

export { Hero };
