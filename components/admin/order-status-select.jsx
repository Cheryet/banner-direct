'use client';

import { ORDER_STATUSES, STATUS_COLORS } from '@/lib/constants/orders';
import { cn } from '@/lib/utils';

/**
 * Order status select dropdown with color-coded styling
 * Client component - handles onChange interaction
 */
export function OrderStatusSelect({ value, onChange, disabled = false, className }) {
  const colors = STATUS_COLORS[value] || STATUS_COLORS.pending;

  return (
    <select
      value={value}
      onChange={(e) => onChange?.(e.target.value)}
      disabled={disabled}
      className={cn(
        'cursor-pointer rounded-full border px-3 py-1.5 text-xs font-semibold',
        'focus:outline-none focus:ring-2 focus:ring-offset-1 disabled:opacity-50',
        colors.bg,
        colors.text,
        colors.border,
        className
      )}
    >
      {ORDER_STATUSES.map((status) => (
        <option key={status.id} value={status.id}>
          {status.label}
        </option>
      ))}
    </select>
  );
}
