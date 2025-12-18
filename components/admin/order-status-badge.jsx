import { STATUS_COLORS, getStatusById } from '@/lib/constants/orders';
import { cn } from '@/lib/utils';

/**
 * Order status badge component
 * Server component - displays status with appropriate colors
 */
export function OrderStatusBadge({ status, className }) {
  const statusConfig = getStatusById(status);
  const colors = STATUS_COLORS[status] || STATUS_COLORS.pending;

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium',
        colors.bg,
        colors.text,
        className
      )}
    >
      {statusConfig?.icon && <statusConfig.icon className="h-3 w-3" />}
      {statusConfig?.label || status}
    </span>
  );
}
