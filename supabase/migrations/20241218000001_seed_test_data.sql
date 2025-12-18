-- ============================================================================
-- SEED TEST DATA MIGRATION
-- This migration populates all tables with realistic test data for development
-- ============================================================================

-- ============================================================================
-- CATEGORIES
-- ============================================================================
INSERT INTO categories (id, name, slug, description, image_url, parent_id, sort_order, is_active, product_count) VALUES
  ('c1000000-0000-4000-a000-000000000001', 'PVC Banners', 'pvc-banners', 'Durable, weather-resistant PVC banners for indoor and outdoor use. Waterproof and UV-resistant.', '/images/categories/pvc-banners.jpg', NULL, 1, true, 3),
  ('c1000000-0000-4000-a000-000000000002', 'Mesh Banners', 'mesh-banners', 'Wind-resistant mesh banners perfect for fences, scaffolding, and outdoor displays.', '/images/categories/mesh-banners.jpg', NULL, 2, true, 2),
  ('c1000000-0000-4000-a000-000000000003', 'Fabric Banners', 'fabric-banners', 'Premium fabric banners with vibrant dye-sublimation printing.', '/images/categories/fabric-banners.jpg', NULL, 3, true, 2),
  ('c1000000-0000-4000-a000-000000000004', 'Retractable Banners', 'retractable-banners', 'Professional pull-up banner stands for trade shows and presentations.', '/images/categories/retractable-banners.jpg', NULL, 4, true, 2),
  ('c1000000-0000-4000-a000-000000000005', 'Yard Signs', 'yard-signs', 'Corrugated plastic yard signs for real estate, events, and promotions.', '/images/categories/yard-signs.jpg', NULL, 5, true, 1)
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  sort_order = EXCLUDED.sort_order,
  product_count = EXCLUDED.product_count;

-- ============================================================================
-- LEAD TIMES (Global lead time options)
-- ============================================================================
INSERT INTO lead_times (id, name, label, days, price_modifier, is_default, is_active, sort_order) VALUES
  ('a0000000-0000-4000-a000-000000000001', 'standard', 'Standard (5-7 business days)', 7, 0, true, true, 1),
  ('a0000000-0000-4000-a000-000000000002', 'rush', 'Rush (2-3 business days)', 3, 25, false, true, 2),
  ('a0000000-0000-4000-a000-000000000003', 'same-day', 'Same Day (order by 10am)', 1, 50, false, true, 3)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  label = EXCLUDED.label,
  days = EXCLUDED.days,
  price_modifier = EXCLUDED.price_modifier;

-- ============================================================================
-- SHIPPING ZONES
-- ============================================================================
INSERT INTO shipping_zones (id, name, countries, provinces, is_active) VALUES
  ('b0000000-0000-4000-a000-000000000001', 'Ontario', '["CA"]', '["ON"]', true),
  ('b0000000-0000-4000-a000-000000000002', 'Quebec', '["CA"]', '["QC"]', true),
  ('b0000000-0000-4000-a000-000000000003', 'Western Canada', '["CA"]', '["BC", "AB", "SK", "MB"]', true),
  ('b0000000-0000-4000-a000-000000000004', 'Atlantic Canada', '["CA"]', '["NB", "NS", "PE", "NL"]', true),
  ('b0000000-0000-4000-a000-000000000005', 'Northern Canada', '["CA"]', '["YT", "NT", "NU"]', true)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  provinces = EXCLUDED.provinces;

-- ============================================================================
-- SHIPPING RATES
-- ============================================================================
INSERT INTO shipping_rates (id, zone_id, name, description, min_weight, max_weight, min_order_value, max_order_value, base_rate, per_kg_rate, estimated_days_min, estimated_days_max, is_active) VALUES
  ('c0000000-0000-4000-a000-000000000001', 'b0000000-0000-4000-a000-000000000001', 'Standard Shipping', 'Regular ground shipping', 0, 50, 0, 199.99, 12.99, 0.50, 3, 5, true),
  ('c0000000-0000-4000-a000-000000000002', 'b0000000-0000-4000-a000-000000000001', 'Free Shipping', 'Free shipping on orders over $200', 0, 50, 200, NULL, 0, 0, 3, 5, true),
  ('c0000000-0000-4000-a000-000000000003', 'b0000000-0000-4000-a000-000000000001', 'Express Shipping', 'Next business day delivery', 0, 30, 0, NULL, 24.99, 1.00, 1, 2, true),
  ('c0000000-0000-4000-a000-000000000004', 'b0000000-0000-4000-a000-000000000002', 'Standard Shipping', 'Regular ground shipping to Quebec', 0, 50, 0, 199.99, 14.99, 0.60, 4, 6, true),
  ('c0000000-0000-4000-a000-000000000005', 'b0000000-0000-4000-a000-000000000002', 'Free Shipping', 'Free shipping on orders over $200', 0, 50, 200, NULL, 0, 0, 4, 6, true),
  ('c0000000-0000-4000-a000-000000000006', 'b0000000-0000-4000-a000-000000000003', 'Standard Shipping', 'Ground shipping to Western Canada', 0, 50, 0, 249.99, 19.99, 0.75, 5, 8, true),
  ('c0000000-0000-4000-a000-000000000007', 'b0000000-0000-4000-a000-000000000003', 'Free Shipping', 'Free shipping on orders over $250', 0, 50, 250, NULL, 0, 0, 5, 8, true),
  ('c0000000-0000-4000-a000-000000000008', 'b0000000-0000-4000-a000-000000000004', 'Standard Shipping', 'Ground shipping to Atlantic Canada', 0, 50, 0, 199.99, 17.99, 0.70, 5, 7, true),
  ('c0000000-0000-4000-a000-000000000009', 'b0000000-0000-4000-a000-000000000005', 'Northern Shipping', 'Shipping to Northern territories', 0, 30, 0, NULL, 39.99, 2.00, 7, 14, true)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  base_rate = EXCLUDED.base_rate;

