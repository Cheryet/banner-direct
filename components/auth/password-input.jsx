'use client';

import * as React from 'react';
import { Lock, Eye, EyeOff } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';

/**
 * PasswordInput - Accessible password input with visibility toggle
 * Single responsibility: password field with show/hide functionality
 */
const PasswordInput = React.forwardRef(
  (
    {
      id = 'password',
      label = 'Password',
      error,
      showForgotLink = false,
      forgotLinkHref = '/forgot-password',
      hint,
      className,
      ...props
    },
    ref
  ) => {
    const [isVisible, setIsVisible] = React.useState(false);

    const toggleVisibility = () => setIsVisible((prev) => !prev);

    return (
      <div className={cn('space-y-1.5', className)}>
        <div className="flex items-center justify-between">
          <Label htmlFor={id}>{label}</Label>
          {showForgotLink && (
            <a
              href={forgotLinkHref}
              className="text-sm text-emerald-600 hover:text-emerald-700 hover:underline"
            >
              Forgot password?
            </a>
          )}
        </div>
        <div className="relative">
          <Lock
            className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400"
            aria-hidden="true"
          />
          <Input
            ref={ref}
            id={id}
            type={isVisible ? 'text' : 'password'}
            autoComplete={props.autoComplete || 'current-password'}
            placeholder="••••••••"
            aria-invalid={!!error}
            aria-describedby={error ? `${id}-error` : hint ? `${id}-hint` : undefined}
            className={cn('pl-10 pr-10', error && 'border-red-300 focus-visible:ring-red-500')}
            {...props}
          />
          <button
            type="button"
            onClick={toggleVisibility}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none focus:text-gray-600"
            aria-label={isVisible ? 'Hide password' : 'Show password'}
          >
            {isVisible ? (
              <EyeOff className="h-4 w-4" aria-hidden="true" />
            ) : (
              <Eye className="h-4 w-4" aria-hidden="true" />
            )}
          </button>
        </div>
        {hint && !error && (
          <p id={`${id}-hint`} className="text-sm text-gray-500">
            {hint}
          </p>
        )}
        {error && (
          <p id={`${id}-error`} className="text-sm text-red-600" role="alert">
            {error}
          </p>
        )}
      </div>
    );
  }
);
PasswordInput.displayName = 'PasswordInput';

export { PasswordInput };
