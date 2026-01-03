'use client';

import * as React from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { ShoppingCart } from 'lucide-react';
import { useAuthForm } from '@/hooks/use-auth-form';
import {
  AuthCard,
  AuthCardHeader,
  AuthCardContent,
  AuthCardFooter,
  AuthHeader,
  AuthTabs,
  AuthTabsList,
  AuthTabsTrigger,
  AuthTabsContent,
  PasswordForm,
  MagicLinkForm,
  AuthFeedback,
} from '@/components/auth';

/**
 * LoginForm - Client Component for login functionality
 * Uses Radix Tabs for accessible tab navigation between auth methods
 */
export function LoginForm() {
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get('redirectTo') || '/account';
  const message = searchParams.get('message');

  const {
    isLoading,
    error,
    isAuthenticated,
    isAnonymous,
    isAuthLoading,
    signInWithPassword,
    signInWithMagicLink,
    clearError,
  } = useAuthForm();

  // Redirect if already authenticated (not anonymous)
  React.useEffect(() => {
    if (!isAuthLoading && isAuthenticated && !isAnonymous) {
      window.location.href = redirectTo;
    }
  }, [isAuthLoading, isAuthenticated, isAnonymous, redirectTo]);

  const handlePasswordSubmit = async (email, password) => {
    const result = await signInWithPassword(email, password);
    if (!result.error) {
      window.location.href = redirectTo;
    }
  };

  const handleMagicLinkSubmit = async (email) => {
    return signInWithMagicLink(email, `${window.location.origin}${redirectTo}`);
  };

  return (
    <AuthCard>
      <AuthCardHeader>
        <AuthHeader
          title="Welcome back"
          description={message || 'Sign in to your account to continue'}
        />
      </AuthCardHeader>

      <AuthCardContent>
        {/* Anonymous user notice */}
        {isAnonymous && !isAuthLoading && (
          <AuthFeedback variant="info" className="mb-6">
            <div className="flex items-start gap-3">
              <ShoppingCart className="mt-0.5 h-5 w-5 shrink-0" aria-hidden="true" />
              <div>
                <p className="font-medium">Your cart is safe!</p>
                <p className="text-sm opacity-90">Sign in to keep all your items and uploads.</p>
              </div>
            </div>
          </AuthFeedback>
        )}

        {/* Auth method tabs */}
        <AuthTabs defaultValue="password" onValueChange={clearError}>
          <AuthTabsList>
            <AuthTabsTrigger value="password">Password</AuthTabsTrigger>
            <AuthTabsTrigger value="magic-link">Magic Link</AuthTabsTrigger>
          </AuthTabsList>

          <AuthTabsContent value="password">
            <PasswordForm
              onSubmit={handlePasswordSubmit}
              isLoading={isLoading}
              error={error}
              showForgotLink
            />
          </AuthTabsContent>

          <AuthTabsContent value="magic-link">
            <MagicLinkForm onSubmit={handleMagicLinkSubmit} isLoading={isLoading} error={error} />
          </AuthTabsContent>
        </AuthTabs>
      </AuthCardContent>

      <AuthCardFooter>
        <p className="text-gray-600">
          Don't have an account?{' '}
          <Link
            href={`/signup${redirectTo !== '/account' ? `?redirectTo=${encodeURIComponent(redirectTo)}` : ''}`}
            className="font-medium text-emerald-600 hover:text-emerald-700 hover:underline"
          >
            Create one
          </Link>
        </p>
      </AuthCardFooter>
    </AuthCard>
  );
}
