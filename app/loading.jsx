import { Skeleton } from '@/components/ui/skeleton';

export default function Loading() {
  return (
    <div className="container py-8 md:py-12">
      {/* Hero skeleton */}
      <div className="mx-auto max-w-3xl text-center">
        <Skeleton className="mx-auto h-12 w-3/4 md:h-16" />
        <Skeleton className="mx-auto mt-6 h-6 w-2/3" />
        <div className="mt-8 flex justify-center gap-4">
          <Skeleton className="h-12 w-40" />
          <Skeleton className="h-12 w-32" />
        </div>
      </div>

      {/* Content skeleton */}
      <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="space-y-4">
            <Skeleton className="aspect-[4/3] w-full" />
            <Skeleton className="h-6 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
          </div>
        ))}
      </div>
    </div>
  );
}
