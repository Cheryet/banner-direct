import { redirect } from 'next/navigation';
import { createClient, getUser } from '@/lib/supabase/server';
import { ProfileSection } from '@/components/account/profile-section';
import { SavedDesignsSection } from '@/components/account/saved-designs-section';
import { OrdersSection } from '@/components/account/orders-section';
import { LogoutButton } from '@/components/account/logout-button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { LinkButton } from '@/components/ui/link-button';
import { User, Package, Image, ArrowRight } from 'lucide-react';

export const metadata = {
  title: 'My Account',
  description: 'Manage your profile, view orders, and access your saved designs.',
};

export default async function AccountPage() {
  const supabase = await createClient();
  const { user, error } = await getUser();

  // Redirect if not authenticated (middleware should handle this, but double-check)
  if (!user || error) {
    redirect('/login?redirectTo=/account');
  }

  // Fetch profile data
  const { data: profile } = await supabase.from('profiles').select('*').eq('id', user.id).single();

  // Fetch user's uploads (saved designs)
  const { data: uploads } = await supabase
    .from('uploads')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })
    .limit(6);

  // Fetch user's orders
  const { data: orders } = await supabase
    .from('orders')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })
    .limit(10);

  return (
    <div className="container py-8 md:py-12">
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">My Account</h1>
        <p className="mt-2 text-gray-600">
          Manage your profile, view your orders, and access your saved designs.
        </p>
      </div>

      {/* Main Grid Layout */}
      <div className="grid gap-8 lg:grid-cols-3">
        {/* Left Column - Profile & Actions */}
        <div className="space-y-6 lg:col-span-1">
          {/* Profile Card */}
          <ProfileSection profile={profile} user={user} />

          {/* Quick Actions Card */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <LinkButton href="/products" variant="outline" className="w-full justify-between">
                Browse Banners
                <ArrowRight className="h-4 w-4" />
              </LinkButton>
              <LinkButton href="/cart" variant="outline" className="w-full justify-between">
                View Cart
                <ArrowRight className="h-4 w-4" />
              </LinkButton>
              <LinkButton href="/help" variant="outline" className="w-full justify-between">
                Get Help
                <ArrowRight className="h-4 w-4" />
              </LinkButton>
            </CardContent>
          </Card>

          {/* Logout */}
          <LogoutButton />
        </div>

        {/* Right Column - Designs & Orders */}
        <div className="space-y-8 lg:col-span-2">
          {/* Saved Designs Section */}
          <SavedDesignsSection uploads={uploads || []} />

          {/* Orders Section */}
          <OrdersSection orders={orders || []} />
        </div>
      </div>

      {/* CTA Banner */}
      <div className="mt-12 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 p-8 text-white">
        <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
          <div>
            <h2 className="text-2xl font-bold">Ready to create your next banner?</h2>
            <p className="mt-1 text-emerald-100">
              Browse our collection of high-quality custom banners.
            </p>
          </div>
          <LinkButton
            href="/products"
            variant="secondary"
            size="lg"
            className="shrink-0 bg-white text-emerald-600 hover:bg-emerald-50"
          >
            Start Designing
            <ArrowRight className="ml-2 h-4 w-4" />
          </LinkButton>
        </div>
      </div>
    </div>
  );
}
