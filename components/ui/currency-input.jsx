'use client';

import * as React from 'react';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

/**
 * CurrencyInput - A controlled input for currency/price values
 * Allows empty values and proper deletion, stores value as string
 * Converts to number only on blur or when needed
 */
function CurrencyInput({
  value,
  onChange,
  placeholder = '0.00',
  className,
  symbol = '$',
  min,
  ...props
}) {
  // Handle change - allow empty string and any valid number input
  const handleChange = (e) => {
    const inputValue = e.target.value;

    // Allow empty string
    if (inputValue === '') {
      onChange('');
      return;
    }

    // Allow valid number patterns (including partial like "1." or ".5")
    if (/^-?\d*\.?\d*$/.test(inputValue)) {
      onChange(inputValue);
    }
  };

  // Format on blur - clean up the value
  const handleBlur = (e) => {
    const inputValue = e.target.value;

    if (inputValue === '' || inputValue === '-') {
      return; // Keep empty
    }

    // Parse and format to 2 decimal places if it's a valid number
    const num = parseFloat(inputValue);
    if (!isNaN(num)) {
      // Only format if it has decimal places that need trimming
      const formatted = num.toString();
      if (formatted !== inputValue) {
        onChange(formatted);
      }
    }
  };

  return (
    <div className="relative">
      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">{symbol}</span>
      <Input
        type="text"
        inputMode="decimal"
        value={value}
        onChange={handleChange}
        onBlur={handleBlur}
        placeholder={placeholder}
        className={cn('pl-7', className)}
        {...props}
      />
    </div>
  );
}

export { CurrencyInput };
