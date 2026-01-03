'use client';

import * as React from 'react';
import { Mail } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';

/**
 * EmailInput - Accessible email input with icon
 * Single responsibility: email field with validation styling
 */
const EmailInput = React.forwardRef(
  ({ id = 'email', label = 'Email', error, className, ...props }, ref) => {
    return (
      <div className={cn('space-y-1.5', className)}>
        <Label htmlFor={id}>{label}</Label>
        <div className="relative">
          <Mail
            className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400"
            aria-hidden="true"
          />
          <Input
            ref={ref}
            id={id}
            type="email"
            autoComplete="email"
            placeholder="you@example.com"
            aria-invalid={!!error}
            aria-describedby={error ? `${id}-error` : undefined}
            className={cn('pl-10', error && 'border-red-300 focus-visible:ring-red-500')}
            {...props}
          />
        </div>
        {error && (
          <p id={`${id}-error`} className="text-sm text-red-600" role="alert">
            {error}
          </p>
        )}
      </div>
    );
  }
);
EmailInput.displayName = 'EmailInput';

export { EmailInput };
