/**
 * =============================================================================
 * NEXT.JS MIDDLEWARE
 * =============================================================================
 * 
 * This middleware runs on EVERY request (except static files).
 * Its primary purpose is to maintain Supabase session continuity.
 * 
 * HOW IT WORKS:
 * -------------
 * 1. Request comes in
 * 2. Middleware reads session cookies
 * 3. Supabase validates/refreshes the JWT token
 * 4. Updated cookies are set in the response
 * 5. Request continues to the page/API
 * 
 * WHY THIS MATTERS:
 * -----------------
 * Without this middleware, Supabase sessions would break because:
 * - JWT tokens expire and need refreshing
 * - Server Components can't set cookies after streaming starts
 * - Client and server would have inconsistent auth state
 * 
 * EDGE RUNTIME:
 * -------------
 * This runs in Next.js Edge Runtime for performance.
 * Only Web APIs are available (no Node.js APIs).
 * 
 * =============================================================================
 */

import { updateSession } from '@/lib/supabase/middleware';

/**
 * Middleware function that runs on every matched request.
 * Delegates to Supabase session handler.
 * 
 * @param {import('next/server').NextRequest} request
 * @returns {Promise<import('next/server').NextResponse>}
 */
export async function middleware(request) {
  return await updateSession(request);
}

/**
 * Matcher configuration for the middleware.
 * 
 * This runs on ALL routes EXCEPT:
 * - _next/static (static files like JS/CSS)
 * - _next/image (optimized images)
 * - favicon.ico
 * - Static assets (svg, png, jpg, etc.)
 * 
 * This ensures session refresh happens on page navigations
 * but not on every static asset request (performance).
 */
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - Static image files
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)',
  ],
};
