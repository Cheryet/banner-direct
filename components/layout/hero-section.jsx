import * as React from 'react';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import { LinkButton } from '@/components/ui/link-button';

/**
 * HeroSection Component - Premium E-Commerce Hero
 *
 * Features:
 * - Subtle background textures (linen, paper, noise, dots)
 * - Layered depth with soft shadows
 * - Responsive layout with graceful stacking
 * - Customizable via props
 *
 * @param {string} title - Main headline
 * @param {string} titleAccent - Optional accent portion of title (displayed in primary color)
 * @param {string} subtitle - Supporting text below headline
 * @param {string} eyebrow - Small text/badge above headline
 * @param {React.ReactNode} eyebrowIcon - Optional icon for eyebrow
 * @param {object} primaryCta - { text, href } for primary button
 * @param {object} secondaryCta - { text, href } for secondary button
 * @param {string} imageSrc - Hero image source
 * @param {string} imageAlt - Alt text for image
 * @param {React.ReactNode} imagePlaceholder - Placeholder content when no image
 * @param {string} texture - Background texture: 'linen' | 'paper' | 'dots' | 'noise' | 'none'
 * @param {string} variant - Layout variant: 'default' | 'centered' | 'imageLeft'
 * @param {React.ReactNode} trustBadges - Optional trust indicators below CTAs
 * @param {string} className - Additional classes
 */
