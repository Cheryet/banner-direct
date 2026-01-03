'use client';

import * as React from 'react';
import { Mail, RefreshCw, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

/**
 * EmailConfirmationNotice - Displayed when email confirmation is required
 * Provides clear next steps and resend functionality
 */
function EmailConfirmationNotice({
  email,
  onResend,
  isResending = false,
  resendSuccess = false,
}) {
  return (
    <div className="text-center">
      <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100">
        <Mail className="h-8 w-8 text-emerald-600" aria-hidden="true" />
      </div>

      <h2 className="mb-2 text-xl font-semibold text-gray-900">Check your email</h2>

      <p className="text-gray-600">
        We sent a confirmation link to <strong className="text-gray-900">{email}</strong>
      </p>

      <p className="mt-4 text-sm text-gray-500">
        Click the link in the email to activate your account. The link expires in 24 hours.
      </p>

      {resendSuccess ? (
        <div className="mt-6 flex items-center justify-center gap-2 text-sm text-emerald-600">
          <CheckCircle className="h-4 w-4" aria-hidden="true" />
          <span>Confirmation email sent!</span>
        </div>
      ) : (
        <div className="mt-6 space-y-3">
          <p className="text-sm text-gray-500">
            Didn't receive the email? Check your spam folder or
          </p>
          <Button variant="outline" onClick={onResend} disabled={isResending} className="gap-2">
            {isResending ? (
              <>
                <RefreshCw className="h-4 w-4 animate-spin" aria-hidden="true" />
                Sending...
              </>
            ) : (
              <>
                <RefreshCw className="h-4 w-4" aria-hidden="true" />
                Resend confirmation email
              </>
            )}
          </Button>
        </div>
      )}
    </div>
  );
}

export { EmailConfirmationNotice };