-- ============================================================================
-- SETTINGS (Site-wide configuration)
-- ============================================================================
INSERT INTO settings (id, key, value, description) VALUES
  ('d0000000-0000-4000-a000-000000000001', 'site_name', '"Banner Direct"', 'The name of the website'),
  ('d0000000-0000-4000-a000-000000000002', 'site_tagline', '"Your banner, your way"', 'Site tagline/slogan'),
  ('d0000000-0000-4000-a000-000000000003', 'site_description', '"Custom banners printed on commercial equipment. Fast turnaround, durable materials, and shipped across Canada."', 'Default meta description'),
  ('d0000000-0000-4000-a000-000000000004', 'contact_email', '"hello@bannerdirect.ca"', 'Primary contact email'),
  ('d0000000-0000-4000-a000-000000000005', 'contact_phone', '"1-800-555-0123"', 'Primary contact phone'),
  ('d0000000-0000-4000-a000-000000000006', 'business_address', '{"street": "123 Print Street", "city": "Toronto", "province": "ON", "postal_code": "M5V 1A1", "country": "Canada"}', 'Business address'),
  ('d0000000-0000-4000-a000-000000000007', 'social_links', '{"facebook": "https://facebook.com/bannerdirect", "instagram": "https://instagram.com/bannerdirect", "twitter": "https://twitter.com/bannerdirect", "linkedin": "https://linkedin.com/company/bannerdirect"}', 'Social media links'),
  ('d0000000-0000-4000-a000-000000000008', 'free_shipping_threshold', '200', 'Order amount for free shipping (CAD)'),
  ('d0000000-0000-4000-a000-000000000009', 'tax_rate', '0.13', 'Default tax rate (Ontario HST)'),
  ('d0000000-0000-4000-a000-000000000010', 'currency', '"CAD"', 'Default currency'),
  ('d0000000-0000-4000-a000-000000000011', 'business_hours', '{"monday": "9:00 AM - 5:00 PM", "tuesday": "9:00 AM - 5:00 PM", "wednesday": "9:00 AM - 5:00 PM", "thursday": "9:00 AM - 5:00 PM", "friday": "9:00 AM - 5:00 PM", "saturday": "Closed", "sunday": "Closed"}', 'Business hours'),
  ('d0000000-0000-4000-a000-000000000012', 'hero_content', '{"title": "Your banner, your way", "subtitle": "Custom banners printed on commercial equipment. Fast turnaround, durable materials, and shipped across Canada.", "cta_primary": {"text": "Start Creating →", "href": "/products"}, "cta_secondary": {"text": "Get Bulk Pricing", "href": "/bulk"}}', 'Homepage hero content'),
  ('d0000000-0000-4000-a000-000000000013', 'trust_badges', '[{"icon": "check", "text": "Free artwork review"}, {"icon": "check", "text": "Fast shipping"}, {"icon": "check", "text": "Quality guarantee"}]', 'Trust badges for hero section'),
  ('d0000000-0000-4000-a000-000000000014', 'features', '[{"icon": "MapPin", "title": "Made in Canada", "description": "All products printed locally in our Canadian facility"}, {"icon": "Truck", "title": "Fast Shipping", "description": "Standard, rush, and same-day options available"}, {"icon": "Shield", "title": "Quality Guarantee", "description": "100% satisfaction or we reprint for free"}]', 'Feature highlights'),
  ('d0000000-0000-4000-a000-000000000015', 'use_cases', '[{"icon": "PartyPopper", "title": "Events & Fundraisers", "description": "Birthdays, weddings, charity runs, and community events."}, {"icon": "Building2", "title": "Trade Shows", "description": "Professional displays that make your booth stand out."}, {"icon": "Store", "title": "Small Businesses", "description": "Storefronts, sales, grand openings, and promotions."}, {"icon": "Users", "title": "Corporate & Bulk Orders", "description": "Consistent branding across locations with volume pricing."}]', 'Use case examples'),
  ('d0000000-0000-4000-a000-000000000016', 'how_it_works', '[{"number": 1, "icon": "Package", "title": "Choose your banner", "description": "Pick a size and material that fits your needs."}, {"number": 2, "icon": "Upload", "title": "Upload artwork or start from a template", "description": "We accept most file formats and check every upload."}, {"number": 3, "icon": "Truck", "title": "We print & ship fast across Canada", "description": "Standard, rush, or same-day options available."}]', 'How it works steps')
ON CONFLICT (key) DO UPDATE SET
  value = EXCLUDED.value,
  description = EXCLUDED.description;

-- ============================================================================
-- TEMPLATES
-- ============================================================================
INSERT INTO templates (id, name, slug, description, category, thumbnail_url, template_url, is_active, is_featured, use_count) VALUES
  ('e0000000-0000-4000-a000-000000000001', 'Grand Opening Sale', 'grand-opening-sale', 'Eye-catching banner for store grand openings with customizable text and colors.', 'business', '/images/templates/grand-opening.jpg', '/templates/grand-opening.pdf', true, true, 245),
  ('e0000000-0000-4000-a000-000000000002', 'Birthday Party', 'birthday-party', 'Colorful birthday celebration banner with space for name and age.', 'events', '/images/templates/birthday.jpg', '/templates/birthday.pdf', true, true, 189),
  ('e0000000-0000-4000-a000-000000000003', 'Real Estate For Sale', 'real-estate-for-sale', 'Professional real estate listing banner with photo and contact info.', 'real-estate', '/images/templates/real-estate.jpg', '/templates/real-estate.pdf', true, true, 312),
  ('e0000000-0000-4000-a000-000000000004', 'Trade Show Booth', 'trade-show-booth', 'Professional trade show backdrop with company branding areas.', 'business', '/images/templates/trade-show.jpg', '/templates/trade-show.pdf', true, true, 156),
  ('e0000000-0000-4000-a000-000000000005', 'Wedding Welcome', 'wedding-welcome', 'Elegant wedding welcome sign with customizable names and date.', 'events', '/images/templates/wedding.jpg', '/templates/wedding.pdf', true, false, 98),
  ('e0000000-0000-4000-a000-000000000006', 'Sports Team', 'sports-team', 'Team spirit banner with space for team name, logo, and sponsors.', 'sports', '/images/templates/sports-team.jpg', '/templates/sports-team.pdf', true, false, 134),
  ('e0000000-0000-4000-a000-000000000007', 'Restaurant Menu', 'restaurant-menu', 'Large format menu board for restaurants and cafes.', 'business', '/images/templates/menu.jpg', '/templates/menu.pdf', true, false, 87),
  ('e0000000-0000-4000-a000-000000000008', 'Graduation Celebration', 'graduation-celebration', 'Congratulations banner for graduation parties.', 'events', '/images/templates/graduation.jpg', '/templates/graduation.pdf', true, false, 76),
  ('e0000000-0000-4000-a000-000000000009', 'Church Event', 'church-event', 'Clean, professional banner for church events and announcements.', 'community', '/images/templates/church.jpg', '/templates/church.pdf', true, false, 54),
  ('e0000000-0000-4000-a000-000000000010', 'Garage Sale', 'garage-sale', 'Simple, attention-grabbing garage sale sign.', 'community', '/images/templates/garage-sale.jpg', '/templates/garage-sale.pdf', true, false, 203)
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  use_count = EXCLUDED.use_count;

