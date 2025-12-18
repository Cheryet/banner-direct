'use client';

import * as React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Card, CardContent } from '@/components/ui/card';
import { Stepper } from '@/components/ui/stepper';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { formatCurrency } from '@/lib/format';

const checkoutSteps = [
  { id: 'shipping', label: 'Shipping' },
  { id: 'artwork', label: 'Artwork' },
  { id: 'payment', label: 'Payment' },
  { id: 'review', label: 'Review' },
];

const provinces = [
  'Alberta',
  'British Columbia',
  'Manitoba',
  'New Brunswick',
  'Newfoundland and Labrador',
  'Nova Scotia',
  'Ontario',
  'Prince Edward Island',
  'Quebec',
  'Saskatchewan',
];

export default function CheckoutPage() {
  const [currentStep, setCurrentStep] = React.useState(0);
  const [formData, setFormData] = React.useState({
    email: '',
    firstName: '',
    lastName: '',
    address: '',
    city: '',
    province: '',
    postalCode: '',
    phone: '',
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleProvinceChange = (value) => {
    setFormData((prev) => ({ ...prev, province: value }));
  };

  const handleNextStep = () => {
    if (currentStep < checkoutSteps.length - 1) {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const handlePrevStep = () => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  // Mock order summary
  const orderSummary = {
    subtotal: 99.98,
    shipping: 0,
    tax: 13.0,
    total: 112.98,
  };

  return (
    <div className="container py-8 md:py-12">
      <h1 className="mb-8">Checkout</h1>

      {/* Stepper */}
      <div className="mb-8">
        <Stepper steps={checkoutSteps} currentStep={currentStep} />
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        {/* Form Section */}
        <div className="lg:col-span-2">
          {currentStep === 0 && (
            <Card>
              <CardContent className="p-6">
                <h2 className="mb-6 text-xl font-semibold">Shipping Information</h2>
                <form className="space-y-4">
                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="your@email.com"
                      required
                    />
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <Label htmlFor="firstName">First Name</Label>
                      <Input
                        id="firstName"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="lastName">Last Name</Label>
                      <Input
                        id="lastName"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="address">Street Address</Label>
                    <Input
                      id="address"
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      required
                    />
                  </div>

                  <div className="grid gap-4 sm:grid-cols-3">
                    <div>
                      <Label htmlFor="city">City</Label>
                      <Input
                        id="city"
                        name="city"
                        value={formData.city}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="province">Province</Label>
                      <Select value={formData.province} onValueChange={handleProvinceChange}>
                        <SelectTrigger id="province">
                          <SelectValue placeholder="Select" />
                        </SelectTrigger>
                        <SelectContent>
                          {provinces.map((province) => (
                            <SelectItem key={province} value={province}>
                              {province}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="postalCode">Postal Code</Label>
                      <Input
                        id="postalCode"
                        name="postalCode"
                        value={formData.postalCode}
                        onChange={handleInputChange}
                        placeholder="A1A 1A1"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="phone">Phone (optional)</Label>
                    <Input
                      id="phone"
                      name="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={handleInputChange}
                      placeholder="(123) 456-7890"
                    />
                  </div>
                </form>
              </CardContent>
            </Card>
          )}

          {currentStep === 1 && (
            <Card>
              <CardContent className="p-6">
                <h2 className="mb-6 text-xl font-semibold">Artwork Confirmation</h2>
                <p className="text-muted-foreground">
                  Please review your uploaded artwork. Our team will check your files and contact
                  you if there are any issues.
                </p>
                <div className="mt-4 rounded-lg border bg-muted/30 p-8 text-center">
                  <p className="text-sm text-muted-foreground">Artwork preview will appear here</p>
                </div>
              </CardContent>
            </Card>
          )}

          {currentStep === 2 && (
            <Card>
              <CardContent className="p-6">
                <h2 className="mb-6 text-xl font-semibold">Payment</h2>
                <p className="mb-4 text-muted-foreground">Secure payment powered by Stripe</p>
                <div className="rounded-lg border bg-muted/30 p-8 text-center">
                  <p className="text-sm text-muted-foreground">
                    Stripe payment form will be integrated here
                  </p>
                </div>
              </CardContent>
            </Card>
          )}

          {currentStep === 3 && (
            <Card>
              <CardContent className="p-6">
                <h2 className="mb-6 text-xl font-semibold">Review Your Order</h2>
                <div className="space-y-4">
                  <div>
                    <h3 className="font-medium">Shipping Address</h3>
                    <p className="text-sm text-muted-foreground">
                      {formData.firstName} {formData.lastName}
                      <br />
                      {formData.address}
                      <br />
                      {formData.city}, {formData.province} {formData.postalCode}
                    </p>
                  </div>
                  <Separator />
                  <div>
                    <h3 className="font-medium">Items</h3>
                    <p className="text-sm text-muted-foreground">2× Vinyl Banner 3×6 ft</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Navigation Buttons */}
          <div className="mt-6 flex justify-between">
            <Button variant="outline" onClick={handlePrevStep} disabled={currentStep === 0}>
              Back
            </Button>
            {currentStep < checkoutSteps.length - 1 ? (
              <Button onClick={handleNextStep}>Continue</Button>
            ) : (
              <Button size="lg">Place Order</Button>
            )}
          </div>
        </div>

        {/* Order Summary Sidebar */}
        <div>
          <Card className="sticky top-24">
            <CardContent className="p-6">
              <h2 className="mb-4 text-lg font-semibold">Order Summary</h2>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span>{formatCurrency(orderSummary.subtotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Shipping</span>
                  <span>
                    {orderSummary.shipping === 0 ? 'Free' : formatCurrency(orderSummary.shipping)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Tax (HST)</span>
                  <span>{formatCurrency(orderSummary.tax)}</span>
                </div>
                <Separator />
                <div className="flex justify-between text-lg font-bold">
                  <span>Total</span>
                  <span className="text-primary">{formatCurrency(orderSummary.total)}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
