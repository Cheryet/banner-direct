import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { LinkButton } from '@/components/ui/link-button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { HeroSection } from '@/components/layout/hero-section';
import { getProducts } from '@/lib/products';
import { getShippingZones } from '@/lib/db/shipping';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import {
  Check,
  Ruler,
  Upload,
  DollarSign,
  TrendingDown,
  MapPin,
  Truck,
  Clock,
  Printer,
  FileCheck,
  Shield,
  Headphones,
} from 'lucide-react';

export const metadata = {
  title: 'Pricing - Custom Banners | Banner Direct',
  description:
    'Clear, competitive banner pricing. High-quality banners printed in Canada with pricing that scales as you do.',
};

// =============================================================================
// HOW PRICING WORKS - Educational steps
// =============================================================================
const pricingSteps = [
  {
    icon: Ruler,
    title: 'Choose size & material',
    description: 'Pick from standard sizes or request custom dimensions.',
  },
  {
    icon: Upload,
    title: 'Upload artwork',
    description: 'We accept most file formats and review every upload.',
  },
  {
    icon: DollarSign,
    title: 'See instant pricing',
    description: 'Your exact price is shown before you checkout.',
  },
  {
    icon: TrendingDown,
    title: 'Save more with quantity',
    description: 'Per-unit cost drops as your order size increases.',
  },
];

// =============================================================================
// WHAT'S INCLUDED
// =============================================================================
const includedFeatures = [
  { icon: Printer, text: 'Full-color, high-resolution printing' },
  { icon: Shield, text: 'Durable banner materials' },
  { icon: Check, text: 'Standard hemming & grommets' },
  { icon: FileCheck, text: 'Artwork review before production' },
  { icon: Truck, text: 'Canada-wide shipping options' },
  { icon: Headphones, text: 'Canadian customer support' },
];

// =============================================================================
// SHIPPING TIMELINES
// =============================================================================
const shippingInfo = [
  { region: 'Ontario & Quebec', production: '5–7 days', shipping: '1–3 days' },
  { region: 'Western Canada', production: '5–7 days', shipping: '3–5 days' },
  { region: 'Atlantic Canada', production: '5–7 days', shipping: '3–5 days' },
  { region: 'Northern Canada', production: '5–7 days', shipping: '5–10 days' },
];

// =============================================================================
// FAQ
// =============================================================================
const faqs = [
  {
    question: 'Why do prices vary by size and material?',
    answer:
      'Larger banners require more material and printing time. Different materials (vinyl, mesh, fabric) have different base costs and are suited for different uses. Your exact price is always shown before checkout.',
  },
  {
    question: 'Do prices include tax?',
    answer:
      'Prices shown are before applicable taxes. GST/HST will be calculated at checkout based on your shipping location.',
  },
  {
    question: 'Can I reorder at the same price?',
    answer:
      'Yes, as long as the specifications are the same. We save your order details for easy reordering. Prices may adjust if material costs change significantly.',
  },
  {
    question: 'Are volume discounts applied automatically?',
    answer:
      'Yes. When you increase the quantity in the product builder, the per-unit price automatically adjusts to reflect volume savings.',
  },
  {
    question: 'Can I lock in pricing for future orders?',
    answer:
      'For bulk and enterprise customers, we can discuss pricing agreements. Contact our bulk team to learn more about volume commitments.',
  },
];

