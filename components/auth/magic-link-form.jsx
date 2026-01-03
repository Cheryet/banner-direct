'use client';

import * as React from 'react';
import { Mail, CheckCircle, RefreshCw } from 'lucide-react';
import { EmailInput } from './email-input';
import { AuthSubmitButton } from './auth-submit-button';
import { AuthFeedback } from './auth-feedback';
import { cn } from '@/lib/utils';

/**
 * MagicLinkForm - Passwordless authentication form
 * Handles email submission, success state, and resend functionality
 */
function MagicLinkForm({ onSubmit, isLoading = false, error, className }) {
  const [email, setEmail] = React.useState('');
  const [isSent, setIsSent] = React.useState(false);
  const [resendCooldown, setResendCooldown] = React.useState(0);

  // Handle cooldown timer for resend
  React.useEffect(() => {
    if (resendCooldown > 0) {
      const timer = setTimeout(() => setResendCooldown((c) => c - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [resendCooldown]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await onSubmit(email);
    if (!result?.error) {
      setIsSent(true);
      setResendCooldown(60); // 60 second cooldown
    }
  };

  const handleResend = async () => {
    if (resendCooldown > 0) return;
    await onSubmit(email);
    setResendCooldown(60);
  };

  const handleChangeEmail = () => {
    setIsSent(false);
    setResendCooldown(0);
  };

  // Success state - email sent
  if (isSent) {
    return (
      <div className={cn('text-center', className)}>
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100">
          <CheckCircle className="h-8 w-8 text-emerald-600" aria-hidden="true" />
        </div>

        <h2 className="mb-2 text-xl font-semibold text-gray-900">Check your email</h2>

        <p className="text-gray-600">
          We sent a magic link to <strong className="text-gray-900">{email}</strong>
        </p>

        <p className="mt-4 text-sm text-gray-500">
          Click the link in the email to sign in. The link expires in 1 hour.
        </p>

        <div className="mt-6 space-y-3">
          <button
            type="button"
            onClick={handleResend}
            disabled={resendCooldown > 0 || isLoading}
            className="inline-flex items-center gap-2 text-sm text-emerald-600 hover:text-emerald-700 disabled:text-gray-400 disabled:cursor-not-allowed"
          >
            <RefreshCw className={cn('h-4 w-4', isLoading && 'animate-spin')} aria-hidden="true" />
            {resendCooldown > 0 ? `Resend in ${resendCooldown}s` : 'Resend magic link'}
          </button>

          <div>
            <button
              type="button"
              onClick={handleChangeEmail}
              className="text-sm text-gray-500 hover:text-gray-700 underline"
            >
              Use a different email
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Form state
  return (
    <form onSubmit={handleSubmit} className={cn('space-y-4', className)}>
      {error && <AuthFeedback variant="error" message={error} />}

      <EmailInput
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
        disabled={isLoading}
      />

      <p className="text-sm text-gray-500">
        We'll send you a magic link to sign in without a password.
      </p>

      <AuthSubmitButton isLoading={isLoading} loadingText="Sending link...">
        <span>Send Magic Link</span>
        <Mail className="ml-2 h-4 w-4" aria-hidden="true" />
      </AuthSubmitButton>
    </form>
  );
}

export { MagicLinkForm };
