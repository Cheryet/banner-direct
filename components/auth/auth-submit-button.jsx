'use client';

import * as React from 'react';
import { Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

/**
 * AuthSubmitButton - Submit button with loading state for auth forms
 * Prevents double submission and provides instant visual feedback
 */
function AuthSubmitButton({
  children,
  isLoading = false,
  loadingText = 'Please wait...',
  className,
  ...props
}) {
  return (
    <Button type="submit" disabled={isLoading} className={cn('w-full', className)} {...props}>
      {isLoading ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" aria-hidden="true" />
          <span>{loadingText}</span>
        </>
      ) : (
        children
      )}
    </Button>
  );
}

export { AuthSubmitButton };
