import * as React from 'react';
import Link from 'next/link';
import { MapPin, Mail, Phone } from 'lucide-react';
import { Separator } from '@/components/ui/separator';

const footerNavigation = {
  products: [
    { name: 'PVC Banners', href: '/products/pvc-banners' },
    { name: 'PVC Mesh Banners', href: '/products/pvc-mesh-banners' },
    { name: 'Fabric Banners', href: '/products/fabric-banners' },
    { name: 'Retractable Banners', href: '/products/retractable-banners' },
    { name: 'All Products', href: '/products' },
  ],
  company: [
    { name: 'About Us', href: '/about' },
    { name: 'Pricing', href: '/pricing' },
    { name: 'Bulk Orders', href: '/bulk' },
    { name: 'Templates', href: '/templates' },
  ],
  support: [
    { name: 'Help Center', href: '/help' },
    { name: 'File Specs', href: '/help/file-specs' },
    { name: 'Shipping Info', href: '/help/shipping' },
    { name: 'Contact Us', href: '/contact' },
  ],
  legal: [
    { name: 'Privacy Policy', href: '/privacy' },
    { name: 'Terms of Service', href: '/terms' },
    { name: 'Refund Policy', href: '/refunds' },
  ],
};

function Footer() {
  return (
    <footer className="border-t border-gray-200 bg-gray-50" aria-labelledby="footer-heading">
      <h2 id="footer-heading" className="sr-only">
        Footer
      </h2>
      <div className="container py-12 lg:py-16">
        <div className="xl:grid xl:grid-cols-3 xl:gap-8">
          {/* Brand section */}
          <div className="space-y-4">
            <Link href="/" className="inline-block">
              <span className="font-heading text-xl font-bold text-primary">
                Banner<span className="text-gray-900">Direct</span>
              </span>
            </Link>
            <p className="max-w-xs text-sm text-gray-600">
              Custom banners printed in Canada. Quality materials, fast turnaround, and exceptional
              service for events of all sizes.
            </p>
            <div className="inline-flex items-center gap-2 rounded-full border border-red-200 bg-red-50 px-3 py-1 text-sm font-medium text-red-700">
              <MapPin className="h-4 w-4" aria-hidden="true" />
              <span>Made in Canada</span>
            </div>
            <div className="space-y-2 text-sm text-gray-600">
              <a
                href="mailto:hello@bannerdirect.ca"
                className="flex items-center gap-2 transition-colors hover:text-primary"
              >
                <Mail className="h-4 w-4" aria-hidden="true" />
                hello@bannerdirect.ca
              </a>
              <a
                href="tel:+18005551234"
                className="flex items-center gap-2 transition-colors hover:text-primary"
              >
                <Phone className="h-4 w-4" aria-hidden="true" />
                1-800-555-1234
              </a>
            </div>
          </div>

          {/* Navigation sections */}
          <div className="mt-12 grid grid-cols-2 gap-8 xl:col-span-2 xl:mt-0">
            <div className="md:grid md:grid-cols-2 md:gap-8">
              <div>
                <h3 className="text-sm font-semibold text-gray-900">Products</h3>
                <ul role="list" className="mt-4 space-y-3">
                  {footerNavigation.products.map((item) => (
                    <li key={item.name}>
                      <Link
                        href={item.href}
                        className="text-sm text-gray-600 transition-colors hover:text-primary"
                      >
                        {item.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="mt-10 md:mt-0">
                <h3 className="text-sm font-semibold text-gray-900">Company</h3>
                <ul role="list" className="mt-4 space-y-3">
                  {footerNavigation.company.map((item) => (
                    <li key={item.name}>
                      <Link
                        href={item.href}
                        className="text-sm text-gray-600 transition-colors hover:text-primary"
                      >
                        {item.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            <div className="md:grid md:grid-cols-2 md:gap-8">
              <div>
                <h3 className="text-sm font-semibold text-gray-900">Support</h3>
                <ul role="list" className="mt-4 space-y-3">
                  {footerNavigation.support.map((item) => (
                    <li key={item.name}>
                      <Link
                        href={item.href}
                        className="text-sm text-gray-600 transition-colors hover:text-primary"
                      >
                        {item.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="mt-10 md:mt-0">
                <h3 className="text-sm font-semibold text-gray-900">Legal</h3>
                <ul role="list" className="mt-4 space-y-3">
                  {footerNavigation.legal.map((item) => (
                    <li key={item.name}>
                      <Link
                        href={item.href}
                        className="text-sm text-gray-600 transition-colors hover:text-primary"
                      >
                        {item.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>

        <Separator className="my-8 bg-gray-200" />

        <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
          <p className="text-sm text-gray-500">
            &copy; {new Date().getFullYear()} Banner Direct. All rights reserved.
          </p>
          <p className="text-sm text-gray-500">
            Proudly serving Canadian businesses coast to coast.
          </p>
        </div>
      </div>
    </footer>
  );
}

export { Footer };
