import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { FileQuestion, Home, Search } from 'lucide-react';
import Link from 'next/link';

export const metadata = {
  title: 'Page Not Found | Banner Direct',
  description: 'The page you are looking for could not be found.',
};

/**
 * Global 404 Page
 * Displayed when a route is not found
 */
export default function NotFound() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center p-4">
      <Card className="max-w-md w-full">
        <CardContent className="pt-6 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gray-100">
            <FileQuestion className="h-8 w-8 text-gray-600" />
          </div>
          <h1 className="text-xl font-semibold text-gray-900">Page not found</h1>
          <p className="mt-2 text-gray-600">
            Sorry, we couldn't find the page you're looking for. It may have been moved or deleted.
          </p>
          <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-center">
            <Button asChild variant="default">
              <Link href="/">
                <Home className="mr-2 h-4 w-4" />
                Go Home
              </Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/products">
                <Search className="mr-2 h-4 w-4" />
                Browse Products
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