-- ============================================================================
-- PRODUCTS
-- ============================================================================
INSERT INTO products (
  id, slug, name, title, description, category, base_price, compare_price, sku, 
  is_active, is_featured, image_url, gallery_images, badges, specs,
  sizes, materials, finishings, lead_times, tier_pricing, addons,
  meta_title, meta_description, shipping_weight, shipping_dimensions, free_shipping_threshold
) VALUES
-- PVC Banner 3x6
(
  'f0000000-0000-4000-a000-000000000001',
  'pvc-banner-3x6',
  'PVC Banner',
  'PVC Banner 3×6 ft',
  'Durable, weather-resistant PVC banner ideal for events, trade shows, storefronts, and outdoor advertising. Waterproof and UV-resistant for long-lasting vibrant colors. Our most popular banner type.',
  'pvc-banners',
  49.99,
  69.99,
  'BNR-PVC-3X6',
  true,
  true,
  '/images/products/pvc-banner.jpg',
  '["/images/products/pvc-banner-1.jpg", "/images/products/pvc-banner-2.jpg", "/images/products/pvc-banner-3.jpg"]',
  '[{"label": "Best Seller", "color": "emerald"}, {"label": "Made in Canada", "color": "red"}]',
  '3×6 ft • 13oz PVC • UV Resistant • Waterproof',
  '[{"id": "3x6", "label": "3×6 ft", "price": 49.99}, {"id": "4x8", "label": "4×8 ft", "price": 79.99}, {"id": "4x10", "label": "4×10 ft", "price": 99.99}, {"id": "5x10", "label": "5×10 ft", "price": 129.99}, {"id": "custom", "label": "Custom Size", "price": null}]',
  '[{"id": "13oz", "label": "13oz PVC (Standard)", "price": 0, "description": "Durable, waterproof, UV-resistant for indoor/outdoor use"}, {"id": "18oz", "label": "18oz PVC (Heavy Duty)", "price": 15, "description": "Extra thick for long-term outdoor display"}, {"id": "mesh", "label": "PVC Mesh (Wind-Resistant)", "price": 10, "description": "Micro-perforated for high-wind areas"}]',
  '[{"id": "hemmed", "label": "Hemmed Edges", "price": 0, "description": "Standard reinforced edges"}, {"id": "grommets", "label": "Grommets (Eyelets)", "price": 0, "description": "Metal eyelets every 2ft for easy mounting"}, {"id": "pole-pockets", "label": "Pole Pockets", "price": 10, "description": "Sleeves for pole or rod mounting"}, {"id": "wind-slits", "label": "Wind Slits", "price": 5, "description": "Reduces wind resistance for outdoor use"}]',
  '[{"id": "standard", "label": "Standard (5-7 days)", "price": 0, "days": 7}, {"id": "rush", "label": "Rush (2-3 days)", "price": 25, "days": 3}, {"id": "same-day", "label": "Same Day", "price": 50, "days": 1}]',
  '[{"minQty": 1, "maxQty": 4, "discount": 0}, {"minQty": 5, "maxQty": 9, "discount": 10}, {"minQty": 10, "maxQty": 24, "discount": 15}, {"minQty": 25, "maxQty": 49, "discount": 20}, {"minQty": 50, "maxQty": null, "discount": 25}]',
  '[{"id": "design-proof", "label": "Design Proof", "price": 10, "description": "Get a digital proof before printing"}, {"id": "design-service", "label": "Design Service", "price": 49, "description": "We create your design from scratch"}]',
  'PVC Banner 3×6 ft - Custom Printed | Banner Direct',
  'Order custom PVC banners printed in Canada. Durable, weather-resistant vinyl banners for events, trade shows, and outdoor advertising. Fast shipping.',
  2.5,
  '{"length": 36, "width": 6, "height": 6}',
  200
),
-- Retractable Banner Stand
(
  'f0000000-0000-4000-a000-000000000002',
  'retractable-banner-stand',
  'Retractable Banner Stand',
  'Retractable Banner Stand 33×80 in',
  'Professional pull-up banner stand for trade shows, presentations, and retail displays. Includes aluminum stand, carrying case, and printed banner. Easy setup in seconds.',
  'retractable-banners',
  89.99,
  119.99,
  'BNR-RET-33X80',
  true,
  true,
  '/images/products/retractable-banner.jpg',
  '["/images/products/retractable-1.jpg", "/images/products/retractable-2.jpg"]',
  '[{"label": "Made in Canada", "color": "red"}, {"label": "Includes Stand", "color": "blue"}]',
  '33×80 in • Premium Polyester • Includes Stand & Case',
  '[{"id": "24x80", "label": "24×80 in", "price": 79.99}, {"id": "33x80", "label": "33×80 in", "price": 89.99}, {"id": "36x80", "label": "36×80 in", "price": 99.99}, {"id": "47x80", "label": "47×80 in (Wide)", "price": 129.99}]',
  '[{"id": "premium", "label": "Premium Polyester", "price": 0, "description": "Smooth, wrinkle-resistant fabric"}, {"id": "economy", "label": "Economy Vinyl", "price": -10, "description": "Budget-friendly option"}]',
  '[]',
  '[{"id": "standard", "label": "Standard (5-7 days)", "price": 0, "days": 7}, {"id": "rush", "label": "Rush (2-3 days)", "price": 30, "days": 3}]',
  '[{"minQty": 1, "maxQty": 4, "discount": 0}, {"minQty": 5, "maxQty": 9, "discount": 10}, {"minQty": 10, "maxQty": null, "discount": 15}]',
  '[{"id": "extra-print", "label": "Extra Print (No Stand)", "price": 39, "description": "Additional banner print only"}]',
  'Retractable Banner Stand - Trade Show Display | Banner Direct',
  'Professional retractable banner stands for trade shows and presentations. Includes stand, case, and custom printed banner. Made in Canada.',
  8.0,
  '{"length": 36, "width": 8, "height": 8}',
  200
),
-- PVC Mesh Banner
(
  'f0000000-0000-4000-a000-000000000003',
  'pvc-mesh-banner-4x8',
  'PVC Mesh Banner',
  'PVC Mesh Banner 4×8 ft',
  'Micro-perforated PVC mesh banner (70% PVC, 30% air) for maximum wind resistance. Perfect for fences, scaffolding, and large outdoor displays where wind is a concern.',
  'mesh-banners',
  69.99,
  89.99,
  'BNR-MESH-4X8',
  true,
  true,
  '/images/products/mesh-banner.jpg',
  '["/images/products/mesh-1.jpg", "/images/products/mesh-2.jpg"]',
  '[{"label": "Wind Resistant", "color": "blue"}, {"label": "Made in Canada", "color": "red"}]',
  '4×8 ft • PVC Mesh • 70% Print / 30% Air',
  '[{"id": "3x6", "label": "3×6 ft", "price": 49.99}, {"id": "4x8", "label": "4×8 ft", "price": 69.99}, {"id": "4x12", "label": "4×12 ft", "price": 99.99}, {"id": "custom", "label": "Custom Size", "price": null}]',
  '[{"id": "9oz", "label": "9oz PVC Mesh", "price": 0, "description": "Standard mesh with excellent airflow"}, {"id": "12oz", "label": "12oz PVC Mesh (Heavy)", "price": 15, "description": "Extra durability for long-term use"}]',
  '[{"id": "hemmed", "label": "Hemmed Edges", "price": 0, "description": "Reinforced edges for durability"}, {"id": "grommets", "label": "Grommets (Eyelets)", "price": 0, "description": "Metal eyelets for secure mounting"}]',
  '[{"id": "standard", "label": "Standard (5-7 days)", "price": 0, "days": 7}, {"id": "rush", "label": "Rush (2-3 days)", "price": 25, "days": 3}]',
  '[{"minQty": 1, "maxQty": 4, "discount": 0}, {"minQty": 5, "maxQty": 9, "discount": 10}, {"minQty": 10, "maxQty": null, "discount": 15}]',
  '[]',
  'PVC Mesh Banner - Wind Resistant Outdoor Banner | Banner Direct',
  'Wind-resistant mesh banners for fences and outdoor displays. Micro-perforated for high-wind areas. Custom printed in Canada.',
  3.0,
  '{"length": 48, "width": 6, "height": 6}',
  200
),
-- Fabric Banner
(
  'f0000000-0000-4000-a000-000000000004',
  'fabric-banner-3x5',
  'Fabric Banner',
  'Fabric Banner 3×5 ft',
  'Premium fabric banner with vibrant dye-sublimation printing. Lightweight, wrinkle-resistant, and machine washable. Perfect for indoor displays and reusable events.',
  'fabric-banners',
  59.99,
  79.99,
  'BNR-FAB-3X5',
  true,
  false,
  '/images/products/fabric-banner.jpg',
  '["/images/products/fabric-1.jpg", "/images/products/fabric-2.jpg"]',
  '[{"label": "Premium", "color": "purple"}, {"label": "Made in Canada", "color": "red"}]',
  '3×5 ft • Polyester Fabric • Machine Washable',
  '[{"id": "2x4", "label": "2×4 ft", "price": 39.99}, {"id": "3x5", "label": "3×5 ft", "price": 59.99}, {"id": "4x6", "label": "4×6 ft", "price": 79.99}, {"id": "custom", "label": "Custom Size", "price": null}]',
  '[{"id": "polyester", "label": "Polyester Fabric", "price": 0, "description": "Vibrant colors, machine washable"}, {"id": "canvas", "label": "Canvas", "price": 20, "description": "Textured, premium look"}]',
  '[{"id": "hemmed", "label": "Hemmed Edges", "price": 0, "description": "Clean finished edges"}, {"id": "pole-pockets", "label": "Pole Pockets", "price": 10, "description": "Sleeves for hanging"}]',
  '[{"id": "standard", "label": "Standard (5-7 days)", "price": 0, "days": 7}, {"id": "rush", "label": "Rush (2-3 days)", "price": 25, "days": 3}]',
  '[{"minQty": 1, "maxQty": 4, "discount": 0}, {"minQty": 5, "maxQty": 9, "discount": 10}, {"minQty": 10, "maxQty": null, "discount": 15}]',
  '[]',
  'Fabric Banner - Premium Dye-Sublimation Print | Banner Direct',
  'Premium fabric banners with vibrant dye-sublimation printing. Machine washable and reusable. Made in Canada.',
  1.5,
  '{"length": 36, "width": 4, "height": 4}',
  200
),
-- Yard Sign
(
  'f0000000-0000-4000-a000-000000000005',
  'yard-sign-18x24',
  'Yard Sign',
  'Yard Sign 18×24 in',
  'Durable corrugated plastic yard signs for real estate, events, political campaigns, and promotions. Includes H-stake for easy ground installation.',
  'yard-signs',
  24.99,
  34.99,
  'SGN-YARD-18X24',
  true,
  false,
  '/images/products/yard-sign.jpg',
  '["/images/products/yard-1.jpg", "/images/products/yard-2.jpg"]',
  '[{"label": "Includes Stake", "color": "green"}, {"label": "Made in Canada", "color": "red"}]',
  '18×24 in • 4mm Coroplast • Double-Sided Available',
  '[{"id": "12x18", "label": "12×18 in", "price": 19.99}, {"id": "18x24", "label": "18×24 in", "price": 24.99}, {"id": "24x36", "label": "24×36 in", "price": 39.99}]',
  '[{"id": "4mm", "label": "4mm Coroplast (Standard)", "price": 0, "description": "Lightweight, durable corrugated plastic"}, {"id": "6mm", "label": "6mm Coroplast (Heavy)", "price": 5, "description": "Extra rigid for windy conditions"}]',
  '[{"id": "single-sided", "label": "Single-Sided", "price": 0, "description": "Print on one side"}, {"id": "double-sided", "label": "Double-Sided", "price": 10, "description": "Print on both sides"}]',
  '[{"id": "standard", "label": "Standard (5-7 days)", "price": 0, "days": 7}, {"id": "rush", "label": "Rush (2-3 days)", "price": 15, "days": 3}]',
  '[{"minQty": 1, "maxQty": 9, "discount": 0}, {"minQty": 10, "maxQty": 24, "discount": 15}, {"minQty": 25, "maxQty": 49, "discount": 20}, {"minQty": 50, "maxQty": null, "discount": 25}]',
  '[{"id": "h-stake", "label": "H-Stake (Wire)", "price": 3, "description": "Metal stake for ground installation"}, {"id": "spider-stake", "label": "Spider Stake", "price": 5, "description": "Heavy-duty ground stake"}]',
  'Yard Signs - Custom Printed Coroplast Signs | Banner Direct',
  'Custom yard signs for real estate, events, and promotions. Durable corrugated plastic with H-stake included. Made in Canada.',
  0.5,
  '{"length": 24, "width": 18, "height": 1}',
  150
),
-- Large Format PVC Banner
(
  'f0000000-0000-4000-a000-000000000006',
  'large-format-pvc-banner',
  'Large Format PVC Banner',
  'Large Format PVC Banner 8×20 ft',
  'Extra-large PVC banners for building wraps, construction sites, and major events. Heavy-duty 18oz vinyl with reinforced edges and wind slits.',
  'pvc-banners',
  299.99,
  399.99,
  'BNR-PVC-LARGE',
  true,
  false,
  '/images/products/large-banner.jpg',
  '[]',
  '[{"label": "Heavy Duty", "color": "orange"}, {"label": "Made in Canada", "color": "red"}]',
  '8×20 ft • 18oz PVC • Reinforced Edges',
  '[{"id": "6x12", "label": "6×12 ft", "price": 179.99}, {"id": "8x16", "label": "8×16 ft", "price": 249.99}, {"id": "8x20", "label": "8×20 ft", "price": 299.99}, {"id": "10x30", "label": "10×30 ft", "price": 449.99}]',
  '[{"id": "18oz", "label": "18oz PVC (Heavy Duty)", "price": 0, "description": "Standard for large format"}, {"id": "22oz", "label": "22oz PVC (Extra Heavy)", "price": 50, "description": "Maximum durability"}]',
  '[{"id": "hemmed", "label": "Hemmed Edges", "price": 0, "description": "Reinforced edges"}, {"id": "grommets", "label": "Grommets Every 2ft", "price": 0, "description": "Heavy-duty brass grommets"}, {"id": "wind-slits", "label": "Wind Slits", "price": 0, "description": "Included for large banners"}, {"id": "rope-hem", "label": "Rope in Hem", "price": 25, "description": "Extra reinforcement"}]',
  '[{"id": "standard", "label": "Standard (7-10 days)", "price": 0, "days": 10}, {"id": "rush", "label": "Rush (4-5 days)", "price": 75, "days": 5}]',
  '[{"minQty": 1, "maxQty": 2, "discount": 0}, {"minQty": 3, "maxQty": 4, "discount": 10}, {"minQty": 5, "maxQty": null, "discount": 15}]',
  '[]',
  'Large Format Banners - Building Wraps & Event Banners | Banner Direct',
  'Extra-large custom banners for building wraps, construction sites, and major events. Heavy-duty vinyl printed in Canada.',
  15.0,
  '{"length": 48, "width": 12, "height": 12}',
  500
),
-- Table Top Banner
(
  'f0000000-0000-4000-a000-000000000007',
  'table-top-banner',
  'Table Top Banner Stand',
  'Table Top Retractable Banner 11×17 in',
  'Compact retractable banner perfect for table displays, reception desks, and small trade show booths. Portable and professional.',
  'retractable-banners',
  49.99,
  69.99,
  'BNR-TABLE-11X17',
  true,
  false,
  '/images/products/table-banner.jpg',
  '[]',
  '[{"label": "Compact", "color": "blue"}, {"label": "Made in Canada", "color": "red"}]',
  '11×17 in • Includes Stand • Carrying Case',
  '[{"id": "8.5x11", "label": "8.5×11 in", "price": 39.99}, {"id": "11x17", "label": "11×17 in", "price": 49.99}, {"id": "12x18", "label": "12×18 in", "price": 59.99}]',
  '[{"id": "premium", "label": "Premium Polyester", "price": 0, "description": "Smooth, professional finish"}]',
  '[]',
  '[{"id": "standard", "label": "Standard (5-7 days)", "price": 0, "days": 7}, {"id": "rush", "label": "Rush (2-3 days)", "price": 20, "days": 3}]',
  '[{"minQty": 1, "maxQty": 4, "discount": 0}, {"minQty": 5, "maxQty": 9, "discount": 10}, {"minQty": 10, "maxQty": null, "discount": 15}]',
  '[]',
  'Table Top Banner Stand - Compact Display | Banner Direct',
  'Compact table top retractable banners for reception desks and trade shows. Portable and professional. Made in Canada.',
  2.0,
  '{"length": 18, "width": 4, "height": 4}',
  150
),
-- Step and Repeat Banner
(
  'f0000000-0000-4000-a000-000000000008',
  'step-and-repeat-banner',
  'Step and Repeat Banner',
  'Step and Repeat Backdrop 8×8 ft',
  'Professional step and repeat backdrops for red carpet events, photo ops, and press conferences. Includes adjustable stand and carrying case.',
  'fabric-banners',
  349.99,
  449.99,
  'BNR-STEP-8X8',
  true,
  true,
  '/images/products/step-repeat.jpg',
  '[]',
  '[{"label": "Event Ready", "color": "purple"}, {"label": "Made in Canada", "color": "red"}]',
  '8×8 ft • Wrinkle-Free Fabric • Includes Stand',
  '[{"id": "6x6", "label": "6×6 ft", "price": 249.99}, {"id": "8x8", "label": "8×8 ft", "price": 349.99}, {"id": "8x10", "label": "8×10 ft", "price": 399.99}, {"id": "10x10", "label": "10×10 ft", "price": 499.99}]',
  '[{"id": "fabric", "label": "Wrinkle-Free Fabric", "price": 0, "description": "Matte finish, no glare"}, {"id": "vinyl", "label": "Vinyl (Glossy)", "price": -30, "description": "Shiny finish, may have glare"}]',
  '[]',
  '[{"id": "standard", "label": "Standard (7-10 days)", "price": 0, "days": 10}, {"id": "rush", "label": "Rush (3-5 days)", "price": 100, "days": 5}]',
  '[{"minQty": 1, "maxQty": 2, "discount": 0}, {"minQty": 3, "maxQty": null, "discount": 10}]',
  '[{"id": "extra-print", "label": "Extra Print (No Stand)", "price": 149, "description": "Additional backdrop print only"}, {"id": "carrying-case", "label": "Premium Carrying Case", "price": 49, "description": "Wheeled hard case"}]',
  'Step and Repeat Banners - Red Carpet Backdrops | Banner Direct',
  'Professional step and repeat backdrops for events and photo ops. Includes adjustable stand. Made in Canada.',
  25.0,
  '{"length": 60, "width": 12, "height": 12}',
  500
)
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  title = EXCLUDED.title,
  description = EXCLUDED.description,
  base_price = EXCLUDED.base_price,
  compare_price = EXCLUDED.compare_price,
  sizes = EXCLUDED.sizes,
  materials = EXCLUDED.materials,
  finishings = EXCLUDED.finishings,
  lead_times = EXCLUDED.lead_times,
  tier_pricing = EXCLUDED.tier_pricing,
  addons = EXCLUDED.addons,
  badges = EXCLUDED.badges,
  is_featured = EXCLUDED.is_featured,
  meta_title = EXCLUDED.meta_title,
  meta_description = EXCLUDED.meta_description;

