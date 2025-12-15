'use client';

import { usePathname } from 'next/navigation';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';

export default function Template({ children }) {
  const pathname = usePathname();
  
  // Don't show header/footer for admin, auth, or API routes
  const isAdminRoute = pathname?.startsWith('/admin');
  const isAuthRoute = pathname?.startsWith('/login') || pathname?.startsWith('/signup');
  const isApiRoute = pathname?.startsWith('/api');
  const isDebugRoute = pathname?.startsWith('/debug');
  
  if (isAdminRoute || isAuthRoute || isApiRoute || isDebugRoute) {
    return children;
  }
  
  return (
    <>
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
    </>
  );
}
