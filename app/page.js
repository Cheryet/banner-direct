import Link from 'next/link';
import { products } from '@/lib/mock-data';
import { Card, CardContent } from '@/components/ui/card';
import { ProductCard } from '@/components/product/product-card';
import { LinkButton } from '@/components/ui/link-button';
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
} from 'lucide-react';

// Use cases for the "Perfect for Any Occasion" section
const useCases = [
  {
    icon: PartyPopper,
    title: 'Events & Fundraisers',
    description: 'Birthdays, weddings, charity runs, and community events.',
  },
  {
    icon: Building2,
    title: 'Trade Shows',
    description: 'Professional displays that make your booth stand out.',
  },
  {
    icon: Store,
    title: 'Small Businesses',
    description: 'Storefronts, sales, grand openings, and promotions.',
  },
  {
    icon: Users,
    title: 'Corporate & Bulk Orders',
    description: 'Consistent branding across locations with volume pricing.',
  },
];

// How it works steps
const steps = [
  {
    number: 1,
    icon: Package,
    title: 'Choose your banner',
    description: 'Pick a size and material that fits your needs.',
  },
  {
    number: 2,
    icon: Upload,
    title: 'Upload artwork or start from a template',
    description: 'We accept most file formats and check every upload.',
  },
  {
    number: 3,
    icon: Truck,
    title: 'We print & ship fast across Canada',
    description: 'Standard, rush, or same-day options available.',
  },
];

// Featured banner sizes for the money section
const featuredProducts = products.slice(0, 4);

