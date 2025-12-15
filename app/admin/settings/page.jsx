'use client';

import * as React from 'react';
import { createClient } from '@/lib/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import {
  Settings,
  Store,
  Mail,
  CreditCard,
  Truck,
  Bell,
  Shield,
  Save,
  Loader2,
  CheckCircle,
  AlertCircle,
  Globe,
  Percent,
  DollarSign,
  Package,
} from 'lucide-react';

export default function AdminSettingsPage() {
  const [activeSection, setActiveSection] = React.useState('store');
  const [isSaving, setIsSaving] = React.useState(false);
  const [success, setSuccess] = React.useState(null);
  const [error, setError] = React.useState(null);

  // Store settings
  const [storeSettings, setStoreSettings] = React.useState({
    store_name: 'Banner Direct',
    store_email: 'hello@bannerdirect.ca',
    store_phone: '1-800-555-1234',
    store_address: '123 Print Street, Toronto, ON M5V 1A1',
    currency: 'CAD',
    timezone: 'America/Toronto',
  });

  // Shipping settings
  const [shippingSettings, setShippingSettings] = React.useState({
    free_shipping_threshold: '150',
    standard_shipping_rate: '12.99',
    express_shipping_rate: '24.99',
    processing_days: '2-3',
    shipping_zones: 'Canada',
  });

  // Tax settings
  const [taxSettings, setTaxSettings] = React.useState({
    tax_enabled: true,
    tax_rate: '13',
    tax_name: 'HST',
    tax_included: false,
  });

  // Notification settings
  const [notificationSettings, setNotificationSettings] = React.useState({
    order_notifications: true,
    low_stock_alerts: true,
    customer_signup_alerts: false,
    daily_summary: true,
    notification_email: 'admin@bannerdirect.ca',
  });

  const handleSave = async () => {
    setIsSaving(true);
    setError(null);
    setSuccess(null);

    // Simulate save - in production, this would save to database
    await new Promise((resolve) => setTimeout(resolve, 1000));

    setSuccess('Settings saved successfully');
    setIsSaving(false);
    setTimeout(() => setSuccess(null), 3000);
  };

  const sections = [
    { id: 'store', label: 'Store Details', icon: Store },
    { id: 'shipping', label: 'Shipping', icon: Truck },
    { id: 'tax', label: 'Tax', icon: Percent },
    { id: 'notifications', label: 'Notifications', icon: Bell },
  ];

  return (
    <div className="min-w-0">
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-900 sm:text-2xl">Settings</h1>
          <p className="text-sm text-muted-foreground">
            Configure your store settings and preferences
          </p>
        </div>
        <Button onClick={handleSave} disabled={isSaving} className="w-full sm:w-auto">
          {isSaving ? (
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

      {/* Alerts */}
      {error && (
        <div className="mb-6 flex items-center gap-2 rounded-lg bg-red-50 p-4 text-red-700">
          <AlertCircle className="h-5 w-5" />
          {error}
        </div>
      )}
      {success && (
        <div className="mb-6 flex items-center gap-2 rounded-lg bg-emerald-50 p-4 text-emerald-700">
          <CheckCircle className="h-5 w-5" />
          {success}
        </div>
      )}

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
                  }`}
                >
                  <Icon className="h-5 w-5" />
                  {section.label}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-3">
          {/* Store Details */}
          {activeSection === 'store' && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Store className="h-5 w-5" />
                  Store Details
                </CardTitle>
                <CardDescription>Basic information about your store</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid gap-6 sm:grid-cols-2">
                  <div className="sm:col-span-2">
                    <Label htmlFor="store_name">Store Name</Label>
                    <Input
                      id="store_name"
                      value={storeSettings.store_name}
                      onChange={(e) =>
                        setStoreSettings({ ...storeSettings, store_name: e.target.value })
                      }
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <Label htmlFor="store_email">Contact Email</Label>
                    <div className="relative mt-1">
                      <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                      <Input
                        id="store_email"
                        type="email"
                        value={storeSettings.store_email}
                        onChange={(e) =>
                          setStoreSettings({ ...storeSettings, store_email: e.target.value })
                        }
                        className="pl-10"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="store_phone">Phone Number</Label>
                    <Input
                      id="store_phone"
                      value={storeSettings.store_phone}
                      onChange={(e) =>
                        setStoreSettings({ ...storeSettings, store_phone: e.target.value })
                      }
                      className="mt-1"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <Label htmlFor="store_address">Business Address</Label>
                    <Input
                      id="store_address"
                      value={storeSettings.store_address}
                      onChange={(e) =>
                        setStoreSettings({ ...storeSettings, store_address: e.target.value })
                      }
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <Label htmlFor="currency">Currency</Label>
                    <select
                      id="currency"
                      value={storeSettings.currency}
                      onChange={(e) =>
                        setStoreSettings({ ...storeSettings, currency: e.target.value })
                      }
                      className="mt-1 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                    >
                      <option value="CAD">CAD - Canadian Dollar</option>
                      <option value="USD">USD - US Dollar</option>
                    </select>
                  </div>

                  <div>
                    <Label htmlFor="timezone">Timezone</Label>
                    <select
                      id="timezone"
                      value={storeSettings.timezone}
                      onChange={(e) =>
                        setStoreSettings({ ...storeSettings, timezone: e.target.value })
                      }
                      className="mt-1 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                    >
                      <option value="America/Toronto">Eastern Time (Toronto)</option>
                      <option value="America/Vancouver">Pacific Time (Vancouver)</option>
                      <option value="America/Edmonton">Mountain Time (Edmonton)</option>
                      <option value="America/Winnipeg">Central Time (Winnipeg)</option>
                      <option value="America/Halifax">Atlantic Time (Halifax)</option>
                    </select>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Shipping Settings */}
          {activeSection === 'shipping' && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Truck className="h-5 w-5" />
                  Shipping Settings
                </CardTitle>
                <CardDescription>Configure shipping rates and options</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid gap-6 sm:grid-cols-2">
                  <div>
                    <Label htmlFor="free_shipping_threshold">Free Shipping Threshold ($)</Label>
                    <div className="relative mt-1">
                      <DollarSign className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                      <Input
                        id="free_shipping_threshold"
                        type="number"
                        value={shippingSettings.free_shipping_threshold}
                        onChange={(e) =>
                          setShippingSettings({
                            ...shippingSettings,
                            free_shipping_threshold: e.target.value,
                          })
                        }
                        className="pl-10"
                      />
                    </div>
                    <p className="mt-1 text-xs text-gray-500">
                      Orders above this amount get free shipping
                    </p>
                  </div>

                  <div>
                    <Label htmlFor="processing_days">Processing Time</Label>
                    <Input
                      id="processing_days"
                      value={shippingSettings.processing_days}
                      onChange={(e) =>
                        setShippingSettings({
                          ...shippingSettings,
                          processing_days: e.target.value,
                        })
                      }
                      placeholder="2-3 business days"
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <Label htmlFor="standard_shipping_rate">Standard Shipping Rate ($)</Label>
                    <div className="relative mt-1">
                      <DollarSign className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                      <Input
                        id="standard_shipping_rate"
                        type="number"
                        step="0.01"
                        value={shippingSettings.standard_shipping_rate}
                        onChange={(e) =>
                          setShippingSettings({
                            ...shippingSettings,
                            standard_shipping_rate: e.target.value,
                          })
                        }
                        className="pl-10"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="express_shipping_rate">Express Shipping Rate ($)</Label>
                    <div className="relative mt-1">
                      <DollarSign className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                      <Input
                        id="express_shipping_rate"
                        type="number"
                        step="0.01"
                        value={shippingSettings.express_shipping_rate}
                        onChange={(e) =>
                          setShippingSettings({
                            ...shippingSettings,
                            express_shipping_rate: e.target.value,
                          })
                        }
                        className="pl-10"
                      />
                    </div>
                  </div>

                  <div className="sm:col-span-2">
                    <Label htmlFor="shipping_zones">Shipping Zones</Label>
                    <Input
                      id="shipping_zones"
                      value={shippingSettings.shipping_zones}
                      onChange={(e) =>
                        setShippingSettings({ ...shippingSettings, shipping_zones: e.target.value })
                      }
                      placeholder="Canada, United States"
                      className="mt-1"
                    />
                    <p className="mt-1 text-xs text-gray-500">Countries/regions you ship to</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Tax Settings */}
          {activeSection === 'tax' && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Percent className="h-5 w-5" />
                  Tax Settings
                </CardTitle>
                <CardDescription>Configure tax rates and collection</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={taxSettings.tax_enabled}
                    onChange={(e) =>
                      setTaxSettings({ ...taxSettings, tax_enabled: e.target.checked })
                    }
                    className="h-4 w-4 rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
                  />
                  <div>
                    <p className="font-medium text-gray-900">Enable Tax Collection</p>
                    <p className="text-sm text-gray-500">
                      Automatically calculate and add tax to orders
                    </p>
                  </div>
                </label>

                {taxSettings.tax_enabled && (
                  <div className="grid gap-6 sm:grid-cols-2 pt-4 border-t">
                    <div>
                      <Label htmlFor="tax_name">Tax Name</Label>
                      <Input
                        id="tax_name"
                        value={taxSettings.tax_name}
                        onChange={(e) =>
                          setTaxSettings({ ...taxSettings, tax_name: e.target.value })
                        }
                        placeholder="HST, GST, PST, etc."
                        className="mt-1"
                      />
                    </div>

                    <div>
                      <Label htmlFor="tax_rate">Tax Rate (%)</Label>
                      <div className="relative mt-1">
                        <Input
                          id="tax_rate"
                          type="number"
                          step="0.01"
                          value={taxSettings.tax_rate}
                          onChange={(e) =>
                            setTaxSettings({ ...taxSettings, tax_rate: e.target.value })
                          }
                          className="pr-8"
                        />
                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                          %
                        </span>
                      </div>
                    </div>

                    <div className="sm:col-span-2">
                      <label className="flex items-center gap-3 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={taxSettings.tax_included}
                          onChange={(e) =>
                            setTaxSettings({ ...taxSettings, tax_included: e.target.checked })
                          }
                          className="h-4 w-4 rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
                        />
                        <div>
                          <p className="font-medium text-gray-900">Prices Include Tax</p>
                          <p className="text-sm text-gray-500">
                            Display prices with tax already included
                          </p>
                        </div>
                      </label>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Notification Settings */}
          {activeSection === 'notifications' && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bell className="h-5 w-5" />
                  Notification Settings
                </CardTitle>
                <CardDescription>Configure admin notifications and alerts</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <Label htmlFor="notification_email">Notification Email</Label>
                  <div className="relative mt-1">
                    <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                    <Input
                      id="notification_email"
                      type="email"
                      value={notificationSettings.notification_email}
                      onChange={(e) =>
                        setNotificationSettings({
                          ...notificationSettings,
                          notification_email: e.target.value,
                        })
                      }
                      className="pl-10"
                    />
                  </div>
                </div>

                <Separator />

                <div className="space-y-4">
                  <label className="flex items-center justify-between cursor-pointer rounded-lg border p-4 hover:bg-gray-50">
                    <div>
                      <p className="font-medium text-gray-900">New Order Notifications</p>
                      <p className="text-sm text-gray-500">
                        Get notified when a new order is placed
                      </p>
                    </div>
                    <input
                      type="checkbox"
                      checked={notificationSettings.order_notifications}
                      onChange={(e) =>
                        setNotificationSettings({
                          ...notificationSettings,
                          order_notifications: e.target.checked,
                        })
                      }
                      className="h-4 w-4 rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
                    />
                  </label>

                  <label className="flex items-center justify-between cursor-pointer rounded-lg border p-4 hover:bg-gray-50">
                    <div>
                      <p className="font-medium text-gray-900">Low Stock Alerts</p>
                      <p className="text-sm text-gray-500">
                        Get notified when inventory is running low
                      </p>
                    </div>
                    <input
                      type="checkbox"
                      checked={notificationSettings.low_stock_alerts}
                      onChange={(e) =>
                        setNotificationSettings({
                          ...notificationSettings,
                          low_stock_alerts: e.target.checked,
                        })
                      }
                      className="h-4 w-4 rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
                    />
                  </label>

                  <label className="flex items-center justify-between cursor-pointer rounded-lg border p-4 hover:bg-gray-50">
                    <div>
                      <p className="font-medium text-gray-900">Customer Signup Alerts</p>
                      <p className="text-sm text-gray-500">
                        Get notified when a new customer registers
                      </p>
                    </div>
                    <input
                      type="checkbox"
                      checked={notificationSettings.customer_signup_alerts}
                      onChange={(e) =>
                        setNotificationSettings({
                          ...notificationSettings,
                          customer_signup_alerts: e.target.checked,
                        })
                      }
                      className="h-4 w-4 rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
                    />
                  </label>

                  <label className="flex items-center justify-between cursor-pointer rounded-lg border p-4 hover:bg-gray-50">
                    <div>
                      <p className="font-medium text-gray-900">Daily Summary</p>
                      <p className="text-sm text-gray-500">
                        Receive a daily summary of store activity
                      </p>
                    </div>
                    <input
                      type="checkbox"
                      checked={notificationSettings.daily_summary}
                      onChange={(e) =>
                        setNotificationSettings({
                          ...notificationSettings,
                          daily_summary: e.target.checked,
                        })
                      }
                      className="h-4 w-4 rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
                    />
                  </label>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
