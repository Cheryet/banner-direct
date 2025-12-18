/**
 * =============================================================================
 * SUPABASE SERVER CLIENT
 * =============================================================================
 *
 * This module provides a Supabase client for use in SERVER-SIDE contexts:
 * - Server Components (RSC)
 * - Route Handlers (API routes)
 * - Server Actions
 *
 * WHY THIS EXISTS:
 * ----------------
 * Next.js App Router requires different Supabase client configurations for
 * server vs client contexts. The server client uses cookies via Next.js
 * headers() to maintain session state across requests.
 *
 * WHEN TO USE:
 * ------------
 * ✅ Server Components - fetching data with user context
 * ✅ Route Handlers - API endpoints that need auth
 * ✅ Server Actions - form submissions with auth
 *
 * WHEN NOT TO USE:
 * ----------------
 * ❌ Client Components - use client.js instead
 * ❌ Browser-side auth actions (sign in/out) - use client.js
 * ❌ Real-time subscriptions - use client.js
 * ❌ Middleware - use middleware.js version instead
 *
 * SECURITY NOTES:
 * ---------------
 * - This client uses the ANON key, not the service role key
 * - RLS policies are enforced based on the user's session
 * - Never expose the service role key in any client code
 *
 * COOKIE HANDLING:
 * ----------------
 * The setAll() method may fail silently in Server Components because
 * you cannot set cookies after the response has started streaming.
 * This is expected behavior - the middleware handles session refresh.
 *
 * =============================================================================
 */

import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

// =============================================================================
// ENVIRONMENT VALIDATION
// =============================================================================

/**
 * Validates that required Supabase environment variables are configured.
 *
 * Required variables:
 * - NEXT_PUBLIC_SUPABASE_URL: Your Supabase project URL
 * - NEXT_PUBLIC_SUPABASE_ANON_KEY: Your Supabase anonymous/public key
 *
 * These are safe to expose to the client (NEXT_PUBLIC_ prefix).
 * The anon key is designed to be public and works with RLS.
 *
 * @returns {boolean} True if Supabase is properly configured
 */
export function isSupabaseConfigured() {
  return !!(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
}

// =============================================================================
// SERVER CLIENT FACTORY
// =============================================================================

/**
 * Creates a Supabase client configured for server-side use.
 *
 * This function is async because it needs to await the cookies() call
 * in Next.js 14+ App Router.
 *
 * @returns {Promise<import('@supabase/supabase-js').SupabaseClient | null>}
 *          Supabase client instance or null if not configured
 *
 * @example
 * // In a Server Component
 * export default async function ProfilePage() {
 *   const supabase = await createClient();
 *   if (!supabase) return <div>Supabase not configured</div>;
 *
 *   const { data: { user } } = await supabase.auth.getUser();
 *   // ... rest of component
 * }
 *
 * @example
 * // In a Route Handler
 * export async function GET() {
 *   const supabase = await createClient();
 *   const { data } = await supabase.from('products').select('*');
 *   return Response.json(data);
 * }
 */
export async function createClient() {
  // Return null if Supabase is not configured
  // This allows the app to run without Supabase during development
  if (!isSupabaseConfigured()) {
    return null;
  }

  // Get the cookie store from Next.js
  // This must be awaited in Next.js 14+
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: {
        /**
         * Retrieves all cookies from the request.
         * Used by Supabase to read the session token.
         */
        getAll() {
          return cookieStore.getAll();
        },

        /**
         * Sets cookies in the response.
         *
         * IMPORTANT: This will fail silently in Server Components because
         * you cannot modify cookies after the response starts streaming.
         * This is expected - the middleware handles session refresh.
         *
         * @param {Array<{name: string, value: string, options: object}>} cookiesToSet
         */
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // Silent catch is intentional here.
            // When called from a Server Component, cookies cannot be set
            // because the response has already started streaming.
            // The middleware.js handles session refresh instead.
          }
        },
      },
    }
  );
}

// =============================================================================
// CONVENIENCE FUNCTIONS FOR SERVER COMPONENTS
// =============================================================================

/**
 * Gets the current authenticated user from the server.
 *
 * IMPORTANT: Always use getUser() instead of getSession() for security.
 * getUser() validates the JWT with Supabase, while getSession() only
 * reads from cookies which could be tampered with.
 *
 * @returns {Promise<{user: object | null, error: object | null}>}
 *
 * @example
 * // In a Server Component
 * const { user } = await getUser();
 * if (user) {
 *   console.log('User ID:', user.id);
 *   console.log('Is anonymous:', user.is_anonymous);
 * }
 */
export async function getUser() {
  const supabase = await createClient();

  if (!supabase) {
    return { user: null, error: null };
  }

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();
  return { user, error };
}

/**
 * Gets the current session from the server.
 *
 * NOTE: For security-sensitive operations, prefer getUser() which
 * validates the JWT with Supabase servers.
 *
 * @returns {Promise<{session: object | null, error: object | null}>}
 */
export async function getSession() {
  const supabase = await createClient();

  if (!supabase) {
    return { session: null, error: null };
  }

  const {
    data: { session },
    error,
  } = await supabase.auth.getSession();
  return { session, error };
}

// =============================================================================
// ADMIN CLIENT (SERVICE ROLE - BYPASSES RLS)
// =============================================================================

/**
 * Creates a Supabase client with service role key for admin operations.
 * This client bypasses RLS and should ONLY be used in server-side admin contexts.
 *
 * SECURITY WARNING:
 * - Never expose this client to the browser
 * - Only use in Server Components, Route Handlers, or Server Actions
 * - Verify admin authorization before using
 *
 * @returns {import('@supabase/supabase-js').SupabaseClient | null}
 */
export async function createAdminClient() {
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!isSupabaseConfigured() || !serviceRoleKey) {
    console.warn('[Supabase] Service role key not configured, falling back to anon client');
    return createClient();
  }

  const { createClient: createSupabaseClient } = await import('@supabase/supabase-js');

  return createSupabaseClient(process.env.NEXT_PUBLIC_SUPABASE_URL, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}
