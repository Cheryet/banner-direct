'use client';

import * as React from 'react';
import { useParams } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Card, CardContent } from '@/components/ui/card';
import { FileUpload } from '@/components/ui/file-upload';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import {
  Check,
  Truck,
  Shield,
  MapPin,
  Printer,
  Zap,
  Clock,
  Minus,
  Plus,
  X,
  ChevronLeft,
  ChevronRight,
  Info,
} from 'lucide-react';
import { formatCurrency } from '@/lib/format';

// =============================================================================
// HELPER DATA - Material descriptions with "Best for..." text
// =============================================================================
const materialHelpers = {
  '13oz': { badge: 'Best Value', bestFor: 'Best for indoor events and short-term outdoor use' },
  '18oz': {
    badge: 'Heavy Duty',
    bestFor: 'Best for long-term outdoor display and windy conditions',
  },
  mesh: {
    badge: 'Wind Resistant',
    bestFor: 'Best for fences, scaffolding, and very windy locations',
  },
  premium: { badge: 'Premium', bestFor: 'Best for trade shows and professional presentations' },
  economy: { badge: 'Budget', bestFor: 'Best for one-time events and tight budgets' },
  '9oz': { badge: 'Standard Mesh', bestFor: 'Best for outdoor banners on fences' },
  '12oz': { badge: 'Heavy Mesh', bestFor: 'Best for long-term outdoor mesh installations' },
  polyester: { badge: 'Fabric', bestFor: 'Best for indoor displays and reusable banners' },
  canvas: { badge: 'Premium', bestFor: 'Best for high-end indoor displays' },
};

// Gallery images (placeholders)
const galleryImages = [
  { id: 1, label: 'Banner in use', description: 'Real-world application' },
  { id: 2, label: 'Material close-up', description: 'Texture detail' },
  { id: 3, label: 'Event installation', description: 'Installed at event' },
  { id: 4, label: 'Edge finishing', description: 'Hemmed edges & grommets' },
];

// =============================================================================
// PRICE CALCULATION HELPER
// =============================================================================
function calculatePrice(product, options) {
  if (!product) return null;
  const { sizeId, materialId, finishingIds = [], leadTimeId, quantity } = options;

  const sizes = product.sizes || [];
  const materials = product.materials || [];
  const finishings = product.finishings || [];
  const leadTimes = product.lead_times || [];
  const tierPricing = product.tier_pricing || [];

  const size = sizes.find((s) => s.id === sizeId);
  const material = materials.find((m) => m.id === materialId);
  const leadTime = leadTimes.find((l) => l.id === leadTimeId);
  const selectedFinishings = finishings.filter((f) => finishingIds.includes(f.id));

  if (!size || !material || !leadTime) return null;

  let basePrice = size.price || product.base_price || 0;
  basePrice += material.price || 0;
  basePrice += selectedFinishings.reduce((sum, f) => sum + (f.price || 0), 0);

  const tier = tierPricing.find(
    (t) => quantity >= t.minQty && (t.maxQty === null || quantity <= t.maxQty)
  );
  const discount = tier ? tier.discount : 0;
  const discountedPrice = basePrice * (1 - discount / 100);
  const rushFee = leadTime.price || 0;

  return {
    unitPrice: discountedPrice,
    quantity,
    subtotal: discountedPrice * quantity,
    rushFee,
    total: discountedPrice * quantity + rushFee,
    discount,
  };
}