function HeroSection({
  title,
  titleAccent,
  subtitle,
  eyebrow,
  eyebrowIcon,
  primaryCta,
  secondaryCta,
  imageSrc,
  imageAlt = '',
  imagePlaceholder,
  texture = 'linen',
  variant = 'default',
  trustBadges,
  className,
}) {
  const isImageLeft = variant === 'imageLeft';
  const isCentered = variant === 'centered';

  return (
    <section className={cn('relative overflow-hidden', className)}>
      {/* Background texture layer */}
      <TextureBackground texture={texture} />

      {/* Soft gradient overlay for depth */}
      <div
        className="pointer-events-none absolute inset-0 bg-gradient-to-br from-emerald-50/30 via-transparent to-transparent"
        aria-hidden="true"
      />

      {/* Content container */}
      <div className="container relative">
        <div
          className={cn(
            'grid min-h-[70vh] items-center gap-10 py-16 lg:gap-16 lg:py-24',
            isCentered ? 'justify-center text-center' : 'lg:grid-cols-2',
            isImageLeft && 'lg:[&>*:first-child]:order-2'
          )}
        >
          {/* Content Column */}
          <div className={cn('max-w-xl', isCentered && 'mx-auto')}>
            {/* Eyebrow badge */}
            {eyebrow && (
              <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-emerald-50 px-4 py-2 text-sm font-medium text-emerald-700 shadow-sm">
                {eyebrowIcon && (
                  <span className="flex-shrink-0" aria-hidden="true">
                    {eyebrowIcon}
                  </span>
                )}
                {eyebrow}
              </div>
            )}

            {/* Headline with optional accent - two lines on desktop only */}
            <h1 className="text-4xl font-bold tracking-tight text-gray-900 md:text-5xl lg:text-6xl">
              {titleAccent ? (
                <>
                  <span className="md:block">{title} </span>
                  <span className="text-emerald-600 md:block">{titleAccent}</span>
                </>
              ) : (
                title
              )}
            </h1>

            {/* Subtitle */}
            {subtitle && (
              <p className="mt-6 text-lg leading-relaxed text-gray-600 md:text-xl">{subtitle}</p>
            )}

            {/* CTA Buttons */}
            {(primaryCta || secondaryCta) && (
              <div
                className={cn(
                  'mt-10 flex flex-col gap-4 sm:flex-row',
                  isCentered && 'sm:justify-center'
                )}
              >
                {primaryCta && (
                  <LinkButton
                    href={primaryCta.href}
                    size="lg"
                    className="shadow-md transition-all duration-200 hover:shadow-lg hover:scale-[1.02] active:scale-[0.98]"
                  >
                    {primaryCta.text}
                  </LinkButton>
                )}
                {secondaryCta && (
                  <LinkButton
                    href={secondaryCta.href}
                    variant="outline"
                    size="lg"
                    className="transition-all duration-200 hover:shadow-md hover:scale-[1.02] active:scale-[0.98]"
                  >
                    {secondaryCta.text}
                  </LinkButton>
                )}
              </div>
            )}

            {/* Trust badges */}
            {trustBadges && (
              <div className={cn('mt-12', isCentered && 'flex justify-center')}>{trustBadges}</div>
            )}
          </div>

          {/* Image Column */}
          {!isCentered && (
            <div className="relative lg:pl-4">
              <HeroImage src={imageSrc} alt={imageAlt} placeholder={imagePlaceholder} />
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

/**
 * TextureBackground - Renders subtle background textures
 * All textures are CSS-based or inline SVG for optimal performance (<1kb)
 */
function TextureBackground({ texture }) {
  if (texture === 'none') {
    return <div className="absolute inset-0 bg-white" aria-hidden="true" />;
  }

  const textureStyles = {
    // Linen texture - subtle crosshatch pattern
    linen: {
      backgroundColor: '#fafafa',
      backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='4' height='4' viewBox='0 0 4 4'%3E%3Cpath fill='%23e5e5e5' fill-opacity='0.4' d='M1 3h1v1H1V3zm2-2h1v1H3V1z'%3E%3C/path%3E%3C/svg%3E")`,
    },
    // Paper texture - subtle fiber pattern
    paper: {
      backgroundColor: '#fafafa',
      backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 100 100'%3E%3Cg fill='%23e5e5e5' fill-opacity='0.3'%3E%3Cpath d='M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm-43-7c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm63 31c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM34 90c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm56-76c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM12 86c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm28-65c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm23-11c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-6 60c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm29 22c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zM32 63c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm57-13c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-9-21c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM60 91c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM35 41c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2z'/%3E%3C/g%3E%3C/svg%3E")`,
    },
    // Dots pattern - subtle polka dots
    dots: {
      backgroundColor: '#fafafa',
      backgroundImage: `url("data:image/svg+xml,%3Csvg width='20' height='20' viewBox='0 0 20 20' xmlns='http://www.w3.org/2000/svg'%3E%3Ccircle cx='1' cy='1' r='1' fill='%23e0e0e0' fill-opacity='0.5'/%3E%3C/svg%3E")`,
    },
    // Noise texture - subtle speckle pattern
    noise: {
      backgroundColor: '#fafafa',
      backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='40' height='40' viewBox='0 0 40 40'%3E%3Cg fill='%23d4d4d4' fill-opacity='0.4'%3E%3Ccircle cx='3' cy='3' r='0.5'/%3E%3Ccircle cx='13' cy='8' r='0.5'/%3E%3Ccircle cx='23' cy='3' r='0.5'/%3E%3Ccircle cx='33' cy='7' r='0.5'/%3E%3Ccircle cx='8' cy='13' r='0.5'/%3E%3Ccircle cx='18' cy='18' r='0.5'/%3E%3Ccircle cx='28' cy='13' r='0.5'/%3E%3Ccircle cx='38' cy='17' r='0.5'/%3E%3Ccircle cx='3' cy='23' r='0.5'/%3E%3Ccircle cx='13' cy='28' r='0.5'/%3E%3Ccircle cx='23' cy='23' r='0.5'/%3E%3Ccircle cx='33' cy='27' r='0.5'/%3E%3Ccircle cx='8' cy='33' r='0.5'/%3E%3Ccircle cx='18' cy='38' r='0.5'/%3E%3Ccircle cx='28' cy='33' r='0.5'/%3E%3Ccircle cx='38' cy='37' r='0.5'/%3E%3C/g%3E%3C/svg%3E")`,
    },
  };

  const style = textureStyles[texture] || textureStyles.linen;

  return <div className="absolute inset-0" style={style} aria-hidden="true" />;
}

/**
 * HeroImage - Image presentation with depth effects
 * Includes soft shadow, rounded corners, and optional vignette
 */
function HeroImage({ src, alt, placeholder }) {
  return (
    <div className="relative">
      {/* Soft shadow behind image for depth */}
      <div
        className="absolute -inset-4 rounded-3xl bg-gradient-to-br from-gray-200/50 to-gray-300/30 blur-2xl"
        aria-hidden="true"
      />

      {/* Image container with layered styling */}
      <div className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-gradient-to-br from-gray-100 to-gray-50 shadow-2xl ring-1 ring-gray-900/5 lg:aspect-[5/4]">
        {/* Subtle inner vignette for focus */}
        <div
          className="pointer-events-none absolute inset-0 z-10 rounded-2xl shadow-[inset_0_0_60px_rgba(0,0,0,0.06)]"
          aria-hidden="true"
        />

        {src ? (
          <Image
            src={src}
            alt={alt}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 50vw"
            priority
          />
        ) : (
          placeholder || (
            <div className="flex h-full w-full items-center justify-center">
              <div className="text-center p-8">
                <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-2xl bg-white shadow-lg">
                  <svg
                    className="h-10 w-10 text-emerald-500"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                </div>
                <p className="text-base font-medium text-gray-600">Hero Image</p>
                <p className="mt-1 text-sm text-gray-400">Product or lifestyle photo</p>
              </div>
            </div>
          )
        )}
      </div>
    </div>
  );
}

export { HeroSection, TextureBackground, HeroImage };
