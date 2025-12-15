'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { User, Mail, Phone, Loader2, Check, Pencil, X } from 'lucide-react';

export function ProfileSection({ profile, user }) {
  const router = useRouter();
  const [isEditing, setIsEditing] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);
  const [success, setSuccess] = React.useState(false);
  const [error, setError] = React.useState(null);

  const [formData, setFormData] = React.useState({
    first_name: profile?.first_name || '',
    last_name: profile?.last_name || '',
    phone: profile?.phone || '',
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/account/profile', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to update profile');
      }

      setSuccess(true);
      setIsEditing(false);
      router.refresh();

      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      first_name: profile?.first_name || '',
      last_name: profile?.last_name || '',
      phone: profile?.phone || '',
    });
    setIsEditing(false);
    setError(null);
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100">
              <User className="h-6 w-6 text-emerald-600" />
            </div>
            <div>
              <CardTitle className="text-lg">Profile</CardTitle>
              <CardDescription>Your account information</CardDescription>
            </div>
          </div>
          {!isEditing && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsEditing(true)}
              className="text-gray-500 hover:text-gray-700"
            >
              <Pencil className="h-4 w-4" />
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {success && (
          <div className="mb-4 flex items-center gap-2 rounded-lg bg-emerald-50 p-3 text-sm text-emerald-700">
            <Check className="h-4 w-4" />
            Profile updated successfully!
          </div>
        )}

        {error && <div className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-600">{error}</div>}

        {isEditing ? (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label htmlFor="first_name">First Name</Label>
                <Input
                  id="first_name"
                  value={formData.first_name}
                  onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
                  placeholder="First name"
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="last_name">Last Name</Label>
                <Input
                  id="last_name"
                  value={formData.last_name}
                  onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
                  placeholder="Last name"
                  className="mt-1"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="email">Email</Label>
              <Input id="email" value={user?.email || ''} disabled className="mt-1 bg-gray-50" />
              <p className="mt-1 text-xs text-gray-500">Contact support to change your email</p>
            </div>

            <div>
              <Label htmlFor="phone">Phone</Label>
              <Input
                id="phone"
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="Enter your phone number"
                className="mt-1"
              />
            </div>

            <div className="flex gap-2 pt-2">
              <Button type="submit" disabled={isLoading} className="flex-1">
                {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Save Changes'}
              </Button>
              <Button type="button" variant="outline" onClick={handleCancel} disabled={isLoading}>
                <X className="h-4 w-4" />
              </Button>
            </div>
          </form>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <User className="h-4 w-4 text-gray-400" />
              <div>
                <p className="text-sm text-gray-500">Name</p>
                <p className="font-medium">
                  {profile?.first_name || profile?.last_name
                    ? `${profile?.first_name || ''} ${profile?.last_name || ''}`.trim()
                    : 'Not set'}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Mail className="h-4 w-4 text-gray-400" />
              <div>
                <p className="text-sm text-gray-500">Email</p>
                <p className="font-medium">{user?.email || 'Not set'}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Phone className="h-4 w-4 text-gray-400" />
              <div>
                <p className="text-sm text-gray-500">Phone</p>
                <p className="font-medium">{profile?.phone || 'Not set'}</p>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
