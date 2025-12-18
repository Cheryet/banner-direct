import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';

/**
 * Reusable stats card component for dashboards
 * Server component - no interactivity needed
 */
export function StatsCard({
  title,
  value,
  icon: Icon,
  trend,
  trendLabel,
  className,
  valueClassName,
}) {
  return (
    <Card className={className}>
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-muted-foreground">{title}</p>
            <p className={cn('text-2xl font-bold', valueClassName)}>{value}</p>
            {trend !== undefined && (
              <p
                className={cn(
                  'mt-1 text-xs',
                  trend > 0 ? 'text-emerald-600' : trend < 0 ? 'text-red-600' : 'text-gray-500'
                )}
              >
                {trend > 0 ? '+' : ''}
                {trend}% {trendLabel || 'vs last period'}
              </p>
            )}
          </div>
          {Icon && <Icon className="h-8 w-8 text-gray-400" />}
        </div>
      </CardContent>
    </Card>
  );
}
