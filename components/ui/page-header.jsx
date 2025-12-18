import { cn } from '@/lib/utils';

/**
 * Reusable page header component
 * Server component - no interactivity needed
 */
export function PageHeader({ title, description, children, className, backLink }) {
  return (
    <div className={cn('mb-6', className)}>
      {backLink && (
        <a
          href={backLink.href}
          className="mb-4 inline-flex items-center gap-2 text-sm text-gray-600 hover:text-emerald-600"
        >
          {backLink.icon && <backLink.icon className="h-4 w-4" />}
          {backLink.label}
        </a>
      )}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-900 sm:text-2xl">{title}</h1>
          {description && <p className="text-sm text-muted-foreground">{description}</p>}
        </div>
        {children && <div className="flex gap-2">{children}</div>}
      </div>
    </div>
  );
}
