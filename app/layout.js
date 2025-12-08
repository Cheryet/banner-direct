import './globals.css';
import { Inter, Poppins } from 'next/font/google';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';

// =============================================================================
// FONT OPTIMIZATION - Using next/font for automatic optimization
// =============================================================================
const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['500', '600', '700'],
  display: 'swap',
  variable: '--font-poppins',
});

// =============================================================================
// METADATA
// =============================================================================
export const metadata = {
  title: {
    default: 'Banner Direct | Custom Banners Made in Canada',
    template: '%s | Banner Direct',
  },
  description:
    'Custom banners printed in Canada. Same-day design checks. From 1 to 1000. Quality materials, fast turnaround, and exceptional service for events of all sizes.',
  keywords: ['custom banners', 'PVC banners', 'trade show banners', 'Canada', 'printing'],
  authors: [{ name: 'Banner Direct' }],
  metadataBase: new URL('https://bannerdirect.ca'),
  icons: {
    icon: '/images/icons/b-icon.png',
    shortcut: '/images/icons/b-icon.png',
    apple: '/images/icons/b-icon.png',
  },
  openGraph: {
    type: 'website',
    locale: 'en_CA',
    url: 'https://bannerdirect.ca',
    siteName: 'Banner Direct',
    title: 'Banner Direct | Custom Banners Made in Canada',
    description: 'Custom banners printed in Canada. Same-day design checks. From 1 to 1000.',
    images: [
      {
        url: '/images/icons/b-icon.png',
        width: 512,
        height: 512,
        alt: 'Banner Direct',
      },
    ],
  },
  twitter: {
    card: 'summary',
    title: 'Banner Direct | Custom Banners Made in Canada',
    description: 'Custom banners printed in Canada. Same-day design checks. From 1 to 1000.',
    images: ['/images/icons/b-icon.png'],
  },
  robots: {
    index: true,
    follow: true,
  },
};

// =============================================================================
// VIEWPORT - Separate export for Next.js 14
// =============================================================================
export const viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#0EA5A4',
};

// =============================================================================
// ROOT LAYOUT
// =============================================================================
export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${inter.variable} ${poppins.variable}`}>
      <body className="flex min-h-screen flex-col font-sans antialiased">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
