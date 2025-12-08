// Mock product data for development
export const products = [
  {
    id: '1',
    slug: 'pvc-banner-3x6',
    title: 'PVC Banner 3×6 ft',
    description: 'Durable, weather-resistant PVC banner ideal for events, trade shows, storefronts, and outdoor advertising. Waterproof and UV-resistant for long-lasting vibrant colors.',
    image: null, // Placeholder - no image file yet
    specs: '3×6 ft • 13oz PVC',
    priceFrom: 49.99,
    badges: ['Made in Canada', 'Best Seller'],
    category: 'pvc-banners',
    sizes: [
      { id: '3x6', label: '3×6 ft', price: 49.99 },
      { id: '4x8', label: '4×8 ft', price: 79.99 },
      { id: '4x10', label: '4×10 ft', price: 99.99 },
      { id: '5x10', label: '5×10 ft', price: 129.99 },
      { id: 'custom', label: 'Custom Size', price: null },
    ],
    materials: [
      { id: '13oz', label: '13oz PVC (Standard)', price: 0, description: 'Durable, waterproof, UV-resistant for indoor/outdoor use' },
      { id: '18oz', label: '18oz PVC (Heavy Duty)', price: 15, description: 'Extra thick for long-term outdoor display' },
      { id: 'mesh', label: 'PVC Mesh (Wind-Resistant)', price: 10, description: 'Micro-perforated for high-wind areas' },
    ],
    finishings: [
      { id: 'hemmed', label: 'Hemmed Edges', price: 0, description: 'Standard reinforced edges' },
      { id: 'grommets', label: 'Grommets (Eyelets)', price: 0, description: 'Metal eyelets every 2ft for easy mounting' },
      { id: 'pole-pockets', label: 'Pole Pockets', price: 10, description: 'Sleeves for pole or rod mounting' },
      { id: 'wind-slits', label: 'Wind Slits', price: 5, description: 'Reduces wind resistance for outdoor use' },
    ],
    leadTimes: [
      { id: 'standard', label: 'Standard (5-7 days)', price: 0 },
      { id: 'rush', label: 'Rush (2-3 days)', price: 25 },
      { id: 'same-day', label: 'Same Day', price: 50 },
    ],
    tierPricing: [
      { minQty: 1, maxQty: 4, discount: 0 },
      { minQty: 5, maxQty: 9, discount: 10 },
      { minQty: 10, maxQty: 24, discount: 15 },
      { minQty: 25, maxQty: 49, discount: 20 },
      { minQty: 50, maxQty: null, discount: 25 },
    ],
  },
  {
    id: '2',
    slug: 'retractable-banner-stand',
    title: 'Retractable Banner Stand',
    description: 'Professional pull-up banner stand for trade shows and presentations.',
    image: null, // Placeholder - no image file yet
    specs: '33×80 in • Includes Stand',
    priceFrom: 89.99,
    badges: ['Made in Canada'],
    category: 'retractable-banners',
    sizes: [
      { id: '24x80', label: '24×80 in', price: 79.99 },
      { id: '33x80', label: '33×80 in', price: 89.99 },
      { id: '36x80', label: '36×80 in', price: 99.99 },
      { id: '47x80', label: '47×80 in', price: 129.99 },
    ],
    materials: [
      { id: 'premium', label: 'Premium Polyester', price: 0, description: 'Smooth, wrinkle-resistant' },
      { id: 'economy', label: 'Economy Vinyl', price: -10, description: 'Budget-friendly option' },
    ],
    finishings: [],
    leadTimes: [
      { id: 'standard', label: 'Standard (5-7 days)', price: 0 },
      { id: 'rush', label: 'Rush (2-3 days)', price: 30 },
    ],
    tierPricing: [
      { minQty: 1, maxQty: 4, discount: 0 },
      { minQty: 5, maxQty: 9, discount: 10 },
      { minQty: 10, maxQty: null, discount: 15 },
    ],
  },
  {
    id: '3',
    slug: 'pvc-mesh-banner-4x8',
    title: 'PVC Mesh Banner 4×8 ft',
    description: 'Micro-perforated PVC mesh banner (70% PVC, 30% air) for maximum wind resistance. Perfect for fences, scaffolding, and large outdoor displays.',
    image: null, // Placeholder - no image file yet
    specs: '4×8 ft • PVC Mesh',
    priceFrom: 69.99,
    badges: ['Made in Canada', 'Wind Resistant'],
    category: 'pvc-mesh-banners',
    sizes: [
      { id: '3x6', label: '3×6 ft', price: 49.99 },
      { id: '4x8', label: '4×8 ft', price: 69.99 },
      { id: '4x12', label: '4×12 ft', price: 99.99 },
      { id: 'custom', label: 'Custom Size', price: null },
    ],
    materials: [
      { id: '9oz', label: '9oz PVC Mesh', price: 0, description: 'Standard mesh with excellent airflow' },
      { id: '12oz', label: '12oz PVC Mesh (Heavy)', price: 15, description: 'Extra durability for long-term use' },
    ],
    finishings: [
      { id: 'hemmed', label: 'Hemmed Edges', price: 0, description: 'Reinforced edges for durability' },
      { id: 'grommets', label: 'Grommets (Eyelets)', price: 0, description: 'Metal eyelets for secure mounting' },
    ],
    leadTimes: [
      { id: 'standard', label: 'Standard (5-7 days)', price: 0 },
      { id: 'rush', label: 'Rush (2-3 days)', price: 25 },
    ],
    tierPricing: [
      { minQty: 1, maxQty: 4, discount: 0 },
      { minQty: 5, maxQty: 9, discount: 10 },
      { minQty: 10, maxQty: null, discount: 15 },
    ],
  },
  {
    id: '4',
    slug: 'fabric-banner-3x5',
    title: 'Fabric Banner 3×5 ft',
    description: 'Premium fabric banner with vibrant dye-sublimation printing.',
    image: null, // Placeholder - no image file yet
    specs: '3×5 ft • Polyester Fabric',
    priceFrom: 59.99,
    badges: ['Made in Canada', 'Premium'],
    category: 'fabric-banners',
    sizes: [
      { id: '2x4', label: '2×4 ft', price: 39.99 },
      { id: '3x5', label: '3×5 ft', price: 59.99 },
      { id: '4x6', label: '4×6 ft', price: 79.99 },
      { id: 'custom', label: 'Custom Size', price: null },
    ],
    materials: [
      { id: 'polyester', label: 'Polyester Fabric', price: 0, description: 'Vibrant colors, machine washable' },
      { id: 'canvas', label: 'Canvas', price: 20, description: 'Textured, premium look' },
    ],
    finishings: [
      { id: 'hemmed', label: 'Hemmed Edges', price: 0 },
      { id: 'pole-pockets', label: 'Pole Pockets', price: 10 },
    ],
    leadTimes: [
      { id: 'standard', label: 'Standard (5-7 days)', price: 0 },
      { id: 'rush', label: 'Rush (2-3 days)', price: 25 },
    ],
    tierPricing: [
      { minQty: 1, maxQty: 4, discount: 0 },
      { minQty: 5, maxQty: 9, discount: 10 },
      { minQty: 10, maxQty: null, discount: 15 },
    ],
  },
];

