import Link from 'next/link';
import { getProducts } from '@/lib/products';
import { getSettings } from '@/lib/db/settings';
import { getCategories } from '@/lib/db/categories';
import { Card, CardContent } from '@/components/ui/card';
import { ProductCard } from '@/components/product/product-card';
import { LinkButton } from '@/components/ui/link-button';
import { HeroSection } from '@/components/layout/hero-section';
import { FAQSection } from '@/components/home/faq-section';

import {
  Printer,
  Truck,
  MapPin,
  Upload,
  Package,
  RefreshCw,
  PartyPopper,
  Building2,
  Store,
  Users,
  Check,
  Shield,
} from 'lucide-react';

export const metadata = {
  title: 'Custom Banners Canada | Vinyl & Outdoor Banner Printing',
  description:
    'Order custom banners printed in Canada. Durable vinyl banners, mesh banners, and fabric banners for events, trade shows, and businesses. Fast nationwide shipping.',
  openGraph: {
    title: 'Custom Banners Canada | Vinyl & Outdoor Banner Printing',
    description:
      'Order custom banners printed in Canada. Durable vinyl banners for events, trade shows, and businesses. Fast nationwide shipping.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Custom Banners Canada | Vinyl & Outdoor Banner Printing',
    description:
      'Order custom banners printed in Canada. Durable vinyl banners for events, trade shows, and businesses. Fast nationwide shipping.',
  },
};

// Icon mapping for dynamic content
const iconMap = {
  PartyPopper,
  Building2,
  Store,
  Users,
  Package,
  Upload,
  Truck,
  MapPin,
  Printer,
  Shield,
  Check,
};

// Default fallback data (used if settings not available)
const defaultUseCases = [
  {
    icon: 'PartyPopper',
    title: 'Event Banners',
    description: 'Custom banners for birthdays, weddings, charity runs, and outdoor community events across Canada.',
  },
  {
    icon: 'Building2',
    title: 'Trade Show Displays',
    description: 'Professional trade show banners and booth displays that attract attention and build brand presence.',
  },
  {
    icon: 'Store',
    title: 'Business Signage',
    description: 'Storefront banners, sale signs, grand opening displays, and promotional signage for retail.',
  },
  {
    icon: 'Users',
    title: 'Bulk Banner Orders',
    description: 'Volume pricing for corporate clients needing consistent branded banners across multiple locations.',
  },
];

const defaultHowItWorks = [
  {
    number: 1,
    icon: 'Package',
    title: 'Select banner size & material',
    description: 'Choose from vinyl, mesh, or fabric banners in standard or custom sizes.',
  },
  {
    number: 2,
    icon: 'Upload',
    title: 'Upload your design',
    description: 'Upload your artwork or use our templates. Free design review included.',
  },
  {
    number: 3,
    icon: 'Truck',
    title: 'Fast printing & Canada-wide shipping',
    description: 'Printed on commercial equipment and shipped anywhere in Canada.',
  },
];

const defaultHero = {
  title: 'Custom banners, printed in Canada',
  subtitle:
    'Durable vinyl banners, mesh banners, and fabric banners for outdoor events, trade shows, and business signage. Printed on commercial equipment with fast Canada-wide shipping.',
  cta_primary: { text: 'Shop Banners →', href: '/products' },
  cta_secondary: { text: 'Get Bulk Pricing', href: '/bulk' },
};

const defaultTrustBadges = [
  { icon: 'check', text: 'Free design review' },
  { icon: 'check', text: 'Ships across Canada' },
  { icon: 'check', text: 'Weather-resistant materials' },
];

