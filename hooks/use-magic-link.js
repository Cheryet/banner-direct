'use client';

import * as React from 'react';
import { useAuth } from '@/lib/supabase/auth-context';

/**
 * useMagicLink - Hook specifically for magic link authentication
 * Handles sending, resending, and rate limiting
 */
export function useMagicLink() {
  const auth = useAuth();
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState(null);
  const [isSent, setIsSent] = React.useState(false);
  const [email, setEmail] = React.useState('');
  const [cooldown, setCooldown] = React.useState(0);

  // Cooldown timer
  React.useEffect(() => {
    if (cooldown > 0) {
      const timer = setTimeout(() => setCooldown((c) => c - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [cooldown]);

  const sendMagicLink = React.useCallback(
    async (emailAddress, redirectTo) => {
      if (cooldown > 0) {
        setError(`Please wait ${cooldown} seconds before trying again.`);
        return { error: new Error('Rate limited') };
      }

      setIsLoading(true);
      setError(null);
      setEmail(emailAddress);

      const result = await auth.signInWithMagicLink(
        emailAddress,
        redirectTo || `${window.location.origin}/auth/callback`
      );

      if (result.error) {
        setError(result.error.message);
        setIsLoading(false);
        return { error: result.error };
      }

      setIsSent(true);
      setCooldown(60); // 60 second cooldown between sends
      setIsLoading(false);
      return { data: result.data };
    },
    [auth, cooldown]
  );

  const resend = React.useCallback(async () => {
    if (!email) {
      setError('No email address to resend to');
      return { error: new Error('No email') };
    }
    return sendMagicLink(email);
  }, [email, sendMagicLink]);

  const reset = React.useCallback(() => {
    setIsSent(false);
    setError(null);
    setEmail('');
    setCooldown(0);
  }, []);

  const clearError = React.useCallback(() => setError(null), []);

  return {
    // State
    isLoading,
    error,
    isSent,
    email,
    cooldown,
    canResend: cooldown === 0 && !isLoading,

    // Actions
    sendMagicLink,
    resend,
    reset,
    clearError,
  };
}
