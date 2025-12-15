import { createClient, isSupabaseConfigured } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { AdminSidebar } from '@/components/admin/admin-sidebar';

/**
 * Admin Layout
 * Server-side protected layout for admin dashboard
 * Includes sidebar navigation
 */
export default async function AdminLayout({ children }) {
  const supabase = await createClient();

  // Handle unconfigured Supabase - allow access but show warning in dashboard
  if (!supabase) {
    return (
      <div className="flex min-h-screen bg-gray-100">
        <main className="flex-1 p-8">{children}</main>
      </div>
    );
  }

  // Get current user
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login?redirectTo=/admin&message=Please sign in to access the admin area');
  }

  // Check if user is admin
  const { data: profile } = await supabase
    .from('profiles')
    .select('role, full_name, email')
    .eq('id', user.id)
    .single();

  if (!profile || profile.role !== 'admin') {
    redirect('/?error=unauthorized');
  }

  return (
    <div className="flex h-screen overflow-hidden bg-gray-100">
      <AdminSidebar profile={profile} />

      {/* Main content - no margin on mobile, margin on desktop */}
      <main className="flex-1 overflow-y-auto lg:ml-64">
        <div className="p-4 pt-20 lg:p-8 lg:pt-8">{children}</div>
      </main>
    </div>
  );
}
