'use client';

import * as React from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useAuth } from '@/lib/supabase/auth-context';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Mail, Lock, ArrowRight, Loader2, CheckCircle } from 'lucide-react';

export default function LoginPage() {
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get('redirectTo') || '/account';
  const message = searchParams.get('message');
  
  const { signInWithEmail, signInWithMagicLink, isAnonymous, isAuthenticated, isLoading: authLoading } = useAuth();
  
  const [mode, setMode] = React.useState('password'); // 'password' | 'magic-link'
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState(null);
  const [magicLinkSent, setMagicLinkSent] = React.useState(false);

  // Redirect if already authenticated (not anonymous)
  React.useEffect(() => {
    if (!authLoading && isAuthenticated && !isAnonymous) {
      console.log('[Login] Already authenticated, redirecting to:', redirectTo);
      window.location.href = redirectTo;
    }
  }, [authLoading, isAuthenticated, isAnonymous, redirectTo]);

  const handlePasswordLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    console.log('[Login] Attempting sign in with email:', email);
    const result = await signInWithEmail(email, password);
    console.log('[Login] Sign in result:', result);

    if (result.error) {
      console.error('[Login] Sign in error:', result.error);
      setError(result.error.message);
      setIsLoading(false);
      return;
    }

    console.log('[Login] Sign in successful, redirecting to:', redirectTo);
    // Redirect will happen automatically via auth state change
    window.location.href = redirectTo;
  };

  const handleMagicLinkLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    const { error } = await signInWithMagicLink(
      email,
      `${window.location.origin}${redirectTo}`
    );

    if (error) {
      setError(error.message);
      setIsLoading(false);
      return;
    }

    setMagicLinkSent(true);
    setIsLoading(false);
  };

  if (magicLinkSent) {
    return (
      <div className="container flex min-h-[60vh] items-center justify-center py-12">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6 text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100">
              <CheckCircle className="h-8 w-8 text-emerald-600" />
            </div>
            <h2 className="mb-2 text-xl font-semibold">Check your email</h2>
            <p className="text-muted-foreground">
              We sent a magic link to <strong>{email}</strong>
            </p>
            <p className="mt-4 text-sm text-muted-foreground">
              Click the link in the email to sign in. The link expires in 1 hour.
            </p>
            <Button
              variant="outline"
              className="mt-6"
              onClick={() => setMagicLinkSent(false)}
            >
              Try a different email
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container flex min-h-[60vh] items-center justify-center py-12">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Welcome back</CardTitle>
          <CardDescription>
            {message || 'Sign in to your account to continue'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {error && (
            <div className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-600">
              {error}
            </div>
          )}

          {isAnonymous && (
            <div className="mb-4 rounded-lg bg-emerald-50 p-3 text-sm text-emerald-700">
              <strong>Good news!</strong> Your cart and uploads will be saved when you sign in.
            </div>
          )}

          {/* Mode Toggle */}
          <div className="mb-6 flex rounded-lg border p-1">
            <button
              type="button"
              onClick={() => setMode('password')}
              className={`flex-1 rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                mode === 'password'
                  ? 'bg-gray-100 text-gray-900'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Password
            </button>
            <button
              type="button"
              onClick={() => setMode('magic-link')}
              className={`flex-1 rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                mode === 'magic-link'
                  ? 'bg-gray-100 text-gray-900'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Magic Link
            </button>
          </div>

          {mode === 'password' ? (
            <form onSubmit={handlePasswordLogin} className="space-y-4">
              <div>
                <Label htmlFor="email">Email</Label>
                <div className="relative mt-1">
                  <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="password">Password</Label>
                  <Link
                    href="/forgot-password"
                    className="text-sm text-emerald-600 hover:underline"
                  >
                    Forgot password?
                  </Link>
                </div>
                <div className="relative mt-1">
                  <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <>
                    Sign In
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </>
                )}
              </Button>
            </form>
          ) : (
            <form onSubmit={handleMagicLinkLogin} className="space-y-4">
              <div>
                <Label htmlFor="magic-email">Email</Label>
                <div className="relative mt-1">
                  <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="magic-email"
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10"
                    required
                  />
                </div>
                <p className="mt-2 text-sm text-muted-foreground">
                  We'll send you a magic link to sign in without a password.
                </p>
              </div>

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <>
                    Send Magic Link
                    <Mail className="ml-2 h-4 w-4" />
                  </>
                )}
              </Button>
            </form>
          )}

          <Separator className="my-6" />

          <p className="text-center text-sm text-muted-foreground">
            Don't have an account?{' '}
            <Link
              href={`/signup${redirectTo !== '/account' ? `?redirectTo=${encodeURIComponent(redirectTo)}` : ''}`}
              className="font-medium text-emerald-600 hover:underline"
            >
              Create one
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
