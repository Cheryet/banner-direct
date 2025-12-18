import { AlertCircle, CheckCircle, Info, AlertTriangle } from 'lucide-react';
import { cn } from '@/lib/utils';

/**
 * Reusable alert message component
 * Server component - no interactivity needed
 */

const variants = {
  error: {
    container: 'bg-red-50 text-red-700',
    icon: AlertCircle,
  },
  success: {
    container: 'bg-emerald-50 text-emerald-700',
    icon: CheckCircle,
  },
  warning: {
    container: 'bg-yellow-50 text-yellow-700',
    icon: AlertTriangle,
  },
  info: {
    container: 'bg-blue-50 text-blue-700',
    icon: Info,
  },
};

export function AlertMessage({ variant = 'info', children, className }) {
  const config = variants[variant] || variants.info;
  const Icon = config.icon;

  return (
    <div className={cn('flex items-center gap-2 rounded-lg p-4', config.container, className)}>
      <Icon className="h-5 w-5 flex-shrink-0" />
      <div className="text-sm">{children}</div>
    </div>
  );
}
