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
  SignupForm,
  AuthFeedback,
  EmailConfirmationNotice,
} from '@/components/auth';
import { useAuth } from '@/lib/supabase/auth-context';

/**
 * SignupFormWrapper - Client Component for signup functionality
 * Handles account creation and email confirmation flows
 */
export function SignupFormWrapper() {
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get('redirectTo') || '/account';
  const message = searchParams.get('message');

  const { signUp: authSignUp, resendConfirmation } = useAuth();
  const { isAnonymous, isAuthLoading } = useAuthForm();

  const [formError, setFormError] = React.useState(null);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [showConfirmation, setShowConfirmation] = React.useState(false);
  const [submittedEmail, setSubmittedEmail] = React.useState('');
  const [isResending, setIsResending] = React.useState(false);
  const [resendSuccess, setResendSuccess] = React.useState(false);

  const handleSignup = async (data) => {
    setIsSubmitting(true);
    setFormError(null);

    const result = await authSignUp(data.email, data.password, {
      firstName: data.firstName,
      lastName: data.lastName,
      phone: data.phone,
    });

    if (result.error) {
      setFormError(result.error.message);
      setIsSubmitting(false);
      return;
    }

    // If upgrading from anonymous, redirect immediately
    if (isAnonymous) {
      window.location.href = redirectTo;
      return;
    }

    // New account - show email confirmation
    setSubmittedEmail(data.email);
    setShowConfirmation(true);
    setIsSubmitting(false);
  };

  const handleResendConfirmation = async () => {
    setIsResending(true);
    setResendSuccess(false);

    // Use Supabase resend functionality
    if (resendConfirmation) {
      await resendConfirmation(submittedEmail);
    }

    setIsResending(false);
    setResendSuccess(true);
  };

  // Show email confirmation notice after successful signup
  if (showConfirmation) {
    return (
      <AuthCard>
        <AuthCardContent className="pt-8">
          <EmailConfirmationNotice
            email={submittedEmail}
            onResend={handleResendConfirmation}
            isResending={isResending}
            resendSuccess={resendSuccess}
          />
        </AuthCardContent>
        <AuthCardFooter>
          <Link
            href="/"
            className="font-medium text-emerald-600 hover:text-emerald-700 hover:underline"
          >
            Continue browsing
          </Link>
        </AuthCardFooter>
      </AuthCard>
    );
  }

  // Determine title and description based on anonymous status
  const title = isAnonymous ? 'Save Your Progress' : 'Create an Account';
  const description =
    message ||
    (isAnonymous
      ? 'Create an account to save your cart and order history'
      : 'Join Banner Direct to start ordering custom banners');

  return (
    <AuthCard>
      <AuthCardHeader>
        <AuthHeader title={title} description={description} />
      </AuthCardHeader>

      <AuthCardContent>
        {/* Anonymous user notice */}
        {isAnonymous && !isAuthLoading && (
          <AuthFeedback variant="info" className="mb-6">
            <div className="flex items-start gap-3">
              <ShoppingCart className="mt-0.5 h-5 w-5 shrink-0" aria-hidden="true" />
              <div>
                <p className="font-medium">Your cart is safe!</p>
                <p className="text-sm opacity-90">
                  Creating an account will keep all your items and uploads.
                </p>
              </div>
            </div>
          </AuthFeedback>
        )}

        <SignupForm
          onSubmit={handleSignup}
          isLoading={isSubmitting}
          error={formError}
          submitText={isAnonymous ? 'Create Account & Save Cart' : 'Create Account'}
        />

        {/* Terms notice for new users */}
        {!isAnonymous && (
          <p className="mt-4 text-center text-xs text-gray-500">
            By creating an account, you agree to our{' '}
            <Link href="/terms" className="underline hover:text-gray-700">
              Terms of Service
            </Link>{' '}
            and{' '}
            <Link href="/privacy" className="underline hover:text-gray-700">
              Privacy Policy
            </Link>
          </p>
        )}
      </AuthCardContent>

      <AuthCardFooter>
        <p className="text-gray-600">
          Already have an account?{' '}
          <Link
            href={`/login${redirectTo !== '/account' ? `?redirectTo=${encodeURIComponent(redirectTo)}` : ''}`}
            className="font-medium text-emerald-600 hover:text-emerald-700 hover:underline"
          >
            Sign in
          </Link>
        </p>
      </AuthCardFooter>
    </AuthCard>
  );
}
