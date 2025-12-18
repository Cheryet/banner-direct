import { cn } from '@/lib/utils';

/**
 * Reusable empty state component for lists and tables
 * Server component - no interactivity needed
 */
export function EmptyState({ icon: Icon, title, description, children, className }) {
  return (
    <div className={cn('flex flex-col items-center justify-center py-16 text-center', className)}>
      {Icon && <Icon className="h-12 w-12 text-gray-300" />}
      {title && <h3 className="mt-4 text-lg font-medium text-gray-900">{title}</h3>}
      {description && <p className="mt-1 text-sm text-gray-500">{description}</p>}
      {children && <div className="mt-4">{children}</div>}
    </div>
  );
}