-- ============================================================================
-- UPLOADS, ORDERS, ORDER_ITEMS, CART_ITEMS
-- ============================================================================
-- These use the following real auth user IDs:
-- User 1 (Bino): eaa70117-b0c5-40c5-a8dc-23dba1344c64
-- User 2 (Corbin): 973f5829-34bb-48d1-9390-77c9225eab33
-- ============================================================================

-- ============================================================================
-- UPLOADS (Test artwork uploads)
-- ============================================================================
INSERT INTO uploads (id, user_id, file_name, file_url, file_type, file_size, status, admin_notes, url) VALUES
  ('20000000-0000-4000-a000-000000000001', 'eaa70117-b0c5-40c5-a8dc-23dba1344c64', 'company-logo.pdf', '/uploads/company-logo.pdf', 'application/pdf', 2456789, 'approved', 'High resolution, print ready', '/uploads/company-logo.pdf'),
  ('20000000-0000-4000-a000-000000000002', 'eaa70117-b0c5-40c5-a8dc-23dba1344c64', 'event-banner-design.png', '/uploads/event-banner-design.png', 'image/png', 5678901, 'approved', NULL, '/uploads/event-banner-design.png'),
  ('20000000-0000-4000-a000-000000000003', '973f5829-34bb-48d1-9390-77c9225eab33', 'trade-show-artwork.ai', '/uploads/trade-show-artwork.ai', 'application/illustrator', 8901234, 'approved', 'Vector file, excellent quality', '/uploads/trade-show-artwork.ai'),
  ('20000000-0000-4000-a000-000000000004', 'eaa70117-b0c5-40c5-a8dc-23dba1344c64', 'sale-banner.jpg', '/uploads/sale-banner.jpg', 'image/jpeg', 1234567, 'pending', NULL, '/uploads/sale-banner.jpg'),
  ('20000000-0000-4000-a000-000000000005', '973f5829-34bb-48d1-9390-77c9225eab33', 'wedding-welcome.pdf', '/uploads/wedding-welcome.pdf', 'application/pdf', 3456789, 'processing', 'Checking resolution', '/uploads/wedding-welcome.pdf'),
  ('20000000-0000-4000-a000-000000000006', 'eaa70117-b0c5-40c5-a8dc-23dba1344c64', 'low-res-image.jpg', '/uploads/low-res-image.jpg', 'image/jpeg', 234567, 'rejected', 'Resolution too low for print size. Please upload at least 150 DPI.', '/uploads/low-res-image.jpg'),
  ('20000000-0000-4000-a000-000000000007', '973f5829-34bb-48d1-9390-77c9225eab33', 'retractable-design.pdf', '/uploads/retractable-design.pdf', 'application/pdf', 4567890, 'approved', NULL, '/uploads/retractable-design.pdf')
