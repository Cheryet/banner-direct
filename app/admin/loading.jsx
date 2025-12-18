import { Loader2 } from 'lucide-react';

/**
 * Admin Loading State
 * Displayed during admin page transitions
 */
export default function AdminLoading() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <div className="text-center">
        <Loader2 className="mx-auto h-8 w-8 animate-spin text-emerald-600" />
        <p className="mt-4 text-sm text-gray-500">Loading admin...</p>
      </div>
    </div>
  );
}
