'use client';

import * as React from 'react';
import { useAuth } from '@/lib/supabase/auth-context';

/**
 * useAuthForm - Hook for managing auth form state
 * Handles loading, error, and success states for auth operations
 */
export function useAuthForm() {
  const auth = useAuth();
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState(null);
  const [success, setSuccess] = React.useState(false);

  const clearError = React.useCallback(() => setError(null), []);
  const clearSuccess = React.useCallback(() => setSuccess(false), []);

  const signInWithPassword = React.useCallback(
    async (email, password) => {
      setIsLoading(true);
      setError(null);
      setSuccess(false);

      const result = await auth.signInWithEmail(email, password);

      if (result.error) {
        setError(result.error.message);
        setIsLoading(false);
        return { error: result.error };
      }

      setSuccess(true);
      setIsLoading(false);
      return { data: result.data };
    },
    [auth]
  );

  const signInWithMagicLink = React.useCallback(
    async (email, redirectTo) => {
      setIsLoading(true);
      setError(null);
      setSuccess(false);

      const result = await auth.signInWithMagicLink(email, redirectTo);

      if (result.error) {
        setError(result.error.message);
        setIsLoading(false);
        return { error: result.error };
      }

      setSuccess(true);
      setIsLoading(false);
      return { data: result.data };
    },
    [auth]
  );

  const signUp = React.useCallback(
    async (data) => {
      setIsLoading(true);
      setError(null);
      setSuccess(false);

      const result = await auth.signUp(data.email, data.password, {
        firstName: data.firstName,
        lastName: data.lastName,
        phone: data.phone,
      });

      if (result.error) {
        setError(result.error.message);
        setIsLoading(false);
        return { error: result.error };
      }

      setSuccess(true);
      setIsLoading(false);
      return { data: result.data };
    },
    [auth]
  );

  const resetPassword = React.useCallback(
    async (email) => {
      setIsLoading(true);
      setError(null);
      setSuccess(false);

      const result = await auth.resetPassword(email);

      if (result.error) {
        setError(result.error.message);
        setIsLoading(false);
        return { error: result.error };
      }

      setSuccess(true);
      setIsLoading(false);
      return { data: result.data };
    },
    [auth]
  );

  return {
    // State
    isLoading,
    error,
    success,

    // Auth state from context
    isAuthenticated: auth.isAuthenticated,
    isAnonymous: auth.isAnonymous,
    isAuthLoading: auth.isLoading,
    user: auth.user,

    // Actions
    signInWithPassword,
    signInWithMagicLink,
    signUp,
    resetPassword,
    clearError,
    clearSuccess,
  };
}