ON CONFLICT (id) DO UPDATE SET
  status = EXCLUDED.status,
  admin_notes = EXCLUDED.admin_notes;

-- ============================================================================
-- ORDERS (Test orders with various statuses)
-- ============================================================================
INSERT INTO orders (id, order_number, user_id, customer_email, customer_name, customer_phone, shipping_address, billing_address, status, subtotal, shipping_cost, tax, discount, total, payment_status, payment_method, shipping_method, tracking_number, tracking_carrier, estimated_delivery, customer_notes, admin_notes) VALUES
-- Delivered order
('30000000-0000-4000-a000-000000000001', 'BD-2024-001', 'eaa70117-b0c5-40c5-a8dc-23dba1344c64', 'gikalar920@gamintor.com', 'Bino Heryet', '+1-416-555-0101',
 '{"street": "123 Main Street", "city": "Toronto", "province": "ON", "postal_code": "M5V 2T6", "country": "Canada"}',
 '{"street": "123 Main Street", "city": "Toronto", "province": "ON", "postal_code": "M5V 2T6", "country": "Canada"}',
 'delivered', 149.97, 0, 19.50, 0, 169.47, 'paid', 'credit_card', 'Standard Shipping', 'CP123456789CA', 'Canada Post', '2024-12-10', NULL, 'Delivered on time'),

