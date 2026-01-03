'use client';

import Link from 'next/link';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

const faqs = [
  {
    id: 'durability',
    question: 'How long do custom banners last outdoors?',
    answer: (
      <>
        Our vinyl banners are rated for 2-3 years of outdoor use in typical Canadian weather conditions.
        We use UV-resistant inks and weather-resistant materials that withstand rain, snow, and sun exposure.
        For extended outdoor use, we recommend our 18oz heavy-duty vinyl or mesh banners.
      </>
    ),
  },
  {
    id: 'size',
    question: 'What size banner should I order?',
    answer: (
      <>
        The most popular size is 3×6 feet, which works well for most events and storefronts.
        For trade show booths, 8×3 feet is common. For building facades or large outdoor displays,
        consider 4×8 feet or larger. Not sure?{' '}
        <Link href="/contact" className="text-emerald-600 hover:underline">
          Contact us
        </Link>{' '}
        for a free consultation.
      </>
    ),
  },
  {
    id: 'waterproof',
    question: 'Are your banners waterproof?',
    answer: (
      <>
        Yes, all our vinyl and mesh banners are fully waterproof. The PVC material and latex inks
        we use are designed for outdoor use and will not be damaged by rain or moisture.
        Fabric banners are water-resistant but best suited for indoor use or covered outdoor areas.
      </>
    ),
  },
  {
    id: 'shipping',
    question: 'Do you ship banners across Canada?',
    answer: (
      <>
        Yes, we ship to all provinces and territories across Canada. Standard shipping takes 5-7 business days,
        with rush options available for 2-3 day delivery. Free shipping is available on orders over $200.
        All orders include tracking and are shipped from our facility in Ontario.
      </>
    ),
  },
  {
    id: 'file-formats',
    question: 'What file formats do you accept for banner printing?',
    answer: (
      <>
        We accept PDF, AI, EPS, JPG, PNG, and TIFF files. For best results, submit vector files (PDF, AI, EPS)
        or high-resolution images at 150 DPI or higher. Every upload receives a free design review to ensure
        print quality before production.
      </>
    ),
  },
  {
    id: 'vinyl-vs-mesh',
    question: "What's the difference between vinyl and mesh banners?",
    answer: (
      <>
        Vinyl banners (PVC) are solid and offer the most vibrant colors—ideal for most applications.
        Mesh banners have small holes that allow wind to pass through, making them perfect for fences,
        scaffolding, and windy locations. Mesh reduces wind load by up to 70% while maintaining visibility.
      </>
    ),
  },
];

function FAQSection() {
  return (
    <section className="bg-white py-16 md:py-24">
      <div className="container">
        <div className="mx-auto max-w-3xl">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900 md:text-4xl">
              Frequently asked questions
            </h2>
            <p className="mt-4 text-lg text-gray-700">
              Everything you need to know about ordering custom banners in Canada.
            </p>
          </div>

          <Accordion type="single" collapsible className="mt-12">
            {faqs.map((faq) => (
              <AccordionItem key={faq.id} value={faq.id} className="border-gray-200">
                <AccordionTrigger className="text-left text-lg font-semibold text-gray-900 hover:no-underline">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-base text-gray-700">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>

          <div className="mt-12 text-center">
            <p className="text-gray-700">
              Have more questions?{' '}
              <Link href="/help" className="font-medium text-emerald-600 hover:underline">
                Visit our Help Center
              </Link>{' '}
              or{' '}
              <Link href="/contact" className="font-medium text-emerald-600 hover:underline">
                contact our team
              </Link>
              .
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

export { FAQSection };
