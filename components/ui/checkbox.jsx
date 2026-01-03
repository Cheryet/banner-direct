'use client';

import * as React from 'react';
import * as CheckboxPrimitive from '@radix-ui/react-checkbox';
import { Check } from 'lucide-react';
import { cn } from '@/lib/utils';

/**
 * Checkbox Component - Modern E-Commerce Styling
 *
 * Built on Radix UI for accessibility and keyboard navigation.
 * Matches the emerald color scheme used throughout the site.
 *
 * Usage:
 * <Checkbox checked={value} onCheckedChange={setValue} />
 * <Checkbox checked={value} onCheckedChange={setValue} label="Accept terms" />
 */
const Checkbox = React.forwardRef(({ className, label, description, id, ...props }, ref) => {
  const generatedId = React.useId();
  const checkboxId = id || generatedId;

  const checkbox = (
    <CheckboxPrimitive.Root
      ref={ref}
      id={checkboxId}
      className={cn(
        'peer h-5 w-5 shrink-0 rounded border-2 border-gray-300 bg-white',
        'ring-offset-background transition-all duration-150',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2',
        'disabled:cursor-not-allowed disabled:opacity-50',
        'data-[state=checked]:border-emerald-500 data-[state=checked]:bg-emerald-500',
        'hover:border-gray-400 data-[state=checked]:hover:bg-emerald-600 data-[state=checked]:hover:border-emerald-600',
        className
      )}
      {...props}
    >
      <CheckboxPrimitive.Indicator className={cn('flex items-center justify-center text-white')}>
        <Check className="h-3.5 w-3.5 stroke-[3]" />
      </CheckboxPrimitive.Indicator>
    </CheckboxPrimitive.Root>
  );

  if (label || description) {
    return (
      <div className="flex items-start gap-3">
        {checkbox}
        <div className="grid gap-1 leading-none">
          {label && (
            <label
              htmlFor={checkboxId}
              className="text-sm font-medium text-gray-900 cursor-pointer peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              {label}
            </label>
          )}
          {description && <p className="text-sm text-gray-500">{description}</p>}
        </div>
      </div>
    );
  }

  return checkbox;
});
Checkbox.displayName = 'Checkbox';

export { Checkbox };
