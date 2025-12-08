'use client';

import * as React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import {
  DollarSign,
  FileImage,
  Truck,
  Users,
  Mail,
  Upload,
  Printer,
  Package,
  Check,
  MapPin,
  Shield,
  RotateCcw,
  Clock,
  ChevronRight,
} from 'lucide-react';

// =============================================================================
// QUICK NAV SECTIONS
// =============================================================================
const navSections = [
  { id: 'ordering', label: 'Ordering & Pricing', icon: DollarSign },
  { id: 'artwork', label: 'Artwork & Files', icon: FileImage },
  { id: 'production', label: 'Production & Shipping', icon: Truck },
  { id: 'bulk', label: 'Bulk Orders', icon: Users },
  { id: 'contact', label: 'Contact & Support', icon: Mail },
];

// =============================================================================
// FAQ DATA BY CATEGORY
// =============================================================================
const faqCategories = {
  ordering: {
    title: 'Ordering & Pricing',
    intro: "Clear pricing, no surprises. Here's how it works.",
    questions: [
      {
        q: 'How does pricing work?',
        a: "Pricing is based on size, material, and quantity. You'll see your exact price in the product builder before checkout — no hidden fees.",
      },
      {
        q: 'Do prices update automatically with quantity?',
        a: 'Yes. As you increase quantity, per-unit pricing drops automatically. Volume discounts are applied in real-time.',
      },
      {
        q: 'Can I reorder at the same price?',
        a: 'Yes, as long as specifications are the same. We save your order details for easy reordering. Prices may adjust if material costs change significantly.',
      },
      {
        q: 'Is there a minimum order?',
        a: 'No minimum for standard orders. You can order a single banner. For bulk pricing (10+ units), discounts are applied automatically.',
      },
      {
        q: 'Do prices include tax?',
        a: 'Prices shown are before applicable taxes. GST/HST is calculated at checkout based on your shipping location.',
      },
    ],
  },
  artwork: {
    title: 'Artwork & File Setup',
    intro: "We review every file before printing. If something's off, we'll contact you.",
    questions: [
      {
        q: 'What file formats do you accept?',
        a: 'PDF, AI, EPS, JPG, PNG, and TIFF. Vector files (PDF, AI, EPS) give the best results. For images, 150 DPI at full size is recommended.',
      },
      {
        q: 'What resolution should my artwork be?',
        a: "For banners, 150 DPI at actual print size is ideal. Lower resolution may appear pixelated. We'll flag any issues before printing.",
      },
      {
        q: "What happens if my artwork isn't print-ready?",
        a: "We review every file. If there's an issue (low resolution, missing fonts, wrong dimensions), we'll email you before proceeding. No surprises.",
      },
      {
        q: 'Can I get a proof before printing?',
        a: "Yes. Select 'Request design proof' during checkout (+$10, adds 1 business day). We'll email a digital proof for your approval.",
      },
      {
        q: 'Do you offer design services?',
        a: 'Basic design assistance is included for bulk orders. For custom design work, contact us for a quote.',
      },
    ],
  },
  production: {
    title: 'Production & Shipping',
    intro: 'Printed and shipped from Canada for faster delivery and better quality control.',
    questions: [
      {
        q: 'How long does production take?',
        a: 'Standard production is 5–7 business days. Rush (2–3 days) and same-day options are available for an additional fee.',
      },
      {
        q: 'How long does shipping take?',
        a: 'Ontario & Quebec: 1–3 days. Western Canada: 3–5 days. Atlantic Canada: 3–5 days. Northern regions: 5–10 days.',
      },
      {
        q: 'Do you ship outside of Canada?',
        a: "Currently, we only ship within Canada. We're working on US shipping — sign up for updates.",
      },
      {
        q: 'Can I pick up my order locally?',
        a: "Yes! Local pickup is available at our Toronto facility at no charge. Select 'Local Pickup' during checkout.",
      },
      {
        q: 'How do I track my order?',
        a: "You'll receive tracking information via email once your order ships. All orders include tracking.",
      },
    ],
  },
  bulk: {
    title: 'Bulk Orders & Custom Jobs',
    intro: "Ordering 10+ banners? Here's what you need to know.",
    questions: [
      {
        q: 'When does bulk pricing apply?',
        a: 'Volume discounts start at 5 units and increase with quantity. For 25+ banners, contact our bulk team for custom quotes.',
      },
      {
        q: 'How do bulk quotes work?',
        a: "Submit a quote request with your specifications. We'll respond within 1 business day with pricing and timeline.",
      },
      {
        q: 'Can banners ship to multiple locations?',
        a: 'Yes. We can split shipments to multiple addresses across Canada. Include details in your quote request.',
      },
      {
        q: 'Do you offer net payment terms?',
        a: 'Net 30 terms are available for qualified businesses after credit approval. Contact our enterprise team.',
      },
      {
        q: 'Can I reorder the same banners later?',
        a: 'Yes. We save your artwork and specifications for easy reordering. Just reference your previous order.',
      },
    ],
  },
};

