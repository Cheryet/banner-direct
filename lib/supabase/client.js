/**
 * =============================================================================
 * SUPABASE BROWSER CLIENT
 * =============================================================================
 * 
 * This module provides a Supabase client for use in CLIENT-SIDE contexts:
 * - Client Components (components with 'use client' directive)
 * - Browser-side authentication actions
 * - Real-time subscriptions
 * 
 * WHY THIS EXISTS:
 * ----------------
 * Next.js App Router requires different Supabase client configurations for
 * server vs client contexts. The browser client handles auth state changes
 * and communicates with Supabase directly from the browser.
 * 
 * WHEN TO USE:
 * ------------
 * ✅ Client Components - interactive UI with auth state
 * ✅ Sign in / Sign out actions
 * ✅ Real-time subscriptions
 * ✅ File uploads (Storage)
 * ✅ Anonymous session creation
 * 
 * WHEN NOT TO USE:
 * ----------------
 * ❌ Server Components - use server.js instead
 * ❌ Route Handlers - use server.js instead
 * ❌ Middleware - use middleware.js instead
 * 
 * SECURITY NOTES:
 * ---------------
 * - This client uses the ANON key (safe for browser)
 * - Never import service role keys in this file
 * - RLS policies protect data access
 * - The anon key is designed to be public
 * 
 * SINGLETON PATTERN:
 * ------------------
 * This module uses a singleton pattern to ensure only one Supabase client
 * instance exists in the browser. This prevents memory leaks and ensures
 * consistent auth state across all components.
 * 
 * =============================================================================
 */

import { createBrowserClient } from '@supabase/ssr';

// =============================================================================
// SINGLETON INSTANCE
// =============================================================================

/**
 * Singleton instance of the Supabase browser client.
 * Initialized on first call to createClient().
 * @type {import('@supabase/supabase-js').SupabaseClient | null}
 */
let supabaseInstance = null;

// =============================================================================
// ENVIRONMENT VALIDATION
// =============================================================================

/**
 * Validates that required Supabase environment variables are configured.
 * 
 * Required variables (safe for client - NEXT_PUBLIC_ prefix):
 * - NEXT_PUBLIC_SUPABASE_URL: Your Supabase project URL
 * - NEXT_PUBLIC_SUPABASE_ANON_KEY: Your Supabase anonymous/public key
 * 
 * @returns {boolean} True if Supabase is properly configured
 */
export function isSupabaseConfigured() {
  return !!(
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );
}

// =============================================================================
// BROWSER CLIENT FACTORY
// =============================================================================

/**
 * Creates or returns the singleton Supabase browser client.
 * 
 * Uses singleton pattern to ensure:
 * - Only one WebSocket connection for real-time
 * - Consistent auth state across components
 * - No memory leaks from multiple instances
 * 
 * @returns {import('@supabase/supabase-js').SupabaseClient | null}
 *          Supabase client instance or null if not configured
 * 
 * @example
 * // In a Client Component
 * 'use client';
 * import { createClient } from '@/lib/supabase/client';
 * 
 * export function LoginButton() {
 *   const supabase = createClient();
 *   
 *   const handleLogin = async () => {
 *     await supabase.auth.signInWithPassword({ email, password });
 *   };
 *   
 *   return <button onClick={handleLogin}>Login</button>;
 * }
 */
export function createClient() {
  // Return null if Supabase is not configured
  if (!isSupabaseConfigured()) {
    return null;
  }

  // Return existing instance if already created (singleton)
  if (supabaseInstance) {
    return supabaseInstance;
  }

  // Create new instance using @supabase/ssr for cookie-based auth
  // This ensures client and server share the same session via cookies
  supabaseInstance = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );

  return supabaseInstance;
}

// =============================================================================
// ANONYMOUS SESSION MANAGEMENT
// =============================================================================