-- Shipped order
('30000000-0000-4000-a000-000000000002', 'BD-2024-002', '973f5829-34bb-48d1-9390-77c9225eab33', 'c.heryet@outlook.com', 'Corbin Heryet', '+1-604-555-0202',
 '{"street": "456 Oak Avenue", "city": "Vancouver", "province": "BC", "postal_code": "V6B 1A1", "country": "Canada"}',
 '{"street": "456 Oak Avenue", "city": "Vancouver", "province": "BC", "postal_code": "V6B 1A1", "country": "Canada"}',
 'shipped', 269.97, 19.99, 37.69, 26.99, 300.66, 'paid', 'credit_card', 'Express Shipping', 'CP987654321CA', 'Canada Post', '2024-12-20', 'Please leave at front door', NULL),

-- Processing order
('30000000-0000-4000-a000-000000000003', 'BD-2024-003', 'eaa70117-b0c5-40c5-a8dc-23dba1344c64', 'gikalar920@gamintor.com', 'Bino Heryet', '+1-403-555-0303',
 '{"street": "789 Pine Road", "city": "Calgary", "province": "AB", "postal_code": "T2P 1J9", "country": "Canada"}',
 '{"street": "789 Pine Road", "city": "Calgary", "province": "AB", "postal_code": "T2P 1J9", "country": "Canada"}',
 'processing', 499.95, 0, 25.00, 49.99, 474.96, 'paid', 'credit_card', 'Free Shipping', NULL, NULL, '2024-12-25', 'Rush order - need by Christmas', 'Priority production'),

-- Printing order
('30000000-0000-4000-a000-000000000004', 'BD-2024-004', '973f5829-34bb-48d1-9390-77c9225eab33', 'c.heryet@outlook.com', 'Corbin Heryet', '+1-514-555-0404',
 '{"street": "321 Maple Lane", "city": "Montreal", "province": "QC", "postal_code": "H2Y 1C6", "country": "Canada"}',
 '{"street": "321 Maple Lane", "city": "Montreal", "province": "QC", "postal_code": "H2Y 1C6", "country": "Canada"}',
 'printing', 89.99, 14.99, 13.65, 0, 118.63, 'paid', 'credit_card', 'Standard Shipping', NULL, NULL, '2024-12-28', NULL, NULL),