// =============================================================================
// HOW IT WORKS STEPS
// =============================================================================
const howItWorks = [
  { icon: DollarSign, title: 'Choose product', description: 'Pick size, material, and options' },
  { icon: Upload, title: 'Upload artwork', description: 'We review every file' },
  { icon: Printer, title: 'We print', description: 'Quality checked before shipping' },
  { icon: Package, title: 'We ship', description: 'Fast delivery across Canada' },
];

// =============================================================================
// TRUST ITEMS
// =============================================================================
const trustItems = [
  'Commercial-grade printing on HP & Mimaki equipment',
  'Quality checks before every shipment',
  'Reprint or refund if we make a mistake',
  'Responsive Canadian support team',
];

// =============================================================================
// MAIN COMPONENT
// =============================================================================
export default function HelpPage() {
  const scrollToSection = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <>
      {/* ====================================================================
          HERO SECTION
          ==================================================================== */}
      <section className="bg-gradient-to-b from-muted/30 to-background py-16 md:py-24">
        <div className="container">
          <div className="mx-auto max-w-3xl text-center">
            <h1 className="text-3xl font-bold tracking-tight md:text-4xl lg:text-5xl">
              We're Here to Help
            </h1>
            <p className="mt-6 text-lg text-muted-foreground md:text-xl">
              Clear answers, fast support, and transparent printing — every step of the way.
            </p>
            <p className="mt-4 text-sm text-muted-foreground">
              Most questions are answered below. If not, reach out anytime.
            </p>
          </div>
        </div>
      </section>

      {/* ====================================================================
          QUICK HELP NAV - Sticky on desktop
          ==================================================================== */}
      <nav className="sticky top-0 z-40 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container">
          <div className="flex gap-1 overflow-x-auto py-3 md:justify-center md:gap-2">
            {navSections.map((section) => (
              <button
                key={section.id}
                onClick={() => scrollToSection(section.id)}
                className="flex shrink-0 items-center gap-2 rounded-lg border bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-muted focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
              >
                <section.icon className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
                {section.label}
              </button>
            ))}
          </div>
        </div>
      </nav>

      {/* ====================================================================
          HOW IT WORKS STRIP
          ==================================================================== */}
      <section className="border-b py-12 md:py-16">
        <div className="container">
          <h2 className="mb-10 text-center text-xl font-semibold md:text-2xl">
            How It Works
          </h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {howItWorks.map((step, index) => (
              <div key={step.title} className="flex items-start gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-sm font-bold text-primary">
                  {index + 1}
                </div>
                <div>
                  <h3 className="font-semibold">{step.title}</h3>
                  <p className="mt-1 text-sm text-muted-foreground">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ====================================================================
          FAQ SECTIONS
          ==================================================================== */}
      <div className="container py-16 md:py-20">
        <div className="mx-auto max-w-3xl space-y-16">
          {/* Ordering & Pricing */}
          <section id="ordering">
            <h2 className="mb-2 text-2xl font-semibold">{faqCategories.ordering.title}</h2>
            <p className="mb-6 text-muted-foreground">{faqCategories.ordering.intro}</p>
            <Accordion type="single" collapsible className="w-full">
              {faqCategories.ordering.questions.map((faq, index) => (
                <AccordionItem key={index} value={`ordering-${index}`}>
                  <AccordionTrigger className="text-left">{faq.q}</AccordionTrigger>
                  <AccordionContent className="text-muted-foreground">{faq.a}</AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </section>

          {/* Artwork & Files */}
          <section id="artwork">
            <h2 className="mb-2 text-2xl font-semibold">{faqCategories.artwork.title}</h2>
            <p className="mb-6 text-muted-foreground">{faqCategories.artwork.intro}</p>
            <Accordion type="single" collapsible className="w-full">
              {faqCategories.artwork.questions.map((faq, index) => (
                <AccordionItem key={index} value={`artwork-${index}`}>
                  <AccordionTrigger className="text-left">{faq.q}</AccordionTrigger>
                  <AccordionContent className="text-muted-foreground">{faq.a}</AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </section>

          {/* Production & Shipping */}
          <section id="production">
            <div className="mb-6 flex items-start justify-between">
              <div>
                <h2 className="mb-2 text-2xl font-semibold">{faqCategories.production.title}</h2>
                <p className="text-muted-foreground">{faqCategories.production.intro}</p>
              </div>
              <Badge variant="canada" className="shrink-0 gap-1.5">
                <MapPin className="h-3 w-3" aria-hidden="true" />
                Made in Canada
              </Badge>
            </div>
            <Accordion type="single" collapsible className="w-full">
              {faqCategories.production.questions.map((faq, index) => (
                <AccordionItem key={index} value={`production-${index}`}>
                  <AccordionTrigger className="text-left">{faq.q}</AccordionTrigger>
                  <AccordionContent className="text-muted-foreground">{faq.a}</AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </section>

          {/* Bulk Orders */}
          <section id="bulk">
            <h2 className="mb-2 text-2xl font-semibold">{faqCategories.bulk.title}</h2>
            <p className="mb-6 text-muted-foreground">{faqCategories.bulk.intro}</p>
            <Accordion type="single" collapsible className="w-full">
              {faqCategories.bulk.questions.map((faq, index) => (
                <AccordionItem key={index} value={`bulk-${index}`}>
                  <AccordionTrigger className="text-left">{faq.q}</AccordionTrigger>
                  <AccordionContent className="text-muted-foreground">{faq.a}</AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
            <div className="mt-6">
              <Button asChild>
                <Link href="/bulk">
                  Request a Bulk Quote
                  <ChevronRight className="ml-2 h-4 w-4" aria-hidden="true" />
                </Link>
              </Button>
            </div>
          </section>
        </div>
      </div>

      {/* ====================================================================
          CONTACT & SUPPORT SECTION
          ==================================================================== */}
      <section id="contact" className="bg-muted/30 py-16 md:py-20">
        <div className="container">
          <div className="mx-auto max-w-2xl">
            <Card>
              <CardContent className="p-8 text-center">
                <Mail className="mx-auto h-12 w-12 text-primary" aria-hidden="true" />
                <h2 className="mt-4 text-2xl font-semibold">Have a question before ordering?</h2>
                <p className="mt-3 text-muted-foreground">
                  We usually respond within one business day. Real humans, not bots.
                </p>
                <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-center">
                  <Button asChild size="lg">
                    <a href="mailto:support@bannerdirect.ca">
                      <Mail className="mr-2 h-4 w-4" aria-hidden="true" />
                      Email Support
                    </a>
                  </Button>
                  <Button variant="outline" size="lg" asChild>
                    <a href="tel:+18005551234">Call 1-800-555-1234</a>
                  </Button>
                </div>
                <p className="mt-4 text-sm text-muted-foreground">
                  <Clock className="mr-1 inline h-4 w-4" aria-hidden="true" />
                  Monday–Friday, 9am–5pm EST
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* ====================================================================
          WHAT WE STAND BEHIND - Trust closer
          ==================================================================== */}
      <section className="py-16 md:py-20">
        <div className="container">
          <div className="mx-auto max-w-2xl text-center">
            <Shield className="mx-auto mb-4 h-10 w-10 text-primary" aria-hidden="true" />
            <h2 className="text-2xl font-semibold">What We Stand Behind</h2>
            <ul className="mt-6 space-y-3 text-left">
              {trustItems.map((item) => (
                <li key={item} className="flex items-center gap-3">
                  <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10">
                    <Check className="h-4 w-4 text-primary" aria-hidden="true" />
                  </div>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* ====================================================================
          FINAL CTA
          ==================================================================== */}
      <section className="bg-muted/30 py-12 md:py-16">
        <div className="container">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-2xl font-semibold">Still have questions?</h2>
            <p className="mt-3 text-muted-foreground">
              We're happy to help. Or jump straight into your order.
            </p>
            <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:justify-center">
              <Button asChild size="lg">
                <Link href="/product/pvc-banner-3x6">Start Your Order</Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link href="/bulk">Request a Quote</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
