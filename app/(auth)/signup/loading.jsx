import { Loader2 } from 'lucide-react';

/**
 * Signup Loading State
 * Displayed during route-level loading
 */
export default function SignupLoading() {
  return (
    <main className="flex min-h-[calc(100vh-4rem)] items-center justify-center bg-gray-50 px-4 py-12">
      <div className="flex h-64 w-full max-w-md items-center justify-center rounded-xl border border-gray-200 bg-white shadow-sm">
        <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
      </div>
    </main>
  );
}