export default function Home() {
  return (
    <>
      {/* ============================================
          HERO SECTION - Premium E-Commerce Style
          Clean white with emerald accents
          ============================================ */}
      <section className="relative overflow-hidden bg-white">
        {/* Subtle gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-50/50 via-transparent to-transparent" aria-hidden="true" />
        
        <div className="container relative">
          <div className="grid min-h-[80vh] items-center gap-12 py-16 lg:grid-cols-2 lg:py-20">
            {/* Left Column - Content */}
            <div className="max-w-xl">
              {/* Trust badge - Premium style */}
              <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-emerald-50 px-4 py-2 text-sm font-medium text-emerald-700">
                <MapPin className="h-4 w-4" aria-hidden="true" />
                Proudly Made in Canada
              </div>

              <h1 className="text-4xl font-bold tracking-tight text-gray-900 md:text-5xl lg:text-6xl">
                Your banner,{' '}
                <span className="text-primary">your way</span>
              </h1>
              <p className="mt-6 text-lg leading-relaxed text-gray-600 md:text-xl">
                Custom banners printed on commercial equipment. Fast turnaround, durable materials, and shipped across Canada.
              </p>

              {/* CTAs - Premium button styling */}
              <div className="mt-10 flex flex-col gap-4 sm:flex-row">
                <LinkButton href="/product/pvc-banner-3x6" size="lg">
                  Start Creating →
                </LinkButton>
                <LinkButton href="/bulk" variant="outline" size="lg">
                  Get Bulk Pricing
                </LinkButton>
              </div>

              {/* Trust indicators - Clean horizontal layout */}
              <div className="mt-12 flex flex-wrap items-center gap-6 text-sm text-gray-500">
                <span className="flex items-center gap-2">
                  <Check className="h-5 w-5 text-emerald-500" aria-hidden="true" />
                  Free artwork review
                </span>
                <span className="flex items-center gap-2">
                  <Check className="h-5 w-5 text-emerald-500" aria-hidden="true" />
                  Fast shipping
                </span>
                <span className="flex items-center gap-2">
                  <Check className="h-5 w-5 text-emerald-500" aria-hidden="true" />
                  Quality guarantee
                </span>
              </div>
            </div>

            {/* Right Column - Visual */}
            <div className="relative lg:pl-8">
              <div className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-gradient-to-br from-gray-100 to-gray-50 shadow-2xl lg:aspect-[5/4]">
                {/* Placeholder for real banner photo */}
                <div className="flex h-full w-full items-center justify-center">
                  <div className="text-center p-8">
                    <div className="mx-auto mb-4 flex h-24 w-24 items-center justify-center rounded-2xl bg-white shadow-lg">
                      <Package className="h-12 w-12 text-emerald-500" aria-hidden="true" />
                    </div>
                    <p className="text-lg font-semibold text-gray-700">
                      Hero Image
                    </p>
                    <p className="mt-1 text-sm text-gray-500">
                      Trade show, event, or storefront banner
                    </p>
                  </div>
                </div>
                
                {/* Floating badge */}
                <div className="absolute bottom-4 left-4 rounded-lg bg-white/95 px-4 py-2 shadow-lg backdrop-blur">
                  <p className="text-xs font-medium text-gray-500">Starting from</p>
                  <p className="text-xl font-bold text-gray-900">$49.99</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================
          USE-CASE SECTION - Premium Card Grid
          Gray background for contrast
          ============================================ */}
      <section className="bg-gray-50 py-16 md:py-24">
        <div className="container">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold text-gray-900 md:text-4xl">
              Perfect for any occasion
            </h2>
            <p className="mt-4 text-lg text-gray-600">
              From backyard parties to national trade shows — we've got you covered.
            </p>
          </div>
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {useCases.map((useCase) => (
              <Card
                key={useCase.title}
                className="group cursor-pointer border border-gray-200 bg-white shadow-sm transition-all duration-200 hover:-translate-y-1 hover:border-emerald-200 hover:shadow-md"
              >
                <CardContent className="p-6">
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-50 transition-colors group-hover:bg-emerald-100">
                    <useCase.icon className="h-6 w-6 text-emerald-600" aria-hidden="true" />
                  </div>
                  <h3 className="mb-2 font-semibold text-gray-900">{useCase.title}</h3>
                  <p className="text-sm leading-relaxed text-gray-600">{useCase.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* ============================================
          HOW IT WORKS - Clean 3-Step Process
          White background with emerald accents
          ============================================ */}
      <section className="bg-white py-16 md:py-24">
        <div className="container">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold text-gray-900 md:text-4xl">
              How it works
            </h2>
            <p className="mt-4 text-lg text-gray-600">
              Three simple steps to your custom banner.
            </p>
          </div>

          {/* Steps - Clean horizontal layout */}
          <div className="mt-16 grid gap-8 md:grid-cols-3">
            {steps.map((step, index) => (
              <div key={step.number} className="relative text-center">
                {/* Connector line (desktop only) */}
                {index < steps.length - 1 && (
                  <div className="absolute left-[60%] right-0 top-8 hidden h-px bg-gray-200 md:block" aria-hidden="true" />
                )}
                
                {/* Step number */}
                <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500 text-2xl font-bold text-white shadow-lg shadow-emerald-500/30">
                  {step.number}
                </div>
                
                {/* Icon */}
                <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-gray-100">
                  <step.icon className="h-7 w-7 text-gray-600" aria-hidden="true" />
                </div>
                
                <h3 className="mb-2 text-lg font-semibold text-gray-900">{step.title}</h3>
                <p className="text-gray-600">{step.description}</p>
              </div>
            ))}
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
            <h2 className="text-3xl font-bold text-gray-900 md:text-4xl">
              Popular banner sizes
            </h2>
            <p className="mt-4 text-lg text-gray-600">
              Start with our most popular options, or customize your own.
            </p>
          </div>
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {featuredProducts.map((product) => (
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
                Built locally.{' '}
                <span className="text-emerald-600">Trusted nationally.</span>
              </h2>
              <p className="mt-6 text-lg leading-relaxed text-gray-600">
                We're not a dropshipper. Every banner is printed in our Canadian facility on commercial-grade equipment.
              </p>
              <ul className="mt-8 space-y-4">
                <li className="flex items-start gap-4">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-emerald-100">
                    <Check className="h-5 w-5 text-emerald-600" aria-hidden="true" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">Commercial equipment</p>
                    <p className="text-gray-600">HP & Mimaki printers for vibrant, durable prints</p>
                  </div>
                </li>
                <li className="flex items-start gap-4">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-emerald-100">
                    <Check className="h-5 w-5 text-emerald-600" aria-hidden="true" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">Indoor & outdoor rated</p>
                    <p className="text-gray-600">Materials built to last in any environment</p>
                  </div>
                </li>
                <li className="flex items-start gap-4">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-emerald-100">
                    <Check className="h-5 w-5 text-emerald-600" aria-hidden="true" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">Quality guarantee</p>
                    <p className="text-gray-600">We'll reprint if something goes wrong</p>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================
          BULK & ENTERPRISE CTA STRIP
          Emerald accent background
          ============================================ */}
      <section className="bg-emerald-600 py-12 md:py-16">
        <div className="container">
          <div className="flex flex-col items-center gap-6 text-center md:flex-row md:justify-between md:text-left">
            <div>
              <h3 className="text-xl font-semibold text-white md:text-2xl">
                Need something big? We've got you covered.
              </h3>
              <p className="mt-2 text-emerald-100">
                Volume pricing • Consistent production • Easy reorders
              </p>
            </div>
            <LinkButton href="/bulk" variant="outline" className="bg-white text-emerald-600 hover:bg-gray-50">
              Get Bulk Pricing →
            </LinkButton>
          </div>
        </div>
      </section>

      {/* ============================================
          FINAL CTA - Bottom conversion
          Gray background with strong CTA
          ============================================ */}
      <section className="bg-gray-50 py-16 md:py-24">
        <div className="container">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold text-gray-900 md:text-4xl">
              Ready to get started?
            </h2>
            <p className="mt-4 text-lg text-gray-600">
              Create your custom banner in minutes. Printed in Canada, delivered to your door.
            </p>
            <div className="mt-10">
              <LinkButton href="/product/pvc-banner-3x6" size="lg">
                Start Creating →
              </LinkButton>
            </div>
            <p className="mt-6 text-sm text-gray-500">
              No account required • Instant pricing • Free artwork review
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
