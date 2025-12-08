'use client';

import * as React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import {
  Building2,
  Users,
  Megaphone,
  CalendarRange,
  Check,
  MapPin,
  Printer,
  Clock,
  FileCheck,
  UserCheck,
  Calculator,
  ChevronRight,
} from 'lucide-react';

// =============================================================================
// WHO THIS IS FOR - Self-qualifying cards
// =============================================================================
const audiences = [
  {
    icon: Building2,
    title: 'Trade Shows & Conferences',
    description: 'Consistent booth displays across multiple events.',
  },
  {
    icon: Users,
    title: 'Multi-Location Businesses',
    description: 'Matched branding for franchises and retail chains.',
  },
  {
    icon: Megaphone,
    title: 'Corporate Marketing Teams',
    description: 'Campaign rollouts with reliable quality and timing.',
  },
  {
    icon: CalendarRange,
    title: 'Event Series & Tours',
    description: 'Scalable production for recurring events.',
  },
];

// =============================================================================
// WHY BULK WITH US - Value propositions
// =============================================================================
const valueProps = [
  'Volume-based pricing — transparent and predictable',
  'Matched color and size consistency across orders',
  'Dedicated production scheduling for your timeline',
  'Easy reorders from saved specs and artwork',
  'Canada-only production = faster turnaround',
];

// =============================================================================
// BULK PRICING ESTIMATOR DATA
// =============================================================================
const sizeOptions = [
  { id: '2x4', label: '2×4 ft', basePrice: 29.99 },
  { id: '3x6', label: '3×6 ft', basePrice: 49.99 },
  { id: '4x8', label: '4×8 ft', basePrice: 79.99 },
  { id: '5x10', label: '5×10 ft', basePrice: 129.99 },
];

const quantityRanges = [
  { id: '10-24', label: '10–24', min: 10, max: 24, discount: 0.10 },
  { id: '25-49', label: '25–49', min: 25, max: 49, discount: 0.15 },
  { id: '50-99', label: '50–99', min: 50, max: 99, discount: 0.20 },
  { id: '100-249', label: '100–249', min: 100, max: 249, discount: 0.25 },
  { id: '250+', label: '250+', min: 250, max: 500, discount: 0.30 },
];

// =============================================================================
// FAQ DATA
// =============================================================================
const faqs = [
  {
    question: 'What are the minimum quantities for bulk pricing?',
    answer: 'Bulk pricing starts at 10 units. For orders under 10, you can still order through our standard product pages with automatic volume discounts.',
  },
  {
    question: 'Can I reorder the same banners later?',
    answer: 'Yes. We save your artwork and specifications for easy reordering. Just reference your previous order number or contact your dedicated rep.',
  },
  {
    question: 'Can banners ship to multiple locations?',
    answer: 'Absolutely. We can split shipments to multiple addresses across Canada. Just include the details in your quote request.',
  },
  {
    question: 'How do you ensure color consistency across large orders?',
    answer: 'All banners in a bulk order are printed in the same production run on calibrated commercial equipment. We use standardized color profiles and perform quality checks throughout.',
  },
  {
    question: 'Do you offer net payment terms?',
    answer: 'Net 30 terms are available for qualified businesses after credit approval. Contact our enterprise team to discuss payment options.',
  },
];

