import { Suspense } from 'react';
import { Loader2 } from 'lucide-react';
import { LoginForm } from './login-form';

/**
 * Login Page - Server Component
 * Handles metadata and renders the client-side login form
 */
export const metadata = {
  title: 'Sign In | Banner Direct',
  description: 'Sign in to your Banner Direct account to manage orders and saved designs.',
  robots: {
    index: false,
    follow: false,
  },
};

export default function LoginPage() {
  return (
    <main className="flex min-h-[calc(100vh-4rem)] items-center justify-center bg-gray-50 px-4 py-12">
      <Suspense
        fallback={
          <div className="flex h-64 w-full max-w-md items-center justify-center rounded-xl border border-gray-200 bg-white shadow-sm">
            <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
          </div>
        }
      >
        <LoginForm />
      </Suspense>
    </main>
  );
}