-- Pending order
('30000000-0000-4000-a000-000000000005', 'BD-2024-005', 'eaa70117-b0c5-40c5-a8dc-23dba1344c64', 'gikalar920@gamintor.com', 'Bino Heryet', '+1-613-555-0505',
 '{"street": "654 Elm Street", "city": "Ottawa", "province": "ON", "postal_code": "K1P 1J1", "country": "Canada"}',
 '{"street": "654 Elm Street", "city": "Ottawa", "province": "ON", "postal_code": "K1P 1J1", "country": "Canada"}',
 'pending', 199.98, 12.99, 27.69, 0, 240.66, 'pending', NULL, 'Standard Shipping', NULL, NULL, NULL, 'Waiting for artwork approval', NULL),

-- Confirmed order
('30000000-0000-4000-a000-000000000006', 'BD-2024-006', 'eaa70117-b0c5-40c5-a8dc-23dba1344c64', 'gikalar920@gamintor.com', 'Bino Heryet', '+1-416-555-0101',
 '{"street": "123 Main Street", "city": "Toronto", "province": "ON", "postal_code": "M5V 2T6", "country": "Canada"}',
 '{"street": "123 Main Street", "city": "Toronto", "province": "ON", "postal_code": "M5V 2T6", "country": "Canada"}',
 'confirmed', 349.99, 0, 45.50, 35.00, 360.49, 'paid', 'credit_card', 'Free Shipping', NULL, NULL, '2024-12-30', NULL, 'Bulk order - 10 banners'),

-- Quality check order
('30000000-0000-4000-a000-000000000007', 'BD-2024-007', '973f5829-34bb-48d1-9390-77c9225eab33', 'c.heryet@outlook.com', 'Corbin Heryet', '+1-604-555-0202',
 '{"street": "456 Oak Avenue", "city": "Vancouver", "province": "BC", "postal_code": "V6B 1A1", "country": "Canada"}',
 '{"street": "456 Oak Avenue", "city": "Vancouver", "province": "BC", "postal_code": "V6B 1A1", "country": "Canada"}',
 'quality_check', 179.98, 24.99, 26.65, 0, 231.62, 'paid', 'credit_card', 'Express Shipping', NULL, NULL, '2024-12-22', NULL, 'Final QC before shipping'),

-- Cancelled order
('30000000-0000-4000-a000-000000000008', 'BD-2024-008', 'eaa70117-b0c5-40c5-a8dc-23dba1344c64', 'gikalar920@gamintor.com', 'Bino Heryet', '+1-403-555-0303',
 '{"street": "789 Pine Road", "city": "Calgary", "province": "AB", "postal_code": "T2P 1J9", "country": "Canada"}',
 '{"street": "789 Pine Road", "city": "Calgary", "province": "AB", "postal_code": "T2P 1J9", "country": "Canada"}',
 'cancelled', 59.99, 12.99, 9.49, 0, 82.47, 'refunded', 'credit_card', 'Standard Shipping', NULL, NULL, NULL, 'Changed my mind', 'Full refund processed'),

-- Refunded order
('30000000-0000-4000-a000-000000000009', 'BD-2024-009', '973f5829-34bb-48d1-9390-77c9225eab33', 'c.heryet@outlook.com', 'Corbin Heryet', '+1-514-555-0404',
 '{"street": "321 Maple Lane", "city": "Montreal", "province": "QC", "postal_code": "H2Y 1C6", "country": "Canada"}',
 '{"street": "321 Maple Lane", "city": "Montreal", "province": "QC", "postal_code": "H2Y 1C6", "country": "Canada"}',
 'refunded', 129.99, 14.99, 18.85, 0, 163.83, 'refunded', 'credit_card', 'Standard Shipping', NULL, NULL, NULL, NULL, 'Product damaged in shipping - full refund'),

-- Another delivered order (older)
('30000000-0000-4000-a000-000000000010', 'BD-2024-010', 'eaa70117-b0c5-40c5-a8dc-23dba1344c64', 'gikalar920@gamintor.com', 'Bino Heryet', '+1-613-555-0505',
 '{"street": "654 Elm Street", "city": "Ottawa", "province": "ON", "postal_code": "K1P 1J1", "country": "Canada"}',
 '{"street": "654 Elm Street", "city": "Ottawa", "province": "ON", "postal_code": "K1P 1J1", "country": "Canada"}',
 'delivered', 399.96, 0, 51.99, 40.00, 411.95, 'paid', 'credit_card', 'Free Shipping', 'CP111222333CA', 'Canada Post', '2024-11-15', 'Trade show banners', 'Repeat customer - priority handling')
ON CONFLICT (id) DO UPDATE SET
  status = EXCLUDED.status,
  payment_status = EXCLUDED.payment_status,
  tracking_number = EXCLUDED.tracking_number,
  admin_notes = EXCLUDED.admin_notes;

-- ============================================================================
-- ORDER ITEMS (Items for each order)
-- ============================================================================
INSERT INTO order_items (id, order_id, product_id, product_title, product_slug, product_name, configuration, quantity, unit_price, total_price, upload_id, status, artwork_url) VALUES
-- Order 1 items (Delivered)
('40000000-0000-4000-a000-000000000001', '30000000-0000-4000-a000-000000000001', 'f0000000-0000-4000-a000-000000000001', 'PVC Banner 3×6 ft', 'pvc-banner-3x6', 'PVC Banner', 
 '{"size": "3x6", "material": "13oz", "finishings": ["hemmed", "grommets"], "leadTime": "standard"}', 3, 49.99, 149.97, '20000000-0000-4000-a000-000000000001', 'shipped', '/uploads/company-logo.pdf'),

-- Order 2 items (Shipped)
('40000000-0000-4000-a000-000000000002', '30000000-0000-4000-a000-000000000002', 'f0000000-0000-4000-a000-000000000002', 'Retractable Banner Stand 33×80 in', 'retractable-banner-stand', 'Retractable Banner Stand',
 '{"size": "33x80", "material": "premium", "leadTime": "rush"}', 2, 89.99, 179.98, '20000000-0000-4000-a000-000000000003', 'shipped', '/uploads/trade-show-artwork.ai'),
('40000000-0000-4000-a000-000000000003', '30000000-0000-4000-a000-000000000002', 'f0000000-0000-4000-a000-000000000001', 'PVC Banner 4×8 ft', 'pvc-banner-3x6', 'PVC Banner',
 '{"size": "4x8", "material": "18oz", "finishings": ["hemmed", "grommets", "wind-slits"], "leadTime": "rush"}', 1, 89.99, 89.99, '20000000-0000-4000-a000-000000000003', 'shipped', '/uploads/trade-show-artwork.ai'),

