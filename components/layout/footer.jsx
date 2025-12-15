import * as React from 'react';
import Link from 'next/link';
import { MapPin, Mail, Phone, Leaf } from 'lucide-react';

const footerNavigation = {
  products: [
    { name: 'PVC Banners', href: '/product/pvc-banner-3x6' },
    { name: 'Mesh Banners', href: '/product/pvc-mesh-banner-4x8' },
    { name: 'Fabric Banners', href: '/product/fabric-banner-3x5' },
    { name: 'Retractable Banners', href: '/product/retractable-banner-stand' },
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
    { name: 'FAQs', href: '/help#faqs' },
    { name: 'Shipping Info', href: '/help#shipping' },
    { name: 'Contact Us', href: '/contact' },
  ],
  legal: [
    { name: 'Privacy Policy', href: '/help#privacy' },
    { name: 'Terms of Service', href: '/help#terms' },
    { name: 'Refund Policy', href: '/help#refunds' },
  ],
};

function Footer() {
  return (
    <footer className="bg-gray-900" aria-labelledby="footer-heading">
      <h2 id="footer-heading" className="sr-only">
        Footer
      </h2>

      {/* Top accent bar */}
      <div className="h-1 bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-500" />

      <div className="container py-12 lg:py-16">
        <div className="xl:grid xl:grid-cols-3 xl:gap-8">
          {/* Brand section */}
          <div className="space-y-4">
            <Link href="/" className="inline-block">
              <span className="font-heading text-xl font-bold text-emerald-400">
                Banner<span className="text-white">Direct</span>
              </span>
            </Link>
            <p className="max-w-xs text-sm text-gray-400">
              Custom banners printed in Canada. Quality materials, fast turnaround, and exceptional
              service for events of all sizes.
            </p>
            <div className="flex flex-wrap gap-2">
              <div className="inline-flex items-center gap-2 rounded-full border border-red-500/30 bg-red-500/10 px-3 py-1 text-sm font-medium text-red-400">
                <MapPin className="h-4 w-4" aria-hidden="true" />
                <span>Made in Canada</span>
              </div>
              <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-sm font-medium text-emerald-400">
                <Leaf className="h-4 w-4" aria-hidden="true" />
                <span>Eco-Friendly</span>
              </div>
            </div>
            <div className="space-y-2 pt-2 text-sm text-gray-400">
              <a
                href="mailto:hello@bannerdirect.ca"
                className="flex items-center gap-2 transition-colors hover:text-emerald-400"
              >
                <Mail className="h-4 w-4" aria-hidden="true" />
                hello@bannerdirect.ca
              </a>
              <a
                href="tel:+18005551234"
                className="flex items-center gap-2 transition-colors hover:text-emerald-400"
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
                <h3 className="text-sm font-semibold text-white">Products</h3>
                <ul role="list" className="mt-4 space-y-3">
                  {footerNavigation.products.map((item) => (
                    <li key={item.name}>
                      <Link
                        href={item.href}
                        className="text-sm text-gray-400 transition-colors hover:text-emerald-400"
                      >
                        {item.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="mt-10 md:mt-0">
                <h3 className="text-sm font-semibold text-white">Company</h3>
                <ul role="list" className="mt-4 space-y-3">
                  {footerNavigation.company.map((item) => (
                    <li key={item.name}>
                      <Link
                        href={item.href}
                        className="text-sm text-gray-400 transition-colors hover:text-emerald-400"
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
                <h3 className="text-sm font-semibold text-white">Support</h3>
                <ul role="list" className="mt-4 space-y-3">
                  {footerNavigation.support.map((item) => (
                    <li key={item.name}>
                      <Link
                        href={item.href}
                        className="text-sm text-gray-400 transition-colors hover:text-emerald-400"
                      >
                        {item.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="mt-10 md:mt-0">
                <h3 className="text-sm font-semibold text-white">Legal</h3>
                <ul role="list" className="mt-4 space-y-3">
                  {footerNavigation.legal.map((item) => (
                    <li key={item.name}>
                      <Link
                        href={item.href}
                        className="text-sm text-gray-400 transition-colors hover:text-emerald-400"
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

        {/* Bottom section */}
        <div className="mt-12 border-t border-gray-800 pt-8">
          <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
            <p className="text-sm text-gray-500">
              &copy; {new Date().getFullYear()} Banner Direct. All rights reserved.
            </p>
            <p className="text-sm text-gray-500">
              🍁 Proudly serving Canadian businesses coast to coast.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}

export { Footer };