export default async function Home() {
  // Fetch all data in parallel for performance
  const [settings, featuredProducts, fallbackProducts, categories] = await Promise.all([
    getSettings(),
    getProducts({ featured: true, limit: 4 }),
    getProducts({ limit: 4 }),
    getCategories(),
  ]);

  // Use featured products or fallback to any products
  const displayProducts = featuredProducts.length > 0 ? featuredProducts : fallbackProducts;

  // Get dynamic content from settings with fallbacks
  const heroContent = settings.hero_content || defaultHero;
  const useCases = settings.use_cases || defaultUseCases;
  const howItWorks = settings.how_it_works || defaultHowItWorks;
  const trustBadges = settings.trust_badges || defaultTrustBadges;
  // Parse title for accent styling (split on comma)
  const titleParts = heroContent.title?.split(',') || ['Your banner', ' your way'];
  const mainTitle = titleParts[0] + (titleParts.length > 1 ? ',' : '');
  const accentTitle = titleParts.length > 1 ? titleParts.slice(1).join(',') : null;

  // Build trust badges component
  const trustBadgesComponent = (
    <div className="flex flex-wrap items-center gap-6 text-sm text-gray-700">
      {trustBadges.map((badge, index) => (
        <span key={index} className="flex items-center gap-2">
          <Check className="h-5 w-5 text-emerald-500" aria-hidden="true" />
          {badge.text}
        </span>
      ))}
    </div>
  );

  // Build hero image placeholder with pricing badge
  const heroImagePlaceholder = (
    <>
      <div className="flex h-full w-full items-center justify-center">
        <div className="text-center p-8">
          <div className="mx-auto mb-4 flex h-24 w-24 items-center justify-center rounded-2xl bg-white shadow-lg">
            <Package className="h-12 w-12 text-emerald-500" aria-hidden="true" />
          </div>
          <p className="text-lg font-semibold text-gray-700">Hero Image</p>
          <p className="mt-1 text-sm text-gray-500">
            Trade show, event, or storefront banner
          </p>
        </div>
      </div>
      {/* Floating price badge */}
      <div className="absolute bottom-4 left-4 z-20 rounded-lg bg-white/95 px-4 py-2 shadow-lg backdrop-blur">
        <p className="text-xs font-medium text-gray-500">Starting from</p>
        <p className="text-xl font-bold text-gray-900">
          ${displayProducts[0]?.base_price?.toFixed(2) || '49.99'}
        </p>
      </div>
    </>
  );

  return (
    <>
      {/* ============================================
          HERO SECTION - Premium E-Commerce Style
          Subtle linen texture with emerald accents
          ============================================ */}
      <HeroSection
        title={mainTitle}
        titleAccent={accentTitle}
        subtitle={heroContent.subtitle}
        eyebrow="Proudly Made in Canada"
        eyebrowIcon={<MapPin className="h-4 w-4" />}
        primaryCta={{
          text: heroContent.cta_primary?.text || 'Start Creating →',
          href: heroContent.cta_primary?.href || '/products',
        }}
        secondaryCta={{
          text: heroContent.cta_secondary?.text || 'Get Bulk Pricing',
          href: heroContent.cta_secondary?.href || '/bulk',
        }}
        imagePlaceholder={heroImagePlaceholder}
        texture="linen"
        trustBadges={trustBadgesComponent}
      />

      {/* ============================================
          USE-CASE SECTION - Premium Card Grid
          Gray background for contrast
          ============================================ */}
      <section className="bg-gray-50 py-16 md:py-24">
        <div className="container">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold text-gray-900 md:text-4xl">
              Custom banners for every occasion
            </h2>
            <p className="mt-4 text-lg text-gray-700">
              From backyard parties to national trade shows, our vinyl and fabric banners deliver professional results.
            </p>
          </div>
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {useCases.map((useCase) => {
              const IconComponent = iconMap[useCase.icon] || Package;
              return (
                <Card
                  key={useCase.title}
                  className="group cursor-pointer border border-gray-200 bg-white shadow-sm transition-all duration-200 hover:-translate-y-1 hover:border-emerald-200 hover:shadow-md"
                >
                  <CardContent className="p-6">
                    <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-50 transition-colors group-hover:bg-emerald-100">
                      <IconComponent className="h-6 w-6 text-emerald-600" aria-hidden="true" />
                    </div>
                    <h3 className="mb-2 font-semibold text-gray-900">{useCase.title}</h3>
                    <p className="text-sm leading-relaxed text-gray-700">{useCase.description}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* ============================================
          HOW IT WORKS - Clean 3-Step Process
          Dark emerald background for visual rhythm
          ============================================ */}
      <section className="bg-emerald-950 py-16 md:py-24">
        <div className="container">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-sm font-medium uppercase tracking-wider text-emerald-300">Simple Process</p>
            <h2 className="mt-2 text-3xl font-bold text-white md:text-4xl">How banner printing works</h2>
            <p className="mt-4 text-lg text-emerald-100">Order your custom banner in three simple steps.</p>
          </div>

          {/* Steps - Card-based layout with connecting line */}
          <div className="relative mt-16">
            {/* Horizontal connector line (desktop) */}
            <div className="absolute left-0 right-0 top-12 hidden h-0.5 bg-gradient-to-r from-transparent via-emerald-500/50 to-transparent md:block" aria-hidden="true" />
            
            <div className="grid gap-8 md:grid-cols-3">
              {howItWorks.map((step) => {
                const IconComponent = iconMap[step.icon] || Package;
                return (
                  <div key={step.number} className="relative">
                    {/* Card */}
                    <div className="rounded-2xl border border-emerald-800/50 bg-emerald-900/30 p-6 backdrop-blur-sm">
                      {/* Step number badge - positioned on the line */}
                      <div className="mx-auto -mt-12 mb-6 flex h-14 w-14 items-center justify-center rounded-full border-4 border-emerald-950 bg-emerald-500 text-xl font-bold text-white shadow-lg shadow-emerald-500/30">
                        {step.number}
                      </div>

                      {/* Icon */}
                      <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-800/50">
                        <IconComponent className="h-6 w-6 text-emerald-200" aria-hidden="true" />
                      </div>

                      <h3 className="mb-2 text-center text-lg font-semibold text-white">{step.title}</h3>
                      <p className="text-center text-sm text-emerald-100">{step.description}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* ============================================
          FEATURED BANNERS - Product Showcase
          Gray background for contrast
          ============================================ */}
      <section className="bg-gray-50 py-16 md:py-24">
        <div className="container">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold text-gray-900 md:text-4xl">Popular vinyl banner sizes</h2>
            <p className="mt-4 text-lg text-gray-700">
              Shop our best-selling banner sizes or request a custom size for your project.
            </p>
          </div>
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {displayProducts.map((product) => (
              <ProductCard
                key={product.id}
                slug={product.slug}
                title={product.title || product.name}
                image={product.image_url}
                specs={product.specs}
                priceFrom={product.base_price}
                badges={product.badges || []}
              />
            ))}
          </div>
          <div className="mt-12 text-center">
            <LinkButton href="/products" variant="outline" size="default">
              View All Products →
            </LinkButton>
          </div>
        </div>
      </section>

      {/* ============================================
          TRUST & CANADA SECTION - Premium Trust Block
          White background with clean layout
          ============================================ */}
      <section className="bg-white py-16 md:py-24">
        <div className="container">
          <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
            {/* Image */}
            <div className="order-2 lg:order-1">
              <div className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-gradient-to-br from-gray-100 to-gray-50 shadow-xl">
                {/* Placeholder for production/machine image */}
                <div className="flex h-full w-full items-center justify-center">
                  <div className="text-center p-8">
                    <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-2xl bg-white shadow-lg">
                      <Printer className="h-10 w-10 text-emerald-500" aria-hidden="true" />
                    </div>
                    <p className="text-lg font-semibold text-gray-700">Production Facility</p>
                    <p className="mt-1 text-sm text-gray-500">Commercial printing equipment</p>
                  </div>
                </div>

                {/* Canadian flag badge */}
                <div className="absolute right-4 top-4 flex items-center gap-2 rounded-full bg-white/95 px-3 py-1.5 text-sm font-medium shadow-lg backdrop-blur">
                  <span className="text-lg">🇨🇦</span>
                  <span className="text-gray-700">Made in Canada</span>
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="order-1 lg:order-2">
              <h2 className="text-3xl font-bold text-gray-900 md:text-4xl">
                Canadian banner printing. <span className="text-emerald-600">Quality you can trust.</span>
              </h2>
              <p className="mt-6 text-lg leading-relaxed text-gray-700">
                We're not a dropshipper. Every vinyl banner, mesh banner, and fabric banner is printed 
                in our Canadian facility on commercial-grade equipment.
              </p>
              <ul className="mt-8 space-y-4">
                <li className="flex items-start gap-4">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-emerald-100">
                    <Check className="h-5 w-5 text-emerald-600" aria-hidden="true" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">Commercial printing equipment</p>
                    <p className="text-gray-700">
                      HP Latex & Mimaki printers for vibrant, UV-resistant prints
                    </p>
                  </div>
                </li>
                <li className="flex items-start gap-4">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-emerald-100">
                    <Check className="h-5 w-5 text-emerald-600" aria-hidden="true" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">Indoor & outdoor banners</p>
                    <p className="text-gray-700">Weather-resistant materials rated for Canadian climates</p>
                  </div>
                </li>
                <li className="flex items-start gap-4">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-emerald-100">
                    <Check className="h-5 w-5 text-emerald-600" aria-hidden="true" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">Satisfaction guarantee</p>
                    <p className="text-gray-700">Free reprints if your banner doesn't meet expectations</p>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================
          BULK ORDERS - Dark emerald accent strip
          Ties into the dark emerald theme
          ============================================ */}
      <section className="bg-emerald-950 py-4">
        <div className="container">
          <div className="flex items-center justify-center gap-2 text-sm text-emerald-100">
            <Users className="h-4 w-4 text-emerald-300" aria-hidden="true" />
            <span>
              Ordering 10+ banners?{' '}
              <Link href="/bulk" className="font-medium text-white hover:text-emerald-200 hover:underline">
                Get volume pricing →
              </Link>
            </span>
          </div>
        </div>
      </section>

      {/* ============================================
          FINAL CTA - High-Converting Bottom Section
          Clean gray background before dark footer
          ============================================ */}
      <section className="relative overflow-hidden bg-gray-100 py-20 md:py-28">

        <div className="container relative">
          <div className="mx-auto max-w-3xl text-center">
            {/* Urgency badge */}
            <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-emerald-600 px-4 py-2 text-sm font-medium text-white shadow-sm">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-white opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-white" />
              </span>
              Orders placed today ship within 48 hours
            </div>

            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl md:text-5xl">
              Order your custom banner today
            </h2>
            <p className="mx-auto mt-6 max-w-xl text-lg leading-relaxed text-gray-700">
              Join thousands of Canadian businesses who trust Banner Direct for vinyl banners, 
              trade show displays, and event signage. Fast printing, nationwide shipping.
            </p>

            {/* CTA buttons */}
            <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <LinkButton href="/products" size="xl" className="min-w-[200px] shadow-lg shadow-emerald-500/25">
                Start Your Order →
              </LinkButton>
              <LinkButton
                href="/templates"
                variant="outline"
                size="lg"
              >
                Browse Templates
              </LinkButton>
            </div>

            {/* Trust indicators */}
            <div className="mt-12 flex flex-wrap items-center justify-center gap-x-8 gap-y-4 text-sm text-gray-700">
              <span className="flex items-center gap-2">
                <Check className="h-5 w-5 text-emerald-600" aria-hidden="true" />
                No account required
              </span>
              <span className="flex items-center gap-2">
                <Check className="h-5 w-5 text-emerald-600" aria-hidden="true" />
                Instant pricing
              </span>
              <span className="flex items-center gap-2">
                <Check className="h-5 w-5 text-emerald-600" aria-hidden="true" />
                Free artwork review
              </span>
              <span className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-emerald-600" aria-hidden="true" />
                Quality guarantee
              </span>
            </div>

            {/* Social proof */}
            <div className="mt-10 border-t border-gray-200 pt-10">
              <p className="text-sm font-medium text-gray-600">
                Trusted by businesses across Canada
              </p>
              <div className="mt-4 flex items-center justify-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <svg
                    key={i}
                    className="h-5 w-5 text-amber-400"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    aria-hidden="true"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
                <span className="ml-2 text-sm text-gray-600">
                  4.9/5 from 500+ orders
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section - Uses Accordion component */}
      <FAQSection />
    </>
  );
}
