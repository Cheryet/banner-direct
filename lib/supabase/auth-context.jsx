'use client';

import * as React from 'react';
import { createClient, isSupabaseConfigured } from './client';

const AuthContext = React.createContext(undefined);

/**
 * Auth Provider Component
 * Manages authentication state and provides auth utilities to the app
 */
export function AuthProvider({ children }) {
  const [supabase] = React.useState(() => createClient());
  const [session, setSession] = React.useState(null);
  const [user, setUser] = React.useState(null);
  const [profile, setProfile] = React.useState(null);
  const [isLoading, setIsLoading] = React.useState(true);

  // Fetch user profile from database with timeout
  const fetchProfile = React.useCallback(
    async (userId) => {
      if (!userId || !supabase) return null;

      try {
        // Race between profile fetch and timeout
        const timeoutPromise = new Promise((_, reject) =>
          setTimeout(() => reject(new Error('Profile fetch timeout')), 3000)
        );

        const fetchPromise = supabase.from('profiles').select('*').eq('id', userId).single();

        const { data, error } = await Promise.race([fetchPromise, timeoutPromise]);

        if (error) {
          console.error('[Auth] Profile error:', error.message);
          return null;
        }
        return data;
      } catch (err) {
        console.error('[Auth] Profile fetch failed:', err.message);
        return null;
      }
    },
    [supabase]
  );

  // Initialize auth and listen for changes
  React.useEffect(() => {
    if (!supabase) {
      setIsLoading(false);
      return;
    }

    let isMounted = true;

    // Listen for auth changes - this handles BOTH initial session AND subsequent changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, currentSession) => {
      if (!isMounted) return;

      if (currentSession?.user) {
        setSession(currentSession);
        setUser(currentSession.user);

        // Fetch profile
        const userProfile = await fetchProfile(currentSession.user.id);
        if (isMounted) {
          setProfile(userProfile);
          setIsLoading(false);
        }
      } else {
        setSession(null);
        setUser(null);
        setProfile(null);
        setIsLoading(false);
      }
    });

    // Fallback timeout - if onAuthStateChange doesn't fire within 5s, stop loading
    const timeoutId = setTimeout(() => {
      if (isMounted) {
        setIsLoading(false);
      }
    }, 5000);

    return () => {
      isMounted = false;
      clearTimeout(timeoutId);
      subscription.unsubscribe();
    };
  }, [supabase, fetchProfile]);

  // Auth actions
  const signInWithEmail = async (email, password) => {
    if (!supabase) {
      return { data: null, error: new Error('Supabase not configured') };
    }
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      return { data, error };
    } catch (err) {
      console.error('[Auth] signInWithEmail error:', err);
      return { data: null, error: err };
    }
  };

  const signInWithMagicLink = async (email, redirectTo) => {
    if (!supabase) {
      return { data: null, error: new Error('Supabase not configured') };
    }
    try {
      const { data, error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: redirectTo || `${window.location.origin}/auth/callback`,
        },
      });
      return { data, error };
    } catch (err) {
      console.error('[Auth] signInWithMagicLink error:', err);
      return { data: null, error: err };
    }
  };

  const signUp = async (email, password, metadata = {}) => {
    // Check if current user is anonymous
    const currentUser = user;

    if (currentUser?.is_anonymous) {
      // Upgrade anonymous user instead of creating new account
      const { data, error } = await supabase.auth.updateUser({
        email,
        password,
      });

      if (!error) {
        // Update profile
        await supabase
          .from('profiles')
          .update({
            email,
            is_anonymous: false,
            full_name: metadata.fullName,
          })
          .eq('id', currentUser.id);
      }

      return { data, error };
    }

    // Create new account
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: metadata,
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    });
    return { data, error };
  };

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    return { error };
  };

  const resetPassword = async (email) => {
    const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/reset-password`,
    });
    return { data, error };
  };

  const updatePassword = async (newPassword) => {
    const { data, error } = await supabase.auth.updateUser({
      password: newPassword,
    });
    return { data, error };
  };

  const updateProfile = async (updates) => {
    if (!user) return { error: new Error('No user logged in') };

    const { data, error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', user.id)
      .select()
      .single();

    if (!error && data) {
      setProfile(data);
    }

    return { data, error };
  };

  const value = {
    // State
    session,
    user,
    profile,
    isLoading,
    isInitialized: !isLoading, // Simplified - initialized when not loading

    // Computed
    isAuthenticated: !!user,
    isAnonymous: user ? user.is_anonymous : true,
    isAdmin: profile?.role === 'admin',

    // Actions
    signInWithEmail,
    signInWithMagicLink,
    signUp,
    signOut,
    resetPassword,
    updatePassword,
    updateProfile,
    refreshProfile: () => fetchProfile(user?.id),
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

/**
 * Hook to access auth context
 * Returns a default state if used outside provider (for SSR safety)
 */
export function useAuth() {
  const context = React.useContext(AuthContext);

  // Return default state if context is not available (SSR or outside provider)
  if (context === undefined) {
    return {
      session: null,
      user: null,
      profile: null,
      isLoading: true,
      isInitialized: false,
      isAuthenticated: false,
      isAnonymous: true,
      isAdmin: false,
      signInWithEmail: async () => ({ error: new Error('Auth not initialized') }),
      signInWithMagicLink: async () => ({ error: new Error('Auth not initialized') }),
      signUp: async () => ({ error: new Error('Auth not initialized') }),
      signOut: async () => ({ error: new Error('Auth not initialized') }),
      resetPassword: async () => ({ error: new Error('Auth not initialized') }),
      updatePassword: async () => ({ error: new Error('Auth not initialized') }),
      updateProfile: async () => ({ error: new Error('Auth not initialized') }),
      refreshProfile: () => {},
    };
  }

  return context;
}

/**
 * Hook to require authentication
 * Redirects to login if not authenticated
 */
export function useRequireAuth(requirePermanent = false) {
  const auth = useAuth();
  const [isReady, setIsReady] = React.useState(false);

  React.useEffect(() => {
    if (!auth.isInitialized) return;

    if (!auth.isAuthenticated) {
      window.location.href = '/login?redirectTo=' + encodeURIComponent(window.location.pathname);
      return;
    }

    if (requirePermanent && auth.isAnonymous) {
      window.location.href = '/signup?redirectTo=' + encodeURIComponent(window.location.pathname);
      return;
    }

    setIsReady(true);
  }, [auth.isInitialized, auth.isAuthenticated, auth.isAnonymous, requirePermanent]);

  return { ...auth, isReady };
}

/**
 * Hook to require admin access
 */
export function useRequireAdmin() {
  const auth = useAuth();
  const [isReady, setIsReady] = React.useState(false);

  React.useEffect(() => {
    if (!auth.isInitialized) return;

    if (!auth.isAuthenticated || auth.isAnonymous) {
      window.location.href = '/login?redirectTo=' + encodeURIComponent(window.location.pathname);
      return;
    }

    if (!auth.isAdmin) {
      window.location.href = '/?error=unauthorized';
      return;
    }

    setIsReady(true);
  }, [auth.isInitialized, auth.isAuthenticated, auth.isAnonymous, auth.isAdmin]);

  return { ...auth, isReady };
}
