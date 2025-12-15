'use client';

import * as React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/supabase/auth-context';
import { createClient } from '@/lib/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { 
  ArrowLeft, 
  User, 
  Lock, 
  Bell, 
  Mail, 
  Phone,
  MapPin,
  Shield,
  Trash2,
  Loader2,
  CheckCircle,
  AlertCircle,
  Eye,
  EyeOff,
  Save
} from 'lucide-react';

export default function SettingsPage() {
  const router = useRouter();
  const { user, profile, isLoading: authLoading, updateProfile, signOut } = useAuth();
  const [activeSection, setActiveSection] = React.useState('profile');
  
  // Profile form state
  const [profileForm, setProfileForm] = React.useState({
    full_name: '',
    phone: '',
    company: '',
  });
  const [profileLoading, setProfileLoading] = React.useState(false);
  const [profileSuccess, setProfileSuccess] = React.useState(false);
  const [profileError, setProfileError] = React.useState(null);

  // Address form state
  const [addressForm, setAddressForm] = React.useState({
    line1: '',
    line2: '',
    city: '',
    province: '',
    postal_code: '',
    country: 'Canada',
  });
  const [addressLoading, setAddressLoading] = React.useState(false);
  const [addressSuccess, setAddressSuccess] = React.useState(false);
  const [addressError, setAddressError] = React.useState(null);

  // Password form state
  const [passwordForm, setPasswordForm] = React.useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [showPasswords, setShowPasswords] = React.useState({
    current: false,
    new: false,
    confirm: false,
  });
  const [passwordLoading, setPasswordLoading] = React.useState(false);
  const [passwordSuccess, setPasswordSuccess] = React.useState(false);
  const [passwordError, setPasswordError] = React.useState(null);

  // Notification preferences state
  const [notifications, setNotifications] = React.useState({
    order_updates: true,
    promotions: false,
    newsletter: false,
  });
  const [notifLoading, setNotifLoading] = React.useState(false);
  const [notifSuccess, setNotifSuccess] = React.useState(false);

  // Delete account state
  const [deleteConfirm, setDeleteConfirm] = React.useState('');
  const [deleteLoading, setDeleteLoading] = React.useState(false);

  // Initialize form data from profile
  React.useEffect(() => {
    if (profile) {
      setProfileForm({
        full_name: profile.full_name || '',
        phone: profile.phone || '',
        company: profile.company || '',
      });
      
      if (profile.default_address) {
        const addr = typeof profile.default_address === 'string' 
          ? JSON.parse(profile.default_address) 
          : profile.default_address;
        setAddressForm({
          line1: addr.line1 || '',
          line2: addr.line2 || '',
          city: addr.city || '',
          province: addr.province || '',
          postal_code: addr.postal_code || '',
          country: addr.country || 'Canada',
        });
      }

      if (profile.notification_preferences) {
        const prefs = typeof profile.notification_preferences === 'string'
          ? JSON.parse(profile.notification_preferences)
          : profile.notification_preferences;
        setNotifications({
          order_updates: prefs.order_updates ?? true,
          promotions: prefs.promotions ?? false,
          newsletter: prefs.newsletter ?? false,
        });
      }
    }
  }, [profile]);

  // Redirect if not authenticated
  React.useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login?redirectTo=/account/settings');
    }
  }, [user, authLoading, router]);

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setProfileLoading(true);
    setProfileError(null);
    setProfileSuccess(false);

    try {
      const { error } = await updateProfile(profileForm);
      if (error) throw error;
      setProfileSuccess(true);
      setTimeout(() => setProfileSuccess(false), 3000);
    } catch (err) {
      setProfileError(err.message || 'Failed to update profile');
    } finally {
      setProfileLoading(false);
    }
  };

  const handleAddressSubmit = async (e) => {
    e.preventDefault();
    setAddressLoading(true);
    setAddressError(null);
    setAddressSuccess(false);

    try {
      const { error } = await updateProfile({ default_address: addressForm });
      if (error) throw error;
      setAddressSuccess(true);
      setTimeout(() => setAddressSuccess(false), 3000);
    } catch (err) {
      setAddressError(err.message || 'Failed to update address');
    } finally {
      setAddressLoading(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setPasswordLoading(true);
    setPasswordError(null);
    setPasswordSuccess(false);

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setPasswordError('New passwords do not match');
      setPasswordLoading(false);
      return;
    }

    if (passwordForm.newPassword.length < 8) {
      setPasswordError('Password must be at least 8 characters');
      setPasswordLoading(false);
      return;
    }

    try {
      const supabase = createClient();
      const { error } = await supabase.auth.updateUser({
        password: passwordForm.newPassword,
      });
      
      if (error) throw error;
      
      setPasswordSuccess(true);
      setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
      setTimeout(() => setPasswordSuccess(false), 3000);
    } catch (err) {
      setPasswordError(err.message || 'Failed to update password');
    } finally {
      setPasswordLoading(false);
    }
  };

  const handleNotificationSubmit = async (e) => {
    e.preventDefault();
    setNotifLoading(true);
    setNotifSuccess(false);

    try {
      const { error } = await updateProfile({ notification_preferences: notifications });
      if (error) throw error;
      setNotifSuccess(true);
      setTimeout(() => setNotifSuccess(false), 3000);
    } catch (err) {
      console.error('Notification update error:', err);
    } finally {
      setNotifLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (deleteConfirm !== 'DELETE') return;
    
    setDeleteLoading(true);
    try {
      // Sign out and redirect - actual deletion would need server-side handling
      await signOut();
      router.push('/?message=account-deleted');
    } catch (err) {
      console.error('Delete error:', err);
      setDeleteLoading(false);
    }
  };

  if (authLoading) {
    return (
      <div className="container py-16">
        <div className="flex flex-col items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-emerald-600" />
          <p className="mt-4 text-gray-600">Loading settings...</p>
        </div>
      </div>
    );
  }

  const sections = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'address', label: 'Address', icon: MapPin },
    { id: 'password', label: 'Password', icon: Lock },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'danger', label: 'Danger Zone', icon: Shield },
  ];

  return (
    <div className="container py-8 md:py-12">
      {/* Breadcrumb */}
      <nav className="mb-6">
        <Link 
          href="/account" 
          className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-emerald-600 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to My Account
        </Link>
      </nav>

      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Account Settings</h1>
        <p className="mt-2 text-gray-600">
          Manage your profile, security, and preferences.
        </p>
      </div>

      <div className="grid gap-8 lg:grid-cols-4">
        {/* Sidebar Navigation */}
        <div className="lg:col-span-1">
          <nav className="space-y-1">
            {sections.map((section) => {
              const Icon = section.icon;
              return (
                <button
                  key={section.id}
                  onClick={() => setActiveSection(section.id)}
                  className={`flex w-full items-center gap-3 rounded-lg px-4 py-3 text-left text-sm font-medium transition-colors ${
                    activeSection === section.id
                      ? 'bg-emerald-50 text-emerald-700'
                      : 'text-gray-700 hover:bg-gray-100'
                  } ${section.id === 'danger' ? 'text-red-600 hover:bg-red-50' : ''}`}
                >
                  <Icon className={`h-5 w-5 ${section.id === 'danger' && activeSection !== section.id ? 'text-red-500' : ''}`} />
                  {section.label}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-3">
          {/* Profile Section */}
          {activeSection === 'profile' && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Profile Information
                </CardTitle>
                <CardDescription>
                  Update your personal information and how others see you.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleProfileSubmit} className="space-y-6">
                  {profileError && (
                    <div className="rounded-lg bg-red-50 p-4 text-sm text-red-700">
                      <div className="flex items-center gap-2">
                        <AlertCircle className="h-4 w-4" />
                        {profileError}
                      </div>
                    </div>
                  )}
                  
                  {profileSuccess && (
                    <div className="rounded-lg bg-emerald-50 p-4 text-sm text-emerald-700">
                      <div className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4" />
                        Profile updated successfully!
                      </div>
                    </div>
                  )}

                  <div className="grid gap-6 sm:grid-cols-2">
                    <div className="sm:col-span-2">
                      <Label htmlFor="email">Email Address</Label>
                      <div className="relative mt-1">
                        <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                        <Input
                          id="email"
                          type="email"
                          value={user?.email || ''}
                          disabled
                          className="pl-10 bg-gray-50"
                        />
                      </div>
                      <p className="mt-1 text-xs text-gray-500">
                        Contact support to change your email address.
                      </p>
                    </div>

                    <div className="sm:col-span-2">
                      <Label htmlFor="full_name">Full Name</Label>
                      <div className="relative mt-1">
                        <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                        <Input
                          id="full_name"
                          type="text"
                          value={profileForm.full_name}
                          onChange={(e) => setProfileForm({ ...profileForm, full_name: e.target.value })}
                          placeholder="John Doe"
                          className="pl-10"
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="phone">Phone Number</Label>
                      <div className="relative mt-1">
                        <Phone className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                        <Input
                          id="phone"
                          type="tel"
                          value={profileForm.phone}
                          onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })}
                          placeholder="(555) 123-4567"
                          className="pl-10"
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="company">Company (Optional)</Label>
                      <Input
                        id="company"
                        type="text"
                        value={profileForm.company}
                        onChange={(e) => setProfileForm({ ...profileForm, company: e.target.value })}
                        placeholder="Acme Inc."
                        className="mt-1"
                      />
                    </div>
                  </div>

                  <div className="flex justify-end">
                    <Button type="submit" disabled={profileLoading}>
                      {profileLoading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Saving...
                        </>
                      ) : (
                        <>
                          <Save className="mr-2 h-4 w-4" />
                          Save Changes
                        </>
                      )}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          )}

          {/* Address Section */}
          {activeSection === 'address' && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="h-5 w-5" />
                  Default Shipping Address
                </CardTitle>
                <CardDescription>
                  This address will be pre-filled during checkout.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleAddressSubmit} className="space-y-6">
                  {addressError && (
                    <div className="rounded-lg bg-red-50 p-4 text-sm text-red-700">
                      <div className="flex items-center gap-2">
                        <AlertCircle className="h-4 w-4" />
                        {addressError}
                      </div>
                    </div>
                  )}
                  
                  {addressSuccess && (
                    <div className="rounded-lg bg-emerald-50 p-4 text-sm text-emerald-700">
                      <div className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4" />
                        Address updated successfully!
                      </div>
                    </div>
                  )}

                  <div className="grid gap-6 sm:grid-cols-2">
                    <div className="sm:col-span-2">
                      <Label htmlFor="line1">Street Address</Label>
                      <Input
                        id="line1"
                        type="text"
                        value={addressForm.line1}
                        onChange={(e) => setAddressForm({ ...addressForm, line1: e.target.value })}
                        placeholder="123 Main Street"
                        className="mt-1"
                      />
                    </div>

                    <div className="sm:col-span-2">
                      <Label htmlFor="line2">Apartment, Suite, etc. (Optional)</Label>
                      <Input
                        id="line2"
                        type="text"
                        value={addressForm.line2}
                        onChange={(e) => setAddressForm({ ...addressForm, line2: e.target.value })}
                        placeholder="Apt 4B"
                        className="mt-1"
                      />
                    </div>

                    <div>
                      <Label htmlFor="city">City</Label>
                      <Input
                        id="city"
                        type="text"
                        value={addressForm.city}
                        onChange={(e) => setAddressForm({ ...addressForm, city: e.target.value })}
                        placeholder="Toronto"
                        className="mt-1"
                      />
                    </div>

                    <div>
                      <Label htmlFor="province">Province</Label>
                      <select
                        id="province"
                        value={addressForm.province}
                        onChange={(e) => setAddressForm({ ...addressForm, province: e.target.value })}
                        className="mt-1 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                      >
                        <option value="">Select Province</option>
                        <option value="AB">Alberta</option>
                        <option value="BC">British Columbia</option>
                        <option value="MB">Manitoba</option>
                        <option value="NB">New Brunswick</option>
                        <option value="NL">Newfoundland and Labrador</option>
                        <option value="NS">Nova Scotia</option>
                        <option value="NT">Northwest Territories</option>
                        <option value="NU">Nunavut</option>
                        <option value="ON">Ontario</option>
                        <option value="PE">Prince Edward Island</option>
                        <option value="QC">Quebec</option>
                        <option value="SK">Saskatchewan</option>
                        <option value="YT">Yukon</option>
                      </select>
                    </div>

                    <div>
                      <Label htmlFor="postal_code">Postal Code</Label>
                      <Input
                        id="postal_code"
                        type="text"
                        value={addressForm.postal_code}
                        onChange={(e) => setAddressForm({ ...addressForm, postal_code: e.target.value.toUpperCase() })}
                        placeholder="M5V 1A1"
                        className="mt-1"
                        maxLength={7}
                      />
                    </div>

                    <div>
                      <Label htmlFor="country">Country</Label>
                      <Input
                        id="country"
                        type="text"
                        value={addressForm.country}
                        disabled
                        className="mt-1 bg-gray-50"
                      />
                    </div>
                  </div>

                  <div className="flex justify-end">
                    <Button type="submit" disabled={addressLoading}>
                      {addressLoading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Saving...
                        </>
                      ) : (
                        <>
                          <Save className="mr-2 h-4 w-4" />
                          Save Address
                        </>
                      )}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          )}

          {/* Password Section */}
          {activeSection === 'password' && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Lock className="h-5 w-5" />
                  Change Password
                </CardTitle>
                <CardDescription>
                  Update your password to keep your account secure.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handlePasswordSubmit} className="space-y-6">
                  {passwordError && (
                    <div className="rounded-lg bg-red-50 p-4 text-sm text-red-700">
                      <div className="flex items-center gap-2">
                        <AlertCircle className="h-4 w-4" />
                        {passwordError}
                      </div>
                    </div>
                  )}
                  
                  {passwordSuccess && (
                    <div className="rounded-lg bg-emerald-50 p-4 text-sm text-emerald-700">
                      <div className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4" />
                        Password updated successfully!
                      </div>
                    </div>
                  )}

                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="newPassword">New Password</Label>
                      <div className="relative mt-1">
                        <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                        <Input
                          id="newPassword"
                          type={showPasswords.new ? 'text' : 'password'}
                          value={passwordForm.newPassword}
                          onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                          placeholder="••••••••"
                          className="pl-10 pr-10"
                          minLength={8}
                          required
                        />
                        <button
                          type="button"
                          onClick={() => setShowPasswords({ ...showPasswords, new: !showPasswords.new })}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                        >
                          {showPasswords.new ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                      </div>
                      <p className="mt-1 text-xs text-gray-500">
                        Must be at least 8 characters long.
                      </p>
                    </div>

                    <div>
                      <Label htmlFor="confirmPassword">Confirm New Password</Label>
                      <div className="relative mt-1">
                        <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                        <Input
                          id="confirmPassword"
                          type={showPasswords.confirm ? 'text' : 'password'}
                          value={passwordForm.confirmPassword}
                          onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                          placeholder="••••••••"
                          className="pl-10 pr-10"
                          minLength={8}
                          required
                        />
                        <button
                          type="button"
                          onClick={() => setShowPasswords({ ...showPasswords, confirm: !showPasswords.confirm })}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                        >
                          {showPasswords.confirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end">
                    <Button type="submit" disabled={passwordLoading}>
                      {passwordLoading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Updating...
                        </>
                      ) : (
                        <>
                          <Lock className="mr-2 h-4 w-4" />
                          Update Password
                        </>
                      )}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          )}

          {/* Notifications Section */}
          {activeSection === 'notifications' && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bell className="h-5 w-5" />
                  Notification Preferences
                </CardTitle>
                <CardDescription>
                  Choose what emails you'd like to receive from us.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleNotificationSubmit} className="space-y-6">
                  {notifSuccess && (
                    <div className="rounded-lg bg-emerald-50 p-4 text-sm text-emerald-700">
                      <div className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4" />
                        Preferences saved!
                      </div>
                    </div>
                  )}

                  <div className="space-y-4">
                    <label className="flex items-start gap-4 rounded-lg border p-4 cursor-pointer hover:bg-gray-50">
                      <input
                        type="checkbox"
                        checked={notifications.order_updates}
                        onChange={(e) => setNotifications({ ...notifications, order_updates: e.target.checked })}
                        className="mt-1 h-4 w-4 rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
                      />
                      <div>
                        <p className="font-medium text-gray-900">Order Updates</p>
                        <p className="text-sm text-gray-500">
                          Receive emails about your order status, shipping updates, and delivery confirmations.
                        </p>
                      </div>
                    </label>

                    <label className="flex items-start gap-4 rounded-lg border p-4 cursor-pointer hover:bg-gray-50">
                      <input
                        type="checkbox"
                        checked={notifications.promotions}
                        onChange={(e) => setNotifications({ ...notifications, promotions: e.target.checked })}
                        className="mt-1 h-4 w-4 rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
                      />
                      <div>
                        <p className="font-medium text-gray-900">Promotions & Discounts</p>
                        <p className="text-sm text-gray-500">
                          Get notified about special offers, seasonal sales, and exclusive discounts.
                        </p>
                      </div>
                    </label>

                    <label className="flex items-start gap-4 rounded-lg border p-4 cursor-pointer hover:bg-gray-50">
                      <input
                        type="checkbox"
                        checked={notifications.newsletter}
                        onChange={(e) => setNotifications({ ...notifications, newsletter: e.target.checked })}
                        className="mt-1 h-4 w-4 rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
                      />
                      <div>
                        <p className="font-medium text-gray-900">Newsletter</p>
                        <p className="text-sm text-gray-500">
                          Monthly updates with design tips, new products, and industry news.
                        </p>
                      </div>
                    </label>
                  </div>

                  <div className="flex justify-end">
                    <Button type="submit" disabled={notifLoading}>
                      {notifLoading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Saving...
                        </>
                      ) : (
                        <>
                          <Save className="mr-2 h-4 w-4" />
                          Save Preferences
                        </>
                      )}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          )}

          {/* Danger Zone Section */}
          {activeSection === 'danger' && (
            <Card className="border-red-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-red-600">
                  <Shield className="h-5 w-5" />
                  Danger Zone
                </CardTitle>
                <CardDescription>
                  Irreversible actions that affect your account.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="rounded-lg border border-red-200 bg-red-50 p-6">
                  <h3 className="font-semibold text-red-900">Delete Account</h3>
                  <p className="mt-2 text-sm text-red-700">
                    Once you delete your account, there is no going back. This will permanently delete your account, 
                    order history, saved designs, and all associated data.
                  </p>
                  
                  <div className="mt-4">
                    <Label htmlFor="deleteConfirm" className="text-red-700">
                      Type <span className="font-mono font-bold">DELETE</span> to confirm
                    </Label>
                    <Input
                      id="deleteConfirm"
                      type="text"
                      value={deleteConfirm}
                      onChange={(e) => setDeleteConfirm(e.target.value)}
                      placeholder="DELETE"
                      className="mt-1 border-red-300 focus:border-red-500 focus:ring-red-500"
                    />
                  </div>

                  <Button
                    type="button"
                    variant="destructive"
                    onClick={handleDeleteAccount}
                    disabled={deleteConfirm !== 'DELETE' || deleteLoading}
                    className="mt-4"
                  >
                    {deleteLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Deleting...
                      </>
                    ) : (
                      <>
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete My Account
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