// =============================================================================
// MAIN COMPONENT
// =============================================================================
export default function ProductPage() {
  const params = useParams();

  // ---------------------------------------------------------------------------
  // STATE
  // ---------------------------------------------------------------------------
  const [product, setProduct] = React.useState(null);
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState(null);
  const [config, setConfig] = React.useState({
    sizeId: '',
    materialId: '',
    finishingIds: ['hemmed', 'grommets'],
    leadTimeId: '',
    quantity: 1,
  });
  const [files, setFiles] = React.useState([]);
  const [proofOption, setProofOption] = React.useState('print');
  const [activeImageIndex, setActiveImageIndex] = React.useState(0);
  const [lightboxOpen, setLightboxOpen] = React.useState(false);

  // ---------------------------------------------------------------------------
  // FETCH PRODUCT FROM SUPABASE
  // ---------------------------------------------------------------------------
  React.useEffect(() => {
    async function fetchProduct() {
      const supabase = createClient();
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('slug', params.slug)
        .eq('is_active', true)
        .single();

      if (error || !data) {
        setError('Product not found');
        setIsLoading(false);
        return;
      }

      setProduct(data);
      // Initialize config with product defaults
      setConfig((prev) => ({
        ...prev,
        sizeId: data.sizes?.[0]?.id || '',
        materialId: data.materials?.[0]?.id || '',
        leadTimeId: data.lead_times?.[0]?.id || '',
      }));
      setIsLoading(false);
    }
    fetchProduct();
  }, [params.slug]);

  // ---------------------------------------------------------------------------
  // DERIVED STATE
  // ---------------------------------------------------------------------------
  const pricing = calculatePrice(product, config);
  const isValid = config.sizeId && config.materialId && files.length > 0;
  const selectedSize = product?.sizes?.find((s) => s.id === config.sizeId);
  const selectedLeadTime = product?.lead_times?.find((l) => l.id === config.leadTimeId);

  // Calculate estimated delivery date
  const getEstimatedDate = (leadTimeId) => {
    const days = leadTimeId === 'same-day' ? 1 : leadTimeId === 'rush' ? 3 : 7;
    const date = new Date();
    let addedDays = 0;
    while (addedDays < days) {
      date.setDate(date.getDate() + 1);
      if (date.getDay() !== 0 && date.getDay() !== 6) {
        addedDays++;
      }
    }
    return date.toLocaleDateString('en-CA', { weekday: 'short', month: 'short', day: 'numeric' });
  };

  // Get tier hint for quantity
  const getTierHint = () => {
    if (!product?.tier_pricing) return null;
    const nextTier = product.tier_pricing.find((t) => config.quantity < t.minQty);
    if (nextTier && nextTier.discount > (pricing?.discount || 0)) {
      const unitsNeeded = nextTier.minQty - config.quantity;
      return `Order ${unitsNeeded} more to save ${nextTier.discount}%`;
    }
    return null;
  };

  // ---------------------------------------------------------------------------
  // LOADING & ERROR STATES
  // ---------------------------------------------------------------------------
  if (isLoading) {
    return (
      <div className="container flex items-center justify-center py-24">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="container py-24 text-center">
        <h1 className="text-2xl font-bold">Product Not Found</h1>
        <p className="mt-2 text-muted-foreground">The product you're looking for doesn't exist.</p>
      </div>
    );
  }

  // ---------------------------------------------------------------------------
  // HANDLERS
  // ---------------------------------------------------------------------------
  const handleSizeChange = (sizeId) => {
    setConfig((prev) => ({ ...prev, sizeId }));
  };

  const handleMaterialChange = (materialId) => {
    setConfig((prev) => ({ ...prev, materialId }));
  };

  const handleLeadTimeChange = (leadTimeId) => {
    setConfig((prev) => ({ ...prev, leadTimeId }));
  };

  const handleFinishingToggle = (finishingId) => {
    setConfig((prev) => ({
      ...prev,
      finishingIds: prev.finishingIds.includes(finishingId)
        ? prev.finishingIds.filter((id) => id !== finishingId)
        : [...prev.finishingIds, finishingId],
    }));
  };

  const handleQuantityChange = (delta) => {
    setConfig((prev) => ({
      ...prev,
      quantity: Math.max(1, Math.min(1000, prev.quantity + delta)),
    }));
  };

  const handleQuantityInput = (e) => {
    const value = parseInt(e.target.value, 10);
    if (!isNaN(value) && value >= 1 && value <= 1000) {
      setConfig((prev) => ({ ...prev, quantity: value }));
    }
  };

  const handleAddToCart = () => {
    // TODO: Integrate with cart state/API
    alert('Added to cart! (Integration pending)');
  };

  // ---------------------------------------------------------------------------
  // COMPUTED VALUES FOR DISPLAY
  // ---------------------------------------------------------------------------
  const addOns = [];
  if (proofOption === 'proof') {
    addOns.push({ name: 'Design proof', price: 10 });
  }
  config.finishingIds.forEach((id) => {
    const finishing = (product.finishings || []).find((f) => f.id === id);
    if (finishing && finishing.price > 0) {
      addOns.push({ name: finishing.label, price: finishing.price * config.quantity });
    }
  });

  const subtotal = pricing ? pricing.unitPrice * config.quantity : 0;
  const addOnsTotal = addOns.reduce((sum, a) => sum + a.price, 0);
  const rushFee = pricing?.rushFee || 0;
  const total = subtotal + addOnsTotal + rushFee;

  // ---------------------------------------------------------------------------
  // RENDER
  // ---------------------------------------------------------------------------
  return (
    <>
      <div className="container py-6 md:py-10">
        <div className="grid gap-8 lg:grid-cols-12 lg:gap-12">
          {/* ================================================================
              LEFT COLUMN - Gallery & Trust (Desktop: 5 cols)
              ================================================================ */}
          <div className="lg:col-span-5">
            {/* Main Image */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setLightboxOpen(true)}
                className="aspect-[4/3] w-full overflow-hidden rounded-xl bg-muted focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                aria-label="Open image gallery"
              >
                <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-primary/10 to-primary/5">
                  <div className="text-center p-6">
                    <div className="mx-auto mb-3 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                      <Printer className="h-8 w-8 text-primary" aria-hidden="true" />
                    </div>
                    <p className="font-medium text-muted-foreground">
                      {galleryImages[activeImageIndex].label}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {galleryImages[activeImageIndex].description}
                    </p>
                  </div>
                </div>
              </button>
            </div>

            {/* Thumbnail Gallery */}
            <div className="mt-3 grid grid-cols-4 gap-2">
              {galleryImages.map((img, index) => (
                <button
                  key={img.id}
                  type="button"
                  onClick={() => setActiveImageIndex(index)}
                  className={`aspect-square overflow-hidden rounded-lg bg-muted transition-all focus:outline-none focus:ring-2 focus:ring-primary ${
                    activeImageIndex === index
                      ? 'ring-2 ring-primary'
                      : 'hover:ring-2 hover:ring-primary/50'
                  }`}
                  aria-label={`View ${img.label}`}
                  aria-current={activeImageIndex === index ? 'true' : undefined}
                >
                  <div className="flex h-full items-center justify-center text-xs text-muted-foreground">
                    {img.label}
                  </div>
                </button>
              ))}
            </div>

            {/* Trust Badges */}
            <div className="mt-6 flex flex-wrap gap-2">
              <Badge variant="canada" className="gap-1.5">
                <MapPin className="h-3 w-3" aria-hidden="true" />
                Printed in Canada
              </Badge>
              <Badge variant="secondary" className="gap-1.5">
                <Printer className="h-3 w-3" aria-hidden="true" />
                Commercial-grade equipment
              </Badge>
              <Badge variant="secondary" className="gap-1.5">
                <Zap className="h-3 w-3" aria-hidden="true" />
                Fast turnaround
              </Badge>
            </div>

            {/* Reassurance Accordion (Desktop only - below gallery) */}
            <div className="mt-8 hidden lg:block">
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="materials">
                  <AccordionTrigger>Material & Durability</AccordionTrigger>
                  <AccordionContent>
                    <ul className="space-y-2 text-sm text-muted-foreground">
                      <li>• High-resolution digital printing (1440 DPI)</li>
                      <li>• UV-resistant inks for outdoor durability</li>
                      <li>• Vinyl rated for 2+ years outdoor use</li>
                      <li>• Waterproof and fade-resistant</li>
                    </ul>
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="shipping">
                  <AccordionTrigger>Shipping & Timelines</AccordionTrigger>
                  <AccordionContent>
                    <ul className="space-y-2 text-sm text-muted-foreground">
                      <li>• Ships from Ontario, Canada</li>
                      <li>• Free shipping on orders over $200</li>
                      <li>• Local pickup available in Toronto</li>
                      <li>• Tracking provided for all orders</li>
                      <li>• Canada-wide delivery only</li>
                    </ul>
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="guarantee">
                  <AccordionTrigger>Reprints & Quality Guarantee</AccordionTrigger>
                  <AccordionContent>
                    <ul className="space-y-2 text-sm text-muted-foreground">
                      <li>• 100% satisfaction guarantee</li>
                      <li>• Free reprints for any printing errors</li>
                      <li>• Quality inspection before shipping</li>
                      <li>• Responsive customer support</li>
                    </ul>
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="faq">
                  <AccordionTrigger>FAQs</AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-4 text-sm">
                      <div>
                        <p className="font-medium">What file formats do you accept?</p>
                        <p className="text-muted-foreground">
                          PDF, AI, EPS, JPG, PNG, TIFF at 150+ DPI.
                        </p>
                      </div>
                      <div>
                        <p className="font-medium">Can I get a proof before printing?</p>
                        <p className="text-muted-foreground">
                          Yes! Select "Request proof" during checkout (+$10, adds 1 day).
                        </p>
                      </div>
                      <div>
                        <p className="font-medium">Do you ship outside Canada?</p>
                        <p className="text-muted-foreground">
                          Currently we only ship within Canada.
                        </p>
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>
          </div>

          {/* ================================================================
              RIGHT COLUMN - Configurator (Desktop: 7 cols)
              ================================================================ */}
          <div className="lg:col-span-7">
            <div className="lg:grid lg:grid-cols-12 lg:gap-8">
              {/* Configurator Form */}
              <div className="lg:col-span-7">
                {/* Section 1: Product Intro */}
                <div className="mb-6">
                  <h1 className="text-2xl font-bold md:text-3xl">
                    {product.title || product.name}
                  </h1>
                  <p className="mt-2 text-muted-foreground">
                    Durable vinyl banners printed in Canada for indoor and outdoor use.
                  </p>
                </div>

                <Separator className="mb-6" />

                {/* Section 2: Size Selection */}
                <div className="mb-6">
                  <Label className="mb-3 block text-base font-semibold">Size</Label>
                  <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                    {(product.sizes || []).map((size) => (
                      <button
                        key={size.id}
                        type="button"
                        onClick={() => handleSizeChange(size.id)}
                        disabled={size.id === 'custom'}
                        className={`relative rounded-lg border p-3 text-center transition-all focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 ${
                          config.sizeId === size.id
                            ? 'border-primary bg-primary/5 ring-1 ring-primary'
                            : 'border-border hover:border-primary/50'
                        } ${size.id === 'custom' ? 'cursor-not-allowed opacity-50' : ''}`}
                        aria-pressed={config.sizeId === size.id}
                      >
                        <span className="block font-medium">{size.label}</span>
                        {size.price && (
                          <span className="block text-sm text-muted-foreground">
                            {formatCurrency(size.price)}
                          </span>
                        )}
                        {size.id === 'custom' && (
                          <span className="block text-xs text-muted-foreground">Coming soon</span>
                        )}
                      </button>
                    ))}
                  </div>
                  <p className="mt-2 text-sm text-muted-foreground">
                    <Info className="mr-1 inline h-3 w-3" aria-hidden="true" />
                    Not sure? 3×6 is the most popular for events.
                  </p>
                </div>

                {/* Section 3: Material Selection */}
                <div className="mb-6">
                  <Label className="mb-3 block text-base font-semibold">Material</Label>
                  <div className="space-y-2">
                    {(product.materials || []).map((material) => {
                      const helper = materialHelpers[material.id] || {};
                      return (
                        <button
                          key={material.id}
                          type="button"
                          onClick={() => handleMaterialChange(material.id)}
                          className={`flex w-full items-start gap-3 rounded-lg border p-4 text-left transition-all focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 ${
                            config.materialId === material.id
                              ? 'border-primary bg-primary/5 ring-1 ring-primary'
                              : 'border-border hover:border-primary/50'
                          }`}
                          aria-pressed={config.materialId === material.id}
                        >
                          <div
                            className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 transition-colors ${
                              config.materialId === material.id
                                ? 'border-primary bg-primary'
                                : 'border-muted-foreground'
                            }`}
                            aria-hidden="true"
                          >
                            {config.materialId === material.id && (
                              <Check className="h-3 w-3 text-primary-foreground" />
                            )}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <span className="font-medium">{material.label}</span>
                              {helper.badge && (
                                <Badge variant="outline" className="text-xs">
                                  {helper.badge}
                                </Badge>
                              )}
                            </div>
                            {helper.bestFor && (
                              <p className="mt-1 text-sm text-muted-foreground">{helper.bestFor}</p>
                            )}
                          </div>
                          <span className="shrink-0 text-sm font-medium">
                            {material.price > 0
                              ? `+${formatCurrency(material.price)}`
                              : material.price < 0
                                ? `-${formatCurrency(Math.abs(material.price))}`
                                : 'Included'}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Section 4: Finishing Options */}
                {(product.finishings || []).length > 0 && (
                  <div className="mb-6">
                    <Label className="mb-3 block text-base font-semibold">Finishing Options</Label>
                    <div className="grid gap-2 sm:grid-cols-2">
                      {(product.finishings || []).map((finishing) => (
                        <button
                          key={finishing.id}
                          type="button"
                          onClick={() => handleFinishingToggle(finishing.id)}
                          className={`flex items-center gap-3 rounded-lg border p-3 text-left transition-all focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 ${
                            config.finishingIds.includes(finishing.id)
                              ? 'border-primary bg-primary/5'
                              : 'border-border hover:border-primary/50'
                          }`}
                          aria-pressed={config.finishingIds.includes(finishing.id)}
                        >
                          <div
                            className={`flex h-5 w-5 shrink-0 items-center justify-center rounded border-2 transition-colors ${
                              config.finishingIds.includes(finishing.id)
                                ? 'border-primary bg-primary'
                                : 'border-muted-foreground'
                            }`}
                            aria-hidden="true"
                          >
                            {config.finishingIds.includes(finishing.id) && (
                              <Check className="h-3 w-3 text-primary-foreground" />
                            )}
                          </div>
                          <div className="flex-1">
                            <span className="font-medium">{finishing.label}</span>
                            {finishing.description && (
                              <p className="text-xs text-muted-foreground">
                                {finishing.description}
                              </p>
                            )}
                          </div>
                          <span className="shrink-0 text-sm text-muted-foreground">
                            {finishing.price > 0
                              ? `+${formatCurrency(finishing.price)}`
                              : 'Included'}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Section 5: Quantity */}
                <div className="mb-6">
                  <Label className="mb-3 block text-base font-semibold">Quantity</Label>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center rounded-lg border">
                      <button
                        type="button"
                        onClick={() => handleQuantityChange(-1)}
                        disabled={config.quantity <= 1}
                        className="flex h-11 w-11 items-center justify-center rounded-l-lg transition-colors hover:bg-muted focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary disabled:cursor-not-allowed disabled:opacity-50"
                        aria-label="Decrease quantity"
                      >
                        <Minus className="h-4 w-4" aria-hidden="true" />
                      </button>
                      <input
                        type="number"
                        min="1"
                        max="1000"
                        value={config.quantity}
                        onChange={handleQuantityInput}
                        className="h-11 w-16 border-x bg-transparent text-center text-lg font-semibold focus:outline-none"
                        aria-label="Quantity"
                      />
                      <button
                        type="button"
                        onClick={() => handleQuantityChange(1)}
                        disabled={config.quantity >= 1000}
                        className="flex h-11 w-11 items-center justify-center rounded-r-lg transition-colors hover:bg-muted focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary disabled:cursor-not-allowed disabled:opacity-50"
                        aria-label="Increase quantity"
                      >
                        <Plus className="h-4 w-4" aria-hidden="true" />
                      </button>
                    </div>
                    <div className="flex-1">
                      {pricing && pricing.discount > 0 && (
                        <p className="text-sm font-medium text-green-600">
                          {pricing.discount}% volume discount applied!
                        </p>
                      )}
                      {getTierHint() && (
                        <p className="text-sm text-muted-foreground">{getTierHint()}</p>
                      )}
                    </div>
                  </div>
                  <p className="mt-2 text-sm text-muted-foreground">
                    Save more when ordering multiples. Need 100+?{' '}
                    <a href="/bulk" className="text-primary hover:underline">
                      Get bulk pricing
                    </a>
                  </p>
                </div>

                {/* Section 6: Turnaround Time */}
                <div className="mb-6">
                  <Label className="mb-3 block text-base font-semibold">Turnaround Time</Label>
                  <div className="space-y-2">
                    {(product.lead_times || []).map((leadTime) => {
                      const isRush = leadTime.id === 'rush' || leadTime.id === 'same-day';
                      return (
                        <button
                          key={leadTime.id}
                          type="button"
                          onClick={() => handleLeadTimeChange(leadTime.id)}
                          className={`flex w-full items-center justify-between rounded-lg border p-4 text-left transition-all focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 ${
                            config.leadTimeId === leadTime.id
                              ? 'border-primary bg-primary/5 ring-1 ring-primary'
                              : 'border-border hover:border-primary/50'
                          }`}
                          aria-pressed={config.leadTimeId === leadTime.id}
                        >
                          <div className="flex items-center gap-3">
                            <div
                              className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 transition-colors ${
                                config.leadTimeId === leadTime.id
                                  ? 'border-primary bg-primary'
                                  : 'border-muted-foreground'
                              }`}
                              aria-hidden="true"
                            >
                              {config.leadTimeId === leadTime.id && (
                                <Check className="h-3 w-3 text-primary-foreground" />
                              )}
                            </div>
                            <div>
                              <div className="flex items-center gap-2">
                                <span className="font-medium">{leadTime.label}</span>
                                {isRush && (
                                  <Badge
                                    variant="outline"
                                    className="text-xs text-orange-600 border-orange-300"
                                  >
                                    Rush
                                  </Badge>
                                )}
                              </div>
                              <p className="text-sm text-muted-foreground">
                                Ships by {getEstimatedDate(leadTime.id)}
                              </p>
                            </div>
                          </div>
                          <span
                            className={`shrink-0 font-medium ${isRush ? 'text-orange-600' : ''}`}
                          >
                            {leadTime.price > 0 ? `+${formatCurrency(leadTime.price)}` : 'Included'}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                  <p className="mt-2 text-sm text-muted-foreground">
                    <Zap className="mr-1 inline h-3 w-3" aria-hidden="true" />
                    Rush orders move to the front of the production queue.
                  </p>
                </div>

                <Separator className="mb-6" />

                {/* Artwork Upload */}
                <div className="mb-6">
                  <Label className="mb-3 block text-base font-semibold">Upload Your Artwork</Label>
                  <FileUpload onFilesChange={setFiles} maxFiles={3} />

                  {/* Proof Options */}
                  <div className="mt-4 space-y-2">
                    <button
                      type="button"
                      onClick={() => setProofOption('print')}
                      className={`flex w-full items-center gap-3 rounded-lg border p-3 text-left transition-all focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 ${
                        proofOption === 'print'
                          ? 'border-primary bg-primary/5'
                          : 'border-border hover:border-primary/50'
                      }`}
                      aria-pressed={proofOption === 'print'}
                    >
                      <div
                        className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 transition-colors ${
                          proofOption === 'print'
                            ? 'border-primary bg-primary'
                            : 'border-muted-foreground'
                        }`}
                        aria-hidden="true"
                      >
                        {proofOption === 'print' && (
                          <Check className="h-3 w-3 text-primary-foreground" />
                        )}
                      </div>
                      <div>
                        <span className="font-medium">Print as uploaded</span>
                        <p className="text-sm text-muted-foreground">
                          We'll check your file and print it
                        </p>
                      </div>
                    </button>
                    <button
                      type="button"
                      onClick={() => setProofOption('proof')}
                      className={`flex w-full items-center gap-3 rounded-lg border p-3 text-left transition-all focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 ${
                        proofOption === 'proof'
                          ? 'border-primary bg-primary/5'
                          : 'border-border hover:border-primary/50'
                      }`}
                      aria-pressed={proofOption === 'proof'}
                    >
                      <div
                        className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 transition-colors ${
                          proofOption === 'proof'
                            ? 'border-primary bg-primary'
                            : 'border-muted-foreground'
                        }`}
                        aria-hidden="true"
                      >
                        {proofOption === 'proof' && (
                          <Check className="h-3 w-3 text-primary-foreground" />
                        )}
                      </div>
                      <div className="flex-1">
                        <span className="font-medium">Request proof before printing</span>
                        <p className="text-sm text-muted-foreground">
                          We'll email a proof for approval (+1 day)
                        </p>
                      </div>
                      <span className="shrink-0 text-sm font-medium">+$10</span>
                    </button>
                  </div>
                  <p className="mt-3 text-sm text-muted-foreground">
                    <Shield className="mr-1 inline h-3 w-3" aria-hidden="true" />
                    Don't worry — we check every file before printing.
                  </p>
                </div>
              </div>

              {/* ================================================================
                  STICKY PRICE SUMMARY (Desktop)
                  ================================================================ */}
              <div className="hidden lg:col-span-5 lg:block">
                <div className="sticky top-24">
                  <Card className="shadow-lg">
                    <CardContent className="p-6">
                      <h3 className="mb-4 font-heading text-lg font-semibold">Order Summary</h3>

                      <div className="space-y-3 text-sm">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Size</span>
                          <span className="font-medium">{selectedSize?.label || '—'}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Quantity</span>
                          <span className="font-medium">×{config.quantity}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Turnaround</span>
                          <span className="font-medium">{selectedLeadTime?.label || '—'}</span>
                        </div>

                        <Separator />

                        {pricing && (
                          <>
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">Unit price</span>
                              <span>{formatCurrency(pricing.unitPrice)}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">Subtotal</span>
                              <span>{formatCurrency(subtotal)}</span>
                            </div>
                          </>
                        )}

                        {addOns.length > 0 && (
                          <>
                            {addOns.map((addon) => (
                              <div key={addon.name} className="flex justify-between">
                                <span className="text-muted-foreground">{addon.name}</span>
                                <span>+{formatCurrency(addon.price)}</span>
                              </div>
                            ))}
                          </>
                        )}

                        {rushFee > 0 && (
                          <div className="flex justify-between text-orange-600">
                            <span>Rush processing</span>
                            <span>+{formatCurrency(rushFee)}</span>
                          </div>
                        )}

                        <Separator />

                        <div className="flex justify-between text-lg font-bold">
                          <span>Total</span>
                          <span className="text-primary">{formatCurrency(total)}</span>
                        </div>
                      </div>

                      {/* Estimated Delivery */}
                      <div className="mt-4 rounded-lg bg-muted/50 p-3">
                        <div className="flex items-center gap-2 text-sm">
                          <Clock className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
                          <span>
                            Estimated delivery:{' '}
                            <strong>{getEstimatedDate(config.leadTimeId)}</strong>
                          </span>
                        </div>
                      </div>

                      {/* Add to Cart Button */}
                      <Button
                        size="lg"
                        className="mt-4 w-full"
                        disabled={!isValid}
                        onClick={handleAddToCart}
                      >
                        {isValid ? 'Add to Cart' : 'Upload Artwork to Continue'}
                      </Button>

                      {/* Trust Badges */}
                      <div className="mt-4 flex flex-wrap justify-center gap-2">
                        <Badge variant="outline" className="gap-1 text-xs">
                          <Truck className="h-3 w-3" aria-hidden="true" />
                          Free shipping $200+
                        </Badge>
                        <Badge variant="canada" className="gap-1 text-xs">
                          <MapPin className="h-3 w-3" aria-hidden="true" />
                          Made in Canada
                        </Badge>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>

            {/* Reassurance Accordion (Mobile only) */}
            <div className="mt-8 lg:hidden">
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="materials">
                  <AccordionTrigger>Material & Durability</AccordionTrigger>
                  <AccordionContent>
                    <ul className="space-y-2 text-sm text-muted-foreground">
                      <li>• High-resolution digital printing (1440 DPI)</li>
                      <li>• UV-resistant inks for outdoor durability</li>
                      <li>• Vinyl rated for 2+ years outdoor use</li>
                      <li>• Waterproof and fade-resistant</li>
                    </ul>
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="shipping">
                  <AccordionTrigger>Shipping & Timelines</AccordionTrigger>
                  <AccordionContent>
                    <ul className="space-y-2 text-sm text-muted-foreground">
                      <li>• Ships from Ontario, Canada</li>
                      <li>• Free shipping on orders over $200</li>
                      <li>• Local pickup available in Toronto</li>
                      <li>• Tracking provided for all orders</li>
                      <li>• Canada-wide delivery only</li>
                    </ul>
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="guarantee">
                  <AccordionTrigger>Reprints & Quality Guarantee</AccordionTrigger>
                  <AccordionContent>
                    <ul className="space-y-2 text-sm text-muted-foreground">
                      <li>• 100% satisfaction guarantee</li>
                      <li>• Free reprints for any printing errors</li>
                      <li>• Quality inspection before shipping</li>
                      <li>• Responsive customer support</li>
                    </ul>
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="faq">
                  <AccordionTrigger>FAQs</AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-4 text-sm">
                      <div>
                        <p className="font-medium">What file formats do you accept?</p>
                        <p className="text-muted-foreground">
                          PDF, AI, EPS, JPG, PNG, TIFF at 150+ DPI.
                        </p>
                      </div>
                      <div>
                        <p className="font-medium">Can I get a proof before printing?</p>
                        <p className="text-muted-foreground">
                          Yes! Select "Request proof" during checkout (+$10, adds 1 day).
                        </p>
                      </div>
                      <div>
                        <p className="font-medium">Do you ship outside Canada?</p>
                        <p className="text-muted-foreground">
                          Currently we only ship within Canada.
                        </p>
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>
          </div>
        </div>
      </div>

      {/* ====================================================================
          MOBILE STICKY BOTTOM BAR
          ==================================================================== */}
      <div className="fixed inset-x-0 bottom-0 z-50 border-t bg-background p-4 shadow-lg lg:hidden">
        <div className="container flex items-center justify-between gap-4">
          <div>
            <p className="text-sm text-muted-foreground">Total</p>
            <p className="text-xl font-bold text-primary">{formatCurrency(total)}</p>
          </div>
          <Button
            size="lg"
            disabled={!isValid}
            onClick={handleAddToCart}
            className="flex-1 max-w-[200px]"
          >
            {isValid ? 'Add to Cart' : 'Upload Artwork'}
          </Button>
        </div>
      </div>

      {/* Add padding at bottom for mobile sticky bar */}
      <div className="h-24 lg:hidden" aria-hidden="true" />

      {/* ====================================================================
          LIGHTBOX (Simple implementation)
          ==================================================================== */}
      {lightboxOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4"
          role="dialog"
          aria-modal="true"
          aria-label="Image gallery"
        >
          <button
            type="button"
            onClick={() => setLightboxOpen(false)}
            className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-white"
            aria-label="Close gallery"
          >
            <X className="h-6 w-6" />
          </button>

          <button
            type="button"
            onClick={() =>
              setActiveImageIndex((prev) => (prev === 0 ? galleryImages.length - 1 : prev - 1))
            }
            className="absolute left-4 flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-white"
            aria-label="Previous image"
          >
            <ChevronLeft className="h-6 w-6" />
          </button>

          <div className="max-h-[80vh] max-w-4xl overflow-hidden rounded-lg bg-muted">
            <div className="flex aspect-[4/3] items-center justify-center p-12">
              <div className="text-center text-white">
                <p className="text-xl font-medium">{galleryImages[activeImageIndex].label}</p>
                <p className="text-muted-foreground">
                  {galleryImages[activeImageIndex].description}
                </p>
                <p className="mt-4 text-sm text-muted-foreground">
                  {activeImageIndex + 1} / {galleryImages.length}
                </p>
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={() =>
              setActiveImageIndex((prev) => (prev === galleryImages.length - 1 ? 0 : prev + 1))
            }
            className="absolute right-4 flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-white"
            style={{ right: '4rem' }}
            aria-label="Next image"
          >
            <ChevronRight className="h-6 w-6" />
          </button>
        </div>
      )}
    </>
  );
}
