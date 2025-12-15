'use client';

/**
 * =============================================================================
 * CLIENT-SIDE PROVIDERS
 * =============================================================================
 *
 * This component wraps the application with necessary client-side context
 * providers. It's a Client Component ('use client') because providers
 * typically need to manage state and effects.
 *
 * INCLUDED PROVIDERS:
 * -------------------
 * - AuthProvider: Manages Supabase authentication state
 *   - Creates anonymous sessions for new visitors
 *   - Listens for auth state changes
 *   - Provides auth context to all components
 *
 * WHY THIS PATTERN:
 * -----------------
 * Next.js App Router requires a clear separation between Server and Client
 * Components. By wrapping providers in a single Client Component, we:
 * - Keep the root layout as a Server Component
 * - Minimize the client-side JavaScript bundle
 * - Provide a single place to add new providers
 *
 * ADDING NEW PROVIDERS:
 * ---------------------
 * To add a new provider (e.g., ThemeProvider, CartProvider):
 * 1. Import it at the top of this file
 * 2. Wrap it around the children in the return statement
 * 3. Providers are applied from outermost to innermost
 *
 * =============================================================================
 */

import * as React from 'react';
import { AuthProvider } from '@/lib/supabase/auth-context';

/**
 * Client-side providers wrapper.
 *
 * @param {object} props
 * @param {React.ReactNode} props.children - The app content to wrap
 * @returns {React.ReactElement}
 */
export function Providers({ children }) {
  return <AuthProvider>{children}</AuthProvider>;
}
