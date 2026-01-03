'use client';

import * as React from 'react';
import { ArrowRight } from 'lucide-react';
import { EmailInput } from './email-input';
import { PasswordInput } from './password-input';
import { AuthSubmitButton } from './auth-submit-button';
import { AuthFeedback } from './auth-feedback';
import { cn } from '@/lib/utils';

/**
 * PasswordForm - Email/password authentication form
 * Handles login with email and password
 */
function PasswordForm({ onSubmit, isLoading = false, error, showForgotLink = true, className }) {
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    await onSubmit(email, password);
  };

  return (
    <form onSubmit={handleSubmit} className={cn('space-y-4', className)}>
      {error && <AuthFeedback variant="error" message={error} />}

      <EmailInput
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
        disabled={isLoading}
      />

      <PasswordInput
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        showForgotLink={showForgotLink}
        required
        disabled={isLoading}
      />

      <AuthSubmitButton isLoading={isLoading} loadingText="Signing in...">
        <span>Sign In</span>
        <ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" />
      </AuthSubmitButton>
    </form>
  );
}

export { PasswordForm };