// =============================================================================
// MAIN COMPONENT
// =============================================================================
export default function BulkPage() {
  // Form state
  const [formData, setFormData] = React.useState({
    companyName: '',
    contactName: '',
    email: '',
    phone: '',
    quantity: '',
    sizes: '',
    timeline: '',
    multipleLocations: false,
    repeatOrders: false,
    notes: '',
  });
  const [formErrors, setFormErrors] = React.useState({});
  const [isSubmitted, setIsSubmitted] = React.useState(false);
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  // Estimator state
  const [estimatorSize, setEstimatorSize] = React.useState('3x6');
  const [estimatorQty, setEstimatorQty] = React.useState('25-49');
  const [estimatorRush, setEstimatorRush] = React.useState(false);

  // Calculate estimate
  const getEstimate = () => {
    const size = sizeOptions.find((s) => s.id === estimatorSize);
    const qty = quantityRanges.find((q) => q.id === estimatorQty);
    if (!size || !qty) return null;

    const basePrice = size.basePrice;
    const discountedPrice = basePrice * (1 - qty.discount);
    const rushMultiplier = estimatorRush ? 1.25 : 1;
    const unitPrice = discountedPrice * rushMultiplier;
    const minTotal = unitPrice * qty.min;
    const maxTotal = unitPrice * qty.max;
    const productionDays = estimatorRush ? '3–5' : '7–10';

    return {
      unitPriceRange: `$${(unitPrice * 0.95).toFixed(2)} – $${unitPrice.toFixed(2)}`,
      totalRange: `$${minTotal.toFixed(0)} – $${maxTotal.toFixed(0)}`,
      productionDays,
      discount: `${(qty.discount * 100).toFixed(0)}%`,
    };
  };

  const estimate = getEstimate();

  // Form handlers
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
    // Clear error on change
    if (formErrors[name]) {
      setFormErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  const handleSelectChange = (name, value) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (formErrors[name]) {
      setFormErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  const validateForm = () => {
    const errors = {};
    if (!formData.companyName.trim()) errors.companyName = 'Company name is required';
    if (!formData.contactName.trim()) errors.contactName = 'Contact name is required';
    if (!formData.email.trim()) {
      errors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = 'Please enter a valid email address';
    }
    if (!formData.quantity) errors.quantity = 'Please select a quantity range';
    if (!formData.sizes.trim()) errors.sizes = 'Please specify the size(s) needed';
    if (!formData.timeline) errors.timeline = 'Please select a timeline';
    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    setIsSubmitting(true);
    
    // TODO: Replace with actual API call to Supabase
    console.log('Bulk quote form submitted:', formData);
    
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 1000));
    
    setIsSubmitting(false);
    setIsSubmitted(true);
  };

  const scrollToForm = () => {
    document.getElementById('quote-form')?.scrollIntoView({ behavior: 'smooth' });
  };

  // ---------------------------------------------------------------------------
  // RENDER
  // ---------------------------------------------------------------------------
  return (
    <>
      {/* ====================================================================
          HERO SECTION - Enterprise variant
          ==================================================================== */}
      <section className="bg-gradient-to-b from-muted/40 to-background py-16 md:py-24">
        <div className="container">
          <div className="mx-auto max-w-3xl text-center">
            <h1 className="text-3xl font-bold tracking-tight md:text-4xl lg:text-5xl">
              Bulk Banner Printing, Made Easy
            </h1>
            <p className="mt-6 text-lg text-muted-foreground md:text-xl">
              Volume pricing. Consistent quality. Printed in Canada and shipped fast.
            </p>
            <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:justify-center">
              <Button size="lg" onClick={scrollToForm}>
                Request Bulk Quote
              </Button>
              <Button variant="outline" size="lg" asChild>
                <a href="tel:+18005551234">Talk to a Print Specialist</a>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* ====================================================================
          WHO THIS IS FOR - Self-qualifying
          ==================================================================== */}
      <section className="py-16 md:py-20">
        <div className="container">
          <h2 className="mb-10 text-center text-2xl font-semibold md:text-3xl">
            Built for Teams Who Need More
          </h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {audiences.map((audience) => (
              <Card key={audience.title} className="text-center">
                <CardContent className="p-6">
                  <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-muted">
                    <audience.icon className="h-6 w-6 text-foreground" aria-hidden="true" />
                  </div>
                  <h3 className="font-semibold">{audience.title}</h3>
                  <p className="mt-2 text-sm text-muted-foreground">{audience.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* ====================================================================
          WHY BULK WITH US - Enterprise value
          ==================================================================== */}
      <section className="bg-muted/30 py-16 md:py-20">
        <div className="container">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            {/* Content */}
            <div>
              <h2 className="mb-6 text-2xl font-semibold md:text-3xl">
                Why Order in Bulk With Us
              </h2>
              <p className="mb-8 text-muted-foreground">
                We're built for this. Our production facility handles orders from 10 to 10,000+ 
                banners with the same attention to quality and timing.
              </p>
              <ul className="space-y-4">
                {valueProps.map((prop) => (
                  <li key={prop} className="flex items-start gap-3">
                    <div className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary/10">
                      <Check className="h-3 w-3 text-primary" aria-hidden="true" />
                    </div>
                    <span>{prop}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Visual placeholder */}
            <div className="relative">
              <div className="aspect-[4/3] overflow-hidden rounded-xl bg-muted">
                <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-muted to-muted/50">
                  <div className="text-center p-8">
                    <Printer className="mx-auto mb-4 h-16 w-16 text-muted-foreground/40" aria-hidden="true" />
                    <p className="text-muted-foreground">Production facility</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ====================================================================
          BULK PRICING ESTIMATOR
          ==================================================================== */}
      <section className="py-16 md:py-20">
        <div className="container">
          <div className="mx-auto max-w-2xl">
            <div className="mb-8 text-center">
              <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-muted px-3 py-1 text-sm">
                <Calculator className="h-4 w-4" aria-hidden="true" />
                Pricing Estimator
              </div>
              <h2 className="text-2xl font-semibold md:text-3xl">
                Get a Quick Estimate
              </h2>
              <p className="mt-2 text-muted-foreground">
                Adjust the options below to see approximate pricing.
              </p>
            </div>

            <Card>
              <CardContent className="p-6">
                <div className="grid gap-6 md:grid-cols-3">
                  {/* Size */}
                  <div>
                    <Label htmlFor="est-size" className="mb-2 block font-medium">
                      Banner Size
                    </Label>
                    <Select value={estimatorSize} onValueChange={setEstimatorSize}>
                      <SelectTrigger id="est-size">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {sizeOptions.map((size) => (
                          <SelectItem key={size.id} value={size.id}>
                            {size.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Quantity */}
                  <div>
                    <Label htmlFor="est-qty" className="mb-2 block font-medium">
                      Quantity
                    </Label>
                    <Select value={estimatorQty} onValueChange={setEstimatorQty}>
                      <SelectTrigger id="est-qty">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {quantityRanges.map((qty) => (
                          <SelectItem key={qty.id} value={qty.id}>
                            {qty.label} banners
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Rush */}
                  <div>
                    <Label className="mb-2 block font-medium">Timeline</Label>
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => setEstimatorRush(false)}
                        className={`flex-1 rounded-lg border px-3 py-2 text-sm font-medium transition-colors ${
                          !estimatorRush
                            ? 'border-primary bg-primary/5 text-foreground'
                            : 'border-border text-muted-foreground hover:border-primary/50'
                        }`}
                      >
                        Standard
                      </button>
                      <button
                        type="button"
                        onClick={() => setEstimatorRush(true)}
                        className={`flex-1 rounded-lg border px-3 py-2 text-sm font-medium transition-colors ${
                          estimatorRush
                            ? 'border-primary bg-primary/5 text-foreground'
                            : 'border-border text-muted-foreground hover:border-primary/50'
                        }`}
                      >
                        Rush
                      </button>
                    </div>
                  </div>
                </div>

                <Separator className="my-6" />

                {/* Results */}
                {estimate && (
                  <div className="grid gap-4 text-center md:grid-cols-3">
                    <div>
                      <p className="text-sm text-muted-foreground">Unit Price</p>
                      <p className="text-xl font-bold">{estimate.unitPriceRange}</p>
                      <p className="text-xs text-green-600">{estimate.discount} bulk discount</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Estimated Total</p>
                      <p className="text-xl font-bold text-primary">{estimate.totalRange}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Production Time</p>
                      <p className="text-xl font-bold">{estimate.productionDays} days</p>
                    </div>
                  </div>
                )}

                <p className="mt-6 text-center text-sm text-muted-foreground">
                  Final pricing confirmed after artwork review. Request a quote for exact pricing.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* ====================================================================
          BULK QUOTE FORM
          ==================================================================== */}
      <section id="quote-form" className="bg-muted/30 py-16 md:py-20">
        <div className="container">
          <div className="mx-auto max-w-2xl">
            <div className="mb-8 text-center">
              <h2 className="text-2xl font-semibold md:text-3xl">
                Request a Bulk Quote
              </h2>
              <p className="mt-2 text-muted-foreground">
                Tell us about your project and we'll get back to you with pricing.
              </p>
            </div>

            {isSubmitted ? (
              /* Success State */
              <Card>
                <CardContent className="p-8 text-center">
                  <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
                    <Check className="h-8 w-8 text-green-600" aria-hidden="true" />
                  </div>
                  <h3 className="text-xl font-semibold">Thanks for reaching out!</h3>
                  <p className="mt-2 text-muted-foreground">
                    Our team will review your request and get back to you within 1 business day.
                  </p>
                  <Button
                    variant="outline"
                    className="mt-6"
                    onClick={() => {
                      setIsSubmitted(false);
                      setFormData({
                        companyName: '',
                        contactName: '',
                        email: '',
                        phone: '',
                        quantity: '',
                        sizes: '',
                        timeline: '',
                        multipleLocations: false,
                        repeatOrders: false,
                        notes: '',
                      });
                    }}
                  >
                    Submit Another Request
                  </Button>
                </CardContent>
              </Card>
            ) : (
              /* Form */
              <Card>
                <CardContent className="p-6 md:p-8">
                  <form onSubmit={handleSubmit} className="space-y-6" noValidate>
                    {/* Company & Contact */}
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div>
                        <Label htmlFor="companyName">
                          Company Name <span className="text-destructive">*</span>
                        </Label>
                        <Input
                          id="companyName"
                          name="companyName"
                          value={formData.companyName}
                          onChange={handleInputChange}
                          placeholder="Acme Corp"
                          aria-invalid={!!formErrors.companyName}
                          aria-describedby={formErrors.companyName ? 'companyName-error' : undefined}
                        />
                        {formErrors.companyName && (
                          <p id="companyName-error" className="mt-1 text-sm text-destructive">
                            {formErrors.companyName}
                          </p>
                        )}
                      </div>
                      <div>
                        <Label htmlFor="contactName">
                          Contact Name <span className="text-destructive">*</span>
                        </Label>
                        <Input
                          id="contactName"
                          name="contactName"
                          value={formData.contactName}
                          onChange={handleInputChange}
                          placeholder="Jane Smith"
                          aria-invalid={!!formErrors.contactName}
                          aria-describedby={formErrors.contactName ? 'contactName-error' : undefined}
                        />
                        {formErrors.contactName && (
                          <p id="contactName-error" className="mt-1 text-sm text-destructive">
                            {formErrors.contactName}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Email & Phone */}
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div>
                        <Label htmlFor="email">
                          Email <span className="text-destructive">*</span>
                        </Label>
                        <Input
                          id="email"
                          name="email"
                          type="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          placeholder="jane@acme.com"
                          aria-invalid={!!formErrors.email}
                          aria-describedby={formErrors.email ? 'email-error' : undefined}
                        />
                        {formErrors.email && (
                          <p id="email-error" className="mt-1 text-sm text-destructive">
                            {formErrors.email}
                          </p>
                        )}
                      </div>
                      <div>
                        <Label htmlFor="phone">Phone (optional)</Label>
                        <Input
                          id="phone"
                          name="phone"
                          type="tel"
                          value={formData.phone}
                          onChange={handleInputChange}
                          placeholder="(416) 555-1234"
                        />
                      </div>
                    </div>

                    {/* Quantity & Sizes */}
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div>
                        <Label htmlFor="quantity">
                          Quantity Range <span className="text-destructive">*</span>
                        </Label>
                        <Select
                          value={formData.quantity}
                          onValueChange={(value) => handleSelectChange('quantity', value)}
                        >
                          <SelectTrigger
                            id="quantity"
                            aria-invalid={!!formErrors.quantity}
                            aria-describedby={formErrors.quantity ? 'quantity-error' : undefined}
                          >
                            <SelectValue placeholder="Select quantity" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="10-24">10–24 banners</SelectItem>
                            <SelectItem value="25-49">25–49 banners</SelectItem>
                            <SelectItem value="50-99">50–99 banners</SelectItem>
                            <SelectItem value="100-249">100–249 banners</SelectItem>
                            <SelectItem value="250-499">250–499 banners</SelectItem>
                            <SelectItem value="500+">500+ banners</SelectItem>
                          </SelectContent>
                        </Select>
                        {formErrors.quantity && (
                          <p id="quantity-error" className="mt-1 text-sm text-destructive">
                            {formErrors.quantity}
                          </p>
                        )}
                      </div>
                      <div>
                        <Label htmlFor="sizes">
                          Size(s) Needed <span className="text-destructive">*</span>
                        </Label>
                        <Input
                          id="sizes"
                          name="sizes"
                          value={formData.sizes}
                          onChange={handleInputChange}
                          placeholder="e.g., 3×6 ft, 4×8 ft"
                          aria-invalid={!!formErrors.sizes}
                          aria-describedby={formErrors.sizes ? 'sizes-error' : undefined}
                        />
                        {formErrors.sizes && (
                          <p id="sizes-error" className="mt-1 text-sm text-destructive">
                            {formErrors.sizes}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Timeline */}
                    <div>
                      <Label htmlFor="timeline">
                        Timeline <span className="text-destructive">*</span>
                      </Label>
                      <Select
                        value={formData.timeline}
                        onValueChange={(value) => handleSelectChange('timeline', value)}
                      >
                        <SelectTrigger
                          id="timeline"
                          aria-invalid={!!formErrors.timeline}
                          aria-describedby={formErrors.timeline ? 'timeline-error' : undefined}
                        >
                          <SelectValue placeholder="When do you need them?" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="asap">As soon as possible</SelectItem>
                          <SelectItem value="1-2weeks">Within 1–2 weeks</SelectItem>
                          <SelectItem value="3-4weeks">Within 3–4 weeks</SelectItem>
                          <SelectItem value="1month+">More than 1 month</SelectItem>
                          <SelectItem value="flexible">Flexible / Planning ahead</SelectItem>
                        </SelectContent>
                      </Select>
                      {formErrors.timeline && (
                        <p id="timeline-error" className="mt-1 text-sm text-destructive">
                          {formErrors.timeline}
                        </p>
                      )}
                    </div>

                    {/* Optional: Multiple locations & Repeat orders */}
                    <div className="flex flex-wrap gap-6">
                      <label className="flex items-center gap-2 text-sm">
                        <input
                          type="checkbox"
                          name="multipleLocations"
                          checked={formData.multipleLocations}
                          onChange={handleInputChange}
                          className="h-4 w-4 rounded border-gray-300"
                        />
                        Ship to multiple locations
                      </label>
                      <label className="flex items-center gap-2 text-sm">
                        <input
                          type="checkbox"
                          name="repeatOrders"
                          checked={formData.repeatOrders}
                          onChange={handleInputChange}
                          className="h-4 w-4 rounded border-gray-300"
                        />
                        This will be a recurring order
                      </label>
                    </div>

                    {/* Notes */}
                    <div>
                      <Label htmlFor="notes">Additional Notes (optional)</Label>
                      <Textarea
                        id="notes"
                        name="notes"
                        value={formData.notes}
                        onChange={handleInputChange}
                        placeholder="Materials, artwork status, special requirements, etc."
                        rows={4}
                      />
                    </div>

                    {/* File upload note */}
                    <p className="text-sm text-muted-foreground">
                      Have artwork or specs ready? You can attach files after we respond, or email them directly to{' '}
                      <a href="mailto:bulk@bannerdirect.ca" className="text-primary hover:underline">
                        bulk@bannerdirect.ca
                      </a>
                    </p>

                    {/* Submit */}
                    <Button
                      type="submit"
                      size="lg"
                      className="w-full"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? 'Submitting...' : 'Request Bulk Quote'}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            )}

            {/* Response Expectation - Trust section */}
            <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <div className="flex items-center gap-3 text-sm">
                <Clock className="h-5 w-5 text-primary" aria-hidden="true" />
                <span>Response within 1 business day</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <UserCheck className="h-5 w-5 text-primary" aria-hidden="true" />
                <span>Human review, not automated</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <FileCheck className="h-5 w-5 text-primary" aria-hidden="true" />
                <span>Proofs before production</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <Users className="h-5 w-5 text-primary" aria-hidden="true" />
                <span>Dedicated contact for bulk</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ====================================================================
          CANADA & PRODUCTION TRUST BAND
          ==================================================================== */}
      <section className="border-y py-8">
        <div className="container">
          <div className="flex flex-col items-center justify-center gap-4 text-center md:flex-row md:gap-8">
            <Badge variant="canada" className="gap-1.5">
              <MapPin className="h-3 w-3" aria-hidden="true" />
              Made in Canada
            </Badge>
            <p className="text-muted-foreground">
              All bulk banners are printed in Canada on commercial HP & Mimaki equipment.
            </p>
          </div>
        </div>
      </section>

      {/* ====================================================================
          FAQ - Bulk-specific
          ==================================================================== */}
      <section className="py-16 md:py-20">
        <div className="container">
          <div className="mx-auto max-w-2xl">
            <h2 className="mb-8 text-center text-2xl font-semibold md:text-3xl">
              Frequently Asked Questions
            </h2>
            <Accordion type="single" collapsible className="w-full">
              {faqs.map((faq, index) => (
                <AccordionItem key={index} value={`faq-${index}`}>
                  <AccordionTrigger className="text-left">{faq.question}</AccordionTrigger>
                  <AccordionContent className="text-muted-foreground">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>
      </section>

      {/* ====================================================================
          FINAL CTA STRIP
          ==================================================================== */}
      <section className="bg-muted/30 py-12 md:py-16">
        <div className="container">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-2xl font-semibold md:text-3xl">
              Ready to get started?
            </h2>
            <p className="mt-3 text-muted-foreground">
              From dozens to thousands — we've got the capacity.
            </p>
            <Button size="lg" className="mt-6" onClick={scrollToForm}>
              Request Bulk Quote
              <ChevronRight className="ml-2 h-5 w-5" aria-hidden="true" />
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}