-- Order 3 items (Processing)
('40000000-0000-4000-a000-000000000004', '30000000-0000-4000-a000-000000000003', 'f0000000-0000-4000-a000-000000000001', 'PVC Banner 5×10 ft', 'pvc-banner-3x6', 'PVC Banner',
 '{"size": "5x10", "material": "18oz", "finishings": ["hemmed", "grommets"], "leadTime": "rush"}', 5, 99.99, 499.95, '20000000-0000-4000-a000-000000000004', 'pending', '/uploads/sale-banner.jpg'),

-- Order 4 items (Printing)
('40000000-0000-4000-a000-000000000005', '30000000-0000-4000-a000-000000000004', 'f0000000-0000-4000-a000-000000000002', 'Retractable Banner Stand 33×80 in', 'retractable-banner-stand', 'Retractable Banner Stand',
 '{"size": "33x80", "material": "premium", "leadTime": "standard"}', 1, 89.99, 89.99, '20000000-0000-4000-a000-000000000007', 'printing', '/uploads/retractable-design.pdf'),

-- Order 5 items (Pending)
('40000000-0000-4000-a000-000000000006', '30000000-0000-4000-a000-000000000005', 'f0000000-0000-4000-a000-000000000004', 'Fabric Banner 3×5 ft', 'fabric-banner-3x5', 'Fabric Banner',
 '{"size": "3x5", "material": "polyester", "finishings": ["hemmed"], "leadTime": "standard"}', 2, 59.99, 119.98, NULL, 'pending', NULL),
('40000000-0000-4000-a000-000000000007', '30000000-0000-4000-a000-000000000005', 'f0000000-0000-4000-a000-000000000005', 'Yard Sign 18×24 in', 'yard-sign-18x24', 'Yard Sign',
 '{"size": "18x24", "material": "4mm", "finishings": ["double-sided"], "leadTime": "standard"}', 4, 19.99, 79.96, NULL, 'pending', NULL),

-- Order 6 items (Confirmed)
('40000000-0000-4000-a000-000000000008', '30000000-0000-4000-a000-000000000006', 'f0000000-0000-4000-a000-000000000001', 'PVC Banner 3×6 ft', 'pvc-banner-3x6', 'PVC Banner',
 '{"size": "3x6", "material": "13oz", "finishings": ["hemmed", "grommets"], "leadTime": "standard"}', 10, 34.99, 349.99, '20000000-0000-4000-a000-000000000002', 'pending', '/uploads/event-banner-design.png'),

-- Order 7 items (Quality Check)
('40000000-0000-4000-a000-000000000009', '30000000-0000-4000-a000-000000000007', 'f0000000-0000-4000-a000-000000000003', 'PVC Mesh Banner 4×8 ft', 'pvc-mesh-banner-4x8', 'PVC Mesh Banner',
 '{"size": "4x8", "material": "9oz", "finishings": ["hemmed", "grommets"], "leadTime": "rush"}', 2, 89.99, 179.98, '20000000-0000-4000-a000-000000000003', 'quality_check', '/uploads/trade-show-artwork.ai'),

-- Order 8 items (Cancelled)
('40000000-0000-4000-a000-000000000010', '30000000-0000-4000-a000-000000000008', 'f0000000-0000-4000-a000-000000000005', 'Yard Sign 18×24 in', 'yard-sign-18x24', 'Yard Sign',
 '{"size": "18x24", "material": "4mm", "finishings": ["single-sided"], "leadTime": "standard"}', 2, 29.99, 59.99, NULL, 'pending', NULL),

-- Order 9 items (Refunded)
('40000000-0000-4000-a000-000000000011', '30000000-0000-4000-a000-000000000009', 'f0000000-0000-4000-a000-000000000004', 'Fabric Banner 4×6 ft', 'fabric-banner-3x5', 'Fabric Banner',
 '{"size": "4x6", "material": "polyester", "finishings": ["hemmed", "pole-pockets"], "leadTime": "standard"}', 1, 129.99, 129.99, '20000000-0000-4000-a000-000000000005', 'shipped', '/uploads/wedding-welcome.pdf'),

-- Order 10 items (Delivered - older)
('40000000-0000-4000-a000-000000000012', '30000000-0000-4000-a000-000000000010', 'f0000000-0000-4000-a000-000000000002', 'Retractable Banner Stand 33×80 in', 'retractable-banner-stand', 'Retractable Banner Stand',
 '{"size": "33x80", "material": "premium", "leadTime": "standard"}', 4, 99.99, 399.96, '20000000-0000-4000-a000-000000000003', 'shipped', '/uploads/trade-show-artwork.ai')
ON CONFLICT (id) DO UPDATE SET
  status = EXCLUDED.status,
  artwork_url = EXCLUDED.artwork_url;

-- ============================================================================
-- CART ITEMS (Active shopping carts)
-- ============================================================================
INSERT INTO cart_items (id, user_id, product_id, product_name, configuration, product_options, quantity, unit_price, upload_id) VALUES
('50000000-0000-4000-a000-000000000001', 'eaa70117-b0c5-40c5-a8dc-23dba1344c64', 'f0000000-0000-4000-a000-000000000001', 'PVC Banner 3×6 ft',
 '{"size": "3x6", "material": "13oz", "finishings": ["hemmed", "grommets"], "leadTime": "standard"}',
 '{"size": "3×6 ft", "material": "13oz PVC (Standard)", "finishings": "Hemmed Edges, Grommets"}',
 2, 49.99, NULL),
('50000000-0000-4000-a000-000000000002', 'eaa70117-b0c5-40c5-a8dc-23dba1344c64', 'f0000000-0000-4000-a000-000000000002', 'Retractable Banner Stand 33×80 in',
 '{"size": "33x80", "material": "premium", "leadTime": "rush"}',
 '{"size": "33×80 in", "material": "Premium Polyester", "leadTime": "Rush (2-3 days)"}',
 1, 119.99, NULL),
('50000000-0000-4000-a000-000000000003', '973f5829-34bb-48d1-9390-77c9225eab33', 'f0000000-0000-4000-a000-000000000005', 'Yard Sign 18×24 in',
 '{"size": "18x24", "material": "4mm", "finishings": ["double-sided"], "leadTime": "standard"}',
 '{"size": "18×24 in", "material": "4mm Coroplast", "finishings": "Double-Sided"}',
 10, 34.99, NULL)
ON CONFLICT (id) DO UPDATE SET
  quantity = EXCLUDED.quantity,
  unit_price = EXCLUDED.unit_price;

-- ============================================================================
-- SET ADMIN ROLE FOR TEST USER
-- ============================================================================
UPDATE profiles SET role = 'admin' WHERE id = '973f5829-34bb-48d1-9390-77c9225eab33';
