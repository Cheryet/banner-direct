'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { createClient } from '@/lib/supabase/client';
import { LogOut, Loader2 } from 'lucide-react';

export function LogoutButton() {
  const router = useRouter();
  const [isLoading, setIsLoading] = React.useState(false);

  const handleLogout = async () => {
    setIsLoading(true);
    
    try {
      const supabase = createClient();
      await supabase.auth.signOut();
      router.push('/');
      router.refresh();
    } catch (err) {
      console.error('Logout error:', err);
      setIsLoading(false);
    }
  };

  return (
    <Button
      variant="outline"
      onClick={handleLogout}
      disabled={isLoading}
      className="w-full border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700"
    >
      {isLoading ? (
        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
      ) : (
        <LogOut className="mr-2 h-4 w-4" />
      )}
      Sign Out
    </Button>
  );
}