// =============================================================================
// MAIN COMPONENT
// =============================================================================
export default async function PricingPage() {
  // Fetch products to generate dynamic pricing table
  const products = await getProducts({ limit: 10 });

  // Generate pricing tiers from actual product data
  const pricingTiers = products
    .filter((p) => p.sizes && p.sizes.length > 0)
    .flatMap((p) =>
      p.sizes.slice(0, 3).map((size) => ({
        size: size.label,
        productName: p.name || p.title,
        slug: p.slug,
        vinyl: size.price || p.base_price,
        mesh: (size.price || p.base_price) * 1.1,
        fabric: (size.price || p.base_price) * 1.2,
      }))
    )
    .slice(0, 6);

  return (
    <>
      {/* ====================================================================
          HERO SECTION - Premium with dots texture
          ==================================================================== */}
      <HeroSection
        title="Transparent Banner Pricing"
        titleAccent="No Hidden Fees"
        subtitle="See your exact price before checkout. Volume discounts applied automatically. Quality banners printed in Canada."
        eyebrow="Simple & Clear"
        eyebrowIcon={<DollarSign className="h-4 w-4" />}
        primaryCta={{
          text: 'Build & Price Your Banner',
          href: products[0] ? `/product/${products[0].slug}` : '/products',
        }}
        secondaryCta={{
          text: 'Get Bulk Quote',
          href: '/bulk',
        }}
        texture="dots"
        variant="centered"
      />

      {/* ====================================================================
          HOW PRICING WORKS - Educational strip
          ==================================================================== */}
      <section className="bg-emerald-950 py-16 md:py-20">
        <div className="container">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-sm font-medium uppercase tracking-wider text-emerald-300">Simple Process</p>
            <h2 className="mt-2 text-3xl font-bold text-white md:text-4xl">How Pricing Works</h2>
          </div>
          <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {pricingSteps.map((step, index) => (
              <div key={step.title} className="flex items-start gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-emerald-500 text-lg font-bold text-white shadow-lg shadow-emerald-500/30">
                  {index + 1}
                </div>
                <div>
                  <h3 className="font-semibold text-white">{step.title}</h3>
                  <p className="mt-1 text-sm text-emerald-100">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ====================================================================
          BASE PRICING TABLE
          ==================================================================== */}
      <section className="bg-white py-16 md:py-24">
        <div className="container">
          <div className="mx-auto max-w-4xl">
            <h2 className="mb-8 text-center text-3xl font-bold text-gray-900 md:text-4xl">
              Base Pricing by Size
            </h2>

            {/* Desktop Table */}
            <div className="hidden md:block">
              <div className="overflow-hidden rounded-lg border">
                <table className="w-full">
                  <caption className="sr-only">Banner pricing by size and material</caption>
                  <thead>
                    <tr className="bg-muted/50">
                      <th scope="col" className="p-4 text-left font-semibold">
                        Size
                      </th>
                      <th scope="col" className="p-4 text-center font-semibold">
                        <div className="flex flex-col items-center gap-1">
                          <span>Vinyl</span>
                          <Badge variant="secondary" className="text-xs">
                            Popular
                          </Badge>
                        </div>
                      </th>
                      <th scope="col" className="p-4 text-center font-semibold">
                        Mesh
                      </th>
                      <th scope="col" className="p-4 text-center font-semibold">
                        Fabric
                      </th>
                      <th scope="col" className="p-4 text-center font-semibold">
                        5+ Units
                      </th>
                      <th scope="col" className="p-4 text-center font-semibold">
                        10+ Units
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {pricingTiers.map((tier, index) => (
                      <tr
                        key={tier.size}
                        className={`border-t ${index % 2 === 0 ? 'bg-background' : 'bg-muted/20'}`}
                      >
                        <th scope="row" className="p-4 text-left font-medium">
                          {tier.size}
                        </th>
                        <td className="p-4 text-center">${tier.vinyl.toFixed(2)}</td>
                        <td className="p-4 text-center">${tier.mesh.toFixed(2)}</td>
                        <td className="p-4 text-center">${tier.fabric.toFixed(2)}</td>
                        <td className="p-4 text-center text-green-600">
                          ${(tier.vinyl * 0.9).toFixed(2)}
                        </td>
                        <td className="p-4 text-center text-green-600">
                          ${(tier.vinyl * 0.85).toFixed(2)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Mobile Cards */}
            <div className="space-y-4 md:hidden">
              {pricingTiers.map((tier) => (
                <Card key={tier.size}>
                  <CardContent className="p-4">
                    <h3 className="mb-3 text-lg font-semibold">{tier.size}</h3>
                    <div className="grid grid-cols-3 gap-2 text-center text-sm">
                      <div className="rounded-md bg-muted/50 p-2">
                        <p className="text-xs text-muted-foreground">Vinyl</p>
                        <p className="font-semibold">${tier.vinyl.toFixed(2)}</p>
                      </div>
                      <div className="rounded-md bg-muted/50 p-2">
                        <p className="text-xs text-muted-foreground">Mesh</p>
                        <p className="font-semibold">${tier.mesh.toFixed(2)}</p>
                      </div>
                      <div className="rounded-md bg-muted/50 p-2">
                        <p className="text-xs text-muted-foreground">Fabric</p>
                        <p className="font-semibold">${tier.fabric.toFixed(2)}</p>
                      </div>
                    </div>
                    <div className="mt-3 flex justify-between text-sm">
                      <span className="text-muted-foreground">5+ units:</span>
                      <span className="text-green-600">${(tier.vinyl * 0.9).toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">10+ units:</span>
                      <span className="text-green-600">${(tier.vinyl * 0.85).toFixed(2)}</span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <p className="mt-6 text-center text-sm text-muted-foreground">
              Custom sizes and higher volumes available via{' '}
              <Link href="/bulk" className="text-primary hover:underline">
                bulk orders
              </Link>
              .
            </p>
          </div>
        </div>
      </section>

      {/* ====================================================================
          VOLUME SAVINGS CALLOUT (Dark Emerald)
          ==================================================================== */}
      <section className="bg-emerald-950 py-12 md:py-16">
        <div className="container">
          <div className="mx-auto max-w-2xl text-center">
            <TrendingDown className="mx-auto mb-4 h-10 w-10 text-emerald-300" aria-hidden="true" />
            <h2 className="text-xl font-semibold text-white md:text-2xl">
              The more you order, the lower your per-unit cost.
            </h2>
            <p className="mt-3 text-emerald-100">
              Volume savings are applied automatically in the product builder. For orders of 25+
              banners, our bulk team can provide custom quotes.
            </p>
            <LinkButton href="/bulk" variant="outline" className="mt-6 border-white text-white hover:bg-white hover:text-emerald-950">
              Learn About Bulk Pricing
            </LinkButton>
          </div>
        </div>
      </section>

      {/* ====================================================================
          WHAT'S INCLUDED IN THE PRICE
          ==================================================================== */}
      <section className="bg-gray-50 py-16 md:py-24">
        <div className="container">
          <div className="mx-auto max-w-3xl">
            <h2 className="mb-8 text-center text-3xl font-bold text-gray-900 md:text-4xl">
              What's Included in Every Order
            </h2>
            <div className="grid gap-4 sm:grid-cols-2">
              {includedFeatures.map((feature) => (
                <div
                  key={feature.text}
                  className="flex items-center gap-4 rounded-xl border border-gray-200 bg-white p-5 shadow-sm transition-shadow hover:shadow-md"
                >
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-emerald-50">
                    <feature.icon className="h-6 w-6 text-emerald-600" aria-hidden="true" />
                  </div>
                  <span className="font-medium text-gray-900">{feature.text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ====================================================================
          SHIPPING & TIMELINES
          ==================================================================== */}
      <section className="bg-white py-16 md:py-24">
        <div className="container">
          <div className="mx-auto max-w-3xl">
            <div className="mb-8 text-center">
              <Badge variant="canada" className="mb-4 gap-1.5">
                <MapPin className="h-3 w-3" aria-hidden="true" />
                Printed in Canada
              </Badge>
              <h2 className="text-3xl font-bold text-gray-900 md:text-4xl">Shipping & Timelines</h2>
              <p className="mt-4 text-lg text-gray-700">
                Printed and shipped from Canada for faster, more reliable delivery.
              </p>
            </div>

            <Card>
              <CardContent className="p-0">
                <div className="overflow-hidden">
                  <table className="w-full">
                    <caption className="sr-only">Shipping timelines by region</caption>
                    <thead>
                      <tr className="border-b bg-muted/50">
                        <th scope="col" className="p-4 text-left font-semibold">
                          Region
                        </th>
                        <th scope="col" className="p-4 text-center font-semibold">
                          Production
                        </th>
                        <th scope="col" className="p-4 text-center font-semibold">
                          Shipping
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {shippingInfo.map((info, index) => (
                        <tr
                          key={info.region}
                          className={index < shippingInfo.length - 1 ? 'border-b' : ''}
                        >
                          <th scope="row" className="p-4 text-left font-medium">
                            {info.region}
                          </th>
                          <td className="p-4 text-center">{info.production}</td>
                          <td className="p-4 text-center">{info.shipping}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>

            <div className="mt-6 flex flex-col gap-2 text-center text-sm text-gray-700">
              <p>
                <Clock className="mr-1 inline h-4 w-4" aria-hidden="true" />
                Rush production (2–3 days) available for an additional fee.
              </p>
              <p>Timelines may vary by volume and location. Local pickup available in Toronto.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ====================================================================
          BULK & ENTERPRISE CTA (Dark Emerald)
          ==================================================================== */}
      <section className="bg-emerald-950 py-16 md:py-20">
        <div className="container">
          <div className="mx-auto max-w-3xl rounded-2xl border border-emerald-800/50 bg-emerald-900/30 p-8 text-center">
            <h2 className="text-xl font-semibold text-white md:text-2xl">
              Ordering 25+ banners or need custom specs?
            </h2>
            <p className="mt-3 text-emerald-100">
              Volume pricing • Dedicated support • Consistent results
            </p>
            <LinkButton href="/bulk" size="lg" className="mt-6 bg-white text-emerald-950 hover:bg-gray-100">
              Bulk Orders & Enterprise Pricing
            </LinkButton>
          </div>
        </div>
      </section>

      {/* ====================================================================
          FAQ - Pricing-specific
          ==================================================================== */}
      <section className="bg-gray-50 py-16 md:py-24">
        <div className="container">
          <div className="mx-auto max-w-2xl">
            <h2 className="mb-8 text-center text-3xl font-bold text-gray-900 md:text-4xl">
              Pricing Questions
            </h2>
            <Accordion type="single" collapsible className="w-full">
              {faqs.map((faq, index) => (
                <AccordionItem key={index} value={`faq-${index}`}>
                  <AccordionTrigger className="text-left">{faq.question}</AccordionTrigger>
                  <AccordionContent className="text-gray-700">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>
      </section>

      {/* ====================================================================
          FINAL CTA STRIP
          ==================================================================== */}
      <section className="bg-white py-16 md:py-24">
        <div className="container">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold text-gray-900 md:text-4xl">Ready to price your banner?</h2>
            <p className="mt-4 text-lg text-gray-700">
              See your exact price in the product builder — no surprises.
            </p>
            <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:justify-center">
              <LinkButton
                href={products[0] ? `/product/${products[0].slug}` : '/products'}
                size="lg"
              >
                Start Designing
              </LinkButton>
              <LinkButton href="/bulk" variant="outline" size="lg">
                Request Bulk Quote
              </LinkButton>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