/**
 * Ensures the user has an active session.
 * If no session exists, creates an anonymous session automatically.
 * 
 * WHY ANONYMOUS SESSIONS:
 * -----------------------
 * Anonymous sessions allow users to:
 * - Add items to cart before signing up
 * - Save banner configurations
 * - Upload design files
 * - Later upgrade to a permanent account (preserving all data)
 * 
 * This is critical for e-commerce conversion - don't force signup before checkout.
 * 
 * @param {string | null} captchaToken - Optional Turnstile captcha token
 * @returns {Promise<object | null>} The session object or null on failure
 * 
 * @example
 * // In AuthProvider initialization
 * useEffect(() => {
 *   const initSession = async () => {
 *     const session = await ensureSession();
 *     if (session) {
 *       setUser(session.user);
 *     }
 *   };
 *   initSession();
 * }, []);
 */
export async function ensureSession(captchaToken = null) {
  const supabase = createClient();
  
  if (!supabase) {
    console.warn('[Supabase] Not configured - skipping session initialization');
    return null;
  }
  
  // Check for existing session first
  const { data: { session } } = await supabase.auth.getSession();
  
  if (session) {
    // Session exists, return it
    return session;
  }
  
  // No session - create anonymous session for guest user
  // This allows cart, uploads, and configurations before signup
  const signInOptions = captchaToken 
    ? { options: { captchaToken } } 
    : {};
    
  const { data, error } = await supabase.auth.signInAnonymously(signInOptions);
  
  if (error) {
    console.error('[Supabase] Failed to create anonymous session:', error.message);
    return null;
  }
  
  return data.session;
}

// =============================================================================
// ANONYMOUS USER UPGRADE
// =============================================================================

/**
 * Upgrades an anonymous user to a permanent account with email/password.
 * 
 * IMPORTANT: This preserves the user's ID, so all their data (cart, uploads,
 * configurations) remains associated with their account.
 * 
 * @param {object} credentials - The user's new credentials
 * @param {string} credentials.email - User's email address
 * @param {string} credentials.password - User's password (min 8 chars)
 * @returns {Promise<object>} The updated user data
 * @throws {Error} If user is not anonymous or upgrade fails
 * 
 * @example
 * try {
 *   const result = await upgradeAnonymousUser({
 *     email: 'user@example.com',
 *     password: 'securepassword123'
 *   });
 *   console.log('Account created:', result.user.email);
 * } catch (error) {
 *   console.error('Upgrade failed:', error.message);
 * }
 */
export async function upgradeAnonymousUser({ email, password }) {
  const supabase = createClient();
  
  if (!supabase) {
    throw new Error('Supabase not configured');
  }
  
  // Verify current user is anonymous
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    throw new Error('No user session found');
  }
  
  if (!user.is_anonymous) {
    throw new Error('User is not anonymous - cannot upgrade');
  }
  
  // Update the anonymous user with email/password
  // This converts them to a permanent user while keeping the same user.id
  const { data, error } = await supabase.auth.updateUser({
    email,
    password,
  });
  
  if (error) {
    throw error;
  }
  
  return data;
}

/**
 * Upgrades an anonymous user via magic link (passwordless).
 * 
 * The user will receive an email with a login link.
 * Once clicked, their anonymous account becomes permanent.
 * 
 * @param {string} email - User's email address
 * @returns {Promise<object>} The update result
 * @throws {Error} If user is not anonymous or upgrade fails
 */
export async function upgradeAnonymousUserWithMagicLink(email) {
  const supabase = createClient();
  
  if (!supabase) {
    throw new Error('Supabase not configured');
  }
  
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    throw new Error('No user session found');
  }
  
  if (!user.is_anonymous) {
    throw new Error('User is not anonymous - cannot upgrade');
  }
  
  // Link email to anonymous account
  const { data, error } = await supabase.auth.updateUser({
    email,
  });
  
  if (error) {
    throw error;
  }
  
  return data;
}
