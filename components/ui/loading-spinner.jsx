import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

/**
 * Reusable loading spinner component
 * Server component - no interactivity needed
 */
export function LoadingSpinner({ className, size = 'default', text }) {
  const sizeClasses = {
    sm: 'h-4 w-4',
    default: 'h-8 w-8',
    lg: 'h-12 w-12',
  };

  return (
    <div className={cn('flex items-center justify-center py-16', className)}>
      <div className="flex flex-col items-center gap-3">
        <Loader2
          className={cn('animate-spin text-emerald-600', sizeClasses[size] || sizeClasses.default)}
        />
        {text && <p className="text-sm text-gray-500">{text}</p>}
      </div>
    </div>
  );
}

/**
 * Inline loading spinner for buttons and small areas
 */
export function InlineSpinner({ className }) {
  return <Loader2 className={cn('h-4 w-4 animate-spin', className)} />;
}