export const templates = [
  {
    id: '1',
    slug: 'grand-opening',
    title: 'Grand Opening',
    category: 'business',
    image: null, // Placeholder - no image file yet
    description: 'Announce your new business with style',
  },
  {
    id: '2',
    slug: 'sale-event',
    title: 'Sale Event',
    category: 'retail',
    image: null, // Placeholder - no image file yet
    description: 'Drive traffic with eye-catching sale banners',
  },
  {
    id: '3',
    slug: 'birthday-party',
    title: 'Birthday Party',
    category: 'events',
    image: null, // Placeholder - no image file yet
    description: 'Celebrate in style with custom birthday banners',
  },
  {
    id: '4',
    slug: 'trade-show',
    title: 'Trade Show',
    category: 'business',
    image: null, // Placeholder - no image file yet
    description: 'Professional banners for trade shows and conferences',
  },
  {
    id: '5',
    slug: 'sports-team',
    title: 'Sports Team',
    category: 'sports',
    image: null, // Placeholder - no image file yet
    description: 'Show team spirit with custom sports banners',
  },
  {
    id: '6',
    slug: 'real-estate',
    title: 'Real Estate',
    category: 'business',
    image: null, // Placeholder - no image file yet
    description: 'Open house and property listing banners',
  },
];

export const testimonials = [
  {
    id: '1',
    quote: 'The quality exceeded our expectations. Our trade show booth looked amazing!',
    author: 'Sarah M.',
    company: 'Tech Startup Inc.',
    rating: 5,
  },
  {
    id: '2',
    quote: 'Fast turnaround and excellent customer service. Will definitely order again.',
    author: 'Mike R.',
    company: 'Local Events Co.',
    rating: 5,
  },
  {
    id: '3',
    quote: 'We order banners for all our retail locations. Consistent quality every time.',
    author: 'Jennifer L.',
    company: 'Retail Chain Canada',
    rating: 5,
  },
];

export const pricingTiers = [
  {
    size: '2×4 ft',
    vinyl: 29.99,
    mesh: 34.99,
    fabric: 39.99,
  },
  {
    size: '3×6 ft',
    vinyl: 49.99,
    mesh: 54.99,
    fabric: 59.99,
  },
  {
    size: '4×8 ft',
    vinyl: 79.99,
    mesh: 84.99,
    fabric: 89.99,
  },
  {
    size: '4×10 ft',
    vinyl: 99.99,
    mesh: 109.99,
    fabric: 119.99,
  },
  {
    size: '5×10 ft',
    vinyl: 129.99,
    mesh: 139.99,
    fabric: 149.99,
  },
];

export const getProductBySlug = (slug) => {
  return products.find((p) => p.slug === slug) || null;
};

export const getProductsByCategory = (category) => {
  return products.filter((p) => p.category === category);
};

export const calculatePrice = (product, options) => {
  const { sizeId, materialId, finishingIds = [], leadTimeId, quantity } = options;

  const size = product.sizes.find((s) => s.id === sizeId);
  const material = product.materials.find((m) => m.id === materialId);
  const leadTime = product.leadTimes.find((l) => l.id === leadTimeId);
  const finishings = product.finishings.filter((f) => finishingIds.includes(f.id));

  if (!size || !material || !leadTime) return null;

  let basePrice = size.price || 0;
  basePrice += material.price || 0;
  basePrice += finishings.reduce((sum, f) => sum + (f.price || 0), 0);

  // Apply tier discount
  const tier = product.tierPricing.find(
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
};
