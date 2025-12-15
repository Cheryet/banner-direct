/**
 * =============================================================================
 * SUPABASE MIDDLEWARE - SESSION PERSISTENCE
 * =============================================================================
 *
 * This module handles Supabase session management in Next.js middleware.
 * It runs on EVERY request to ensure session continuity.
 *
 * WHY THIS EXISTS:
 * ----------------
 * Supabase auth tokens expire and need to be refreshed. The middleware:
 * 1. Reads the current session from cookies
 * 2. Refreshes expired tokens automatically
 * 3. Writes updated tokens back to cookies
 *
 * Without this, users would be randomly logged out when tokens expire.
 *
 * WHAT THIS DOES:
 * ---------------
 * ✅ Refreshes Supabase auth sessions on every request
 * ✅ Ensures session cookies are properly set in responses
 * ✅ Maintains session continuity between server and client
 * ✅ Allows anonymous users to browse freely
 * ✅ Protects /admin routes (requires admin role)
 * ✅ Protects /account and /orders routes (requires permanent account)
 * ✅ Redirects logged-in users away from /login and /signup
 *
 * ROUTE PROTECTION:
 * -----------------
 * /admin/*     → Requires authenticated user with admin role
 * /account/*   → Requires permanent (non-anonymous) account
 * /orders/*    → Requires permanent (non-anonymous) account
 * /login       → Redirects permanent users to /account
 * /signup      → Redirects permanent users to /account
 * Everything else → Open to all (including anonymous users)
 *
 * EDGE RUNTIME COMPATIBILITY:
 * ---------------------------
 * This code is compatible with Next.js Edge Runtime.
 * It only uses Web APIs available in Edge environments.
 *
 * SECURITY NOTES:
 * ---------------
 * - Uses ANON key only (safe for edge/client)
 * - getUser() validates JWT with Supabase servers
 * - Never trust getSession() alone for security decisions
 *
 * =============================================================================
 */

import { createServerClient } from '@supabase/ssr';
import { NextResponse } from 'next/server';

// =============================================================================
// ENVIRONMENT VALIDATION
// =============================================================================

/**
 * Validates that required Supabase environment variables are configured.
 * @returns {boolean} True if Supabase is properly configured
 */
function isSupabaseConfigured() {
  return !!(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
}

// =============================================================================
// SESSION UPDATE HANDLER
// =============================================================================

/**
 * Updates the Supabase auth session in middleware.
 *
 * This function MUST be called on every request to ensure:
 * - Expired tokens are refreshed
 * - Session cookies are properly maintained
 * - Server and client have consistent auth state
 *
 * CRITICAL: Do not add auth enforcement logic here yet.
 * This is infrastructure-only - just session persistence.
 *
 * @param {import('next/server').NextRequest} request - The incoming request
 * @returns {Promise<import('next/server').NextResponse>} The response with updated cookies
 *
 * @example
 * // In middleware.js at project root
 * import { updateSession } from '@/lib/supabase/middleware';
 *
 * export async function middleware(request) {
 *   return await updateSession(request);
 * }
 */
export async function updateSession(request) {
  // If Supabase is not configured, pass through without modification
  // This allows the app to run without Supabase during development
  if (!isSupabaseConfigured()) {
    return NextResponse.next({ request });
  }

  // Create the initial response
  // We'll modify this if cookies need to be set
  let supabaseResponse = NextResponse.next({
    request,
  });

  // Create a Supabase client configured for middleware
  // This client can both read and write cookies
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: {
        /**
         * Reads all cookies from the incoming request.
         * Used by Supabase to get the current session token.
         */
        getAll() {
          return request.cookies.getAll();
        },

        /**
         * Sets cookies in both the request and response.
         *
         * This two-step process is necessary because:
         * 1. Setting on request.cookies makes them available to Server Components
         * 2. Setting on response.cookies sends them back to the browser
         *
         * @param {Array<{name: string, value: string, options: object}>} cookiesToSet
         */
        setAll(cookiesToSet) {
          // First, set cookies on the request (for downstream Server Components)
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));

          // Create a new response with the modified request
          supabaseResponse = NextResponse.next({
            request,
          });

          // Then, set cookies on the response (to send back to browser)
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  // ==========================================================================
  // CRITICAL: SESSION REFRESH
  // ==========================================================================
  //
  // IMPORTANT: Do not add any logic between createServerClient and getUser().
  // The getUser() call is what triggers the session refresh.
  //
  // We use getUser() instead of getSession() because:
  // - getUser() validates the JWT with Supabase servers
  // - getSession() only reads from cookies (could be tampered with)
  // - getUser() automatically refreshes expired tokens
  // ==========================================================================

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const pathname = request.nextUrl.pathname;

  // ==========================================================================
  // ADMIN ROUTES - Require authenticated admin user
  // ==========================================================================
  if (pathname.startsWith('/admin')) {
    // No user at all - redirect to login
    if (!user) {
      const url = request.nextUrl.clone();
      url.pathname = '/login';
      url.searchParams.set('redirectTo', pathname);
      url.searchParams.set('message', 'Please sign in to access the admin area');
      return NextResponse.redirect(url);
    }

    // Anonymous users cannot access admin
    if (user.is_anonymous) {
      const url = request.nextUrl.clone();
      url.pathname = '/login';
      url.searchParams.set('redirectTo', pathname);
      url.searchParams.set('message', 'Please sign in to access the admin area');
      return NextResponse.redirect(url);
    }

    // Check if user is admin (fetch from profiles table)
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single();

    if (!profile || profile.role !== 'admin') {
      // Not an admin - redirect to home with error
      const url = request.nextUrl.clone();
      url.pathname = '/';
      url.searchParams.set('error', 'unauthorized');
      return NextResponse.redirect(url);
    }
  }

  // ==========================================================================
  // ACCOUNT ROUTES - Require non-anonymous authenticated user
  // ==========================================================================
  const accountPaths = ['/account', '/orders'];
  const isAccountPath = accountPaths.some((path) => pathname.startsWith(path));

  if (isAccountPath) {
    // No user - redirect to login
    if (!user) {
      const url = request.nextUrl.clone();
      url.pathname = '/login';
      url.searchParams.set('redirectTo', pathname);
      return NextResponse.redirect(url);
    }

    // Anonymous users should create an account first
    if (user.is_anonymous) {
      const url = request.nextUrl.clone();
      url.pathname = '/signup';
      url.searchParams.set('redirectTo', pathname);
      url.searchParams.set('message', 'Create an account to view your order history');
      return NextResponse.redirect(url);
    }
  }

  // ==========================================================================
  // AUTH ROUTES - Redirect permanent users away from login/signup
  // ==========================================================================
  const authPaths = ['/login', '/signup'];
  const isAuthPath = authPaths.some((path) => pathname.startsWith(path));

  // Only redirect if user is permanent (not anonymous)
  if (isAuthPath && user && !user.is_anonymous) {
    const redirectTo = request.nextUrl.searchParams.get('redirectTo') || '/account';
    const url = request.nextUrl.clone();
    url.pathname = redirectTo;
    url.search = '';
    return NextResponse.redirect(url);
  }

  // ==========================================================================
  // ALL OTHER ROUTES - Allow access (including anonymous users)
  // ==========================================================================
  // Anonymous users can freely browse:
  // - Homepage, products, templates, pricing, help, etc.
  // - Cart (their cart is tied to their anonymous session)
  // - Checkout (they can complete purchases as guests)
  // ==========================================================================

  return supabaseResponse;
}
