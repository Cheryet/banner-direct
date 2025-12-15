-- =============================================================================
-- BANNER DIRECT - SCHEMA UPDATES
-- =============================================================================
-- This migration adds missing columns identified from codebase audit:
-- - Products: name, compare_price, sku, gallery_images, is_featured, meta_title,
--             meta_description, shipping_weight, shipping_dimensions, 
--             free_shipping_threshold, addons
-- - Orders: tracking_carrier
-- - Order Items: product_name, product_options, artwork_url (rename from existing)
-- - Uploads: url (alias for file_url)
-- =============================================================================

-- =============================================================================
-- PRODUCTS TABLE UPDATES
-- =============================================================================

-- Add 'name' column (code uses 'name' but schema has 'title')
-- We'll add name and keep title for backwards compatibility
ALTER TABLE public.products 
  ADD COLUMN IF NOT EXISTS name TEXT;

-- Update name from title where name is null
UPDATE public.products SET name = title WHERE name IS NULL;

-- Add compare_price for showing original/sale prices
ALTER TABLE public.products 
  ADD COLUMN IF NOT EXISTS compare_price DECIMAL(10,2);

-- Add SKU for inventory tracking
ALTER TABLE public.products 
  ADD COLUMN IF NOT EXISTS sku TEXT;

-- Add gallery_images for multiple product images
ALTER TABLE public.products 
  ADD COLUMN IF NOT EXISTS gallery_images JSONB DEFAULT '[]';

-- Add is_featured flag for homepage/featured sections
ALTER TABLE public.products 
  ADD COLUMN IF NOT EXISTS is_featured BOOLEAN NOT NULL DEFAULT false;

-- Add SEO fields
ALTER TABLE public.products 
  ADD COLUMN IF NOT EXISTS meta_title TEXT;

ALTER TABLE public.products 
  ADD COLUMN IF NOT EXISTS meta_description TEXT;

-- Add shipping-related fields
ALTER TABLE public.products 
  ADD COLUMN IF NOT EXISTS shipping_weight DECIMAL(10,2);

ALTER TABLE public.products 
  ADD COLUMN IF NOT EXISTS shipping_dimensions JSONB DEFAULT '{"length": null, "width": null, "height": null}';

ALTER TABLE public.products 
  ADD COLUMN IF NOT EXISTS free_shipping_threshold DECIMAL(10,2);

-- Add addons for product add-ons/upsells
ALTER TABLE public.products 
  ADD COLUMN IF NOT EXISTS addons JSONB DEFAULT '[]';

-- Create index for featured products
CREATE INDEX IF NOT EXISTS idx_products_is_featured ON public.products(is_featured) WHERE is_featured = true;

-- Create index for SKU lookups
CREATE INDEX IF NOT EXISTS idx_products_sku ON public.products(sku) WHERE sku IS NOT NULL;

-- =============================================================================
-- ORDERS TABLE UPDATES
-- =============================================================================

-- Add tracking_carrier for shipping carrier info
ALTER TABLE public.orders 
  ADD COLUMN IF NOT EXISTS tracking_carrier TEXT;

-- =============================================================================
-- ORDER ITEMS TABLE UPDATES
-- =============================================================================

-- Add product_name (denormalized for display, different from product_title)
ALTER TABLE public.order_items 
  ADD COLUMN IF NOT EXISTS product_name TEXT;

-- Update product_name from product_title where null
UPDATE public.order_items SET product_name = product_title WHERE product_name IS NULL;

-- Add product_options for storing selected configuration
ALTER TABLE public.order_items 
  ADD COLUMN IF NOT EXISTS product_options JSONB;

-- Add artwork_url for direct link to uploaded artwork
ALTER TABLE public.order_items 
  ADD COLUMN IF NOT EXISTS artwork_url TEXT;

-- =============================================================================
-- UPLOADS TABLE UPDATES
-- =============================================================================

-- Add url column as alias/alternative to file_url (some code uses 'url')
ALTER TABLE public.uploads 
  ADD COLUMN IF NOT EXISTS url TEXT;

-- Update url from file_url where null
UPDATE public.uploads SET url = file_url WHERE url IS NULL;

-- =============================================================================
-- CART ITEMS TABLE UPDATES
-- =============================================================================

-- Add product_name for cart display
ALTER TABLE public.cart_items 
  ADD COLUMN IF NOT EXISTS product_name TEXT;

-- Add product_options for cart configuration
ALTER TABLE public.cart_items 
  ADD COLUMN IF NOT EXISTS product_options JSONB;

-- Create unique constraint for cart upsert operations
-- (user can only have one cart item per product configuration)
CREATE UNIQUE INDEX IF NOT EXISTS idx_cart_items_user_product 
  ON public.cart_items(user_id, product_name) 
  WHERE product_name IS NOT NULL;

-- =============================================================================
-- CATEGORIES TABLE (NEW)
-- =============================================================================
-- For admin category management

CREATE TABLE IF NOT EXISTS public.categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  image_url TEXT,
  parent_id UUID REFERENCES public.categories(id) ON DELETE SET NULL,
  sort_order INTEGER NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT true,
  product_count INTEGER NOT NULL DEFAULT 0,
  
  -- Metadata
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_categories_slug ON public.categories(slug);
CREATE INDEX IF NOT EXISTS idx_categories_parent ON public.categories(parent_id);
CREATE INDEX IF NOT EXISTS idx_categories_is_active ON public.categories(is_active);

-- Add updated_at trigger for categories
DROP TRIGGER IF EXISTS trigger_categories_updated_at ON public.categories;
CREATE TRIGGER trigger_categories_updated_at
  BEFORE UPDATE ON public.categories
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

-- =============================================================================
-- SHIPPING ZONES TABLE (NEW)
-- =============================================================================
-- For admin shipping zone management

CREATE TABLE IF NOT EXISTS public.shipping_zones (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  countries JSONB NOT NULL DEFAULT '[]',
  provinces JSONB DEFAULT '[]',
  is_active BOOLEAN NOT NULL DEFAULT true,
  
  -- Metadata
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Add updated_at trigger for shipping_zones
DROP TRIGGER IF EXISTS trigger_shipping_zones_updated_at ON public.shipping_zones;
CREATE TRIGGER trigger_shipping_zones_updated_at
  BEFORE UPDATE ON public.shipping_zones
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

-- =============================================================================
-- SHIPPING RATES TABLE (NEW)
-- =============================================================================
-- For admin shipping rate management

CREATE TABLE IF NOT EXISTS public.shipping_rates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  zone_id UUID REFERENCES public.shipping_zones(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  min_weight DECIMAL(10,2),
  max_weight DECIMAL(10,2),
  min_order_value DECIMAL(10,2),
  max_order_value DECIMAL(10,2),
  base_rate DECIMAL(10,2) NOT NULL DEFAULT 0,
  per_kg_rate DECIMAL(10,2) DEFAULT 0,
  estimated_days_min INTEGER,
  estimated_days_max INTEGER,
  is_active BOOLEAN NOT NULL DEFAULT true,
  
  -- Metadata
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_shipping_rates_zone ON public.shipping_rates(zone_id);

-- Add updated_at trigger for shipping_rates
DROP TRIGGER IF EXISTS trigger_shipping_rates_updated_at ON public.shipping_rates;
CREATE TRIGGER trigger_shipping_rates_updated_at
  BEFORE UPDATE ON public.shipping_rates
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

-- =============================================================================
-- LEAD TIMES TABLE (NEW)
-- =============================================================================
-- For admin lead time management (global defaults)

CREATE TABLE IF NOT EXISTS public.lead_times (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  label TEXT NOT NULL,
  days INTEGER NOT NULL,
  price_modifier DECIMAL(10,2) NOT NULL DEFAULT 0,
  is_default BOOLEAN NOT NULL DEFAULT false,
  is_active BOOLEAN NOT NULL DEFAULT true,
  sort_order INTEGER NOT NULL DEFAULT 0,
  
  -- Metadata
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Add updated_at trigger for lead_times
DROP TRIGGER IF EXISTS trigger_lead_times_updated_at ON public.lead_times;
CREATE TRIGGER trigger_lead_times_updated_at
  BEFORE UPDATE ON public.lead_times
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

-- =============================================================================
-- TEMPLATES TABLE (NEW)
-- =============================================================================
-- For design templates

CREATE TABLE IF NOT EXISTS public.templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  category TEXT,
  thumbnail_url TEXT,
  template_url TEXT,
  is_active BOOLEAN NOT NULL DEFAULT true,
  is_featured BOOLEAN NOT NULL DEFAULT false,
  use_count INTEGER NOT NULL DEFAULT 0,
  
  -- Metadata
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_templates_slug ON public.templates(slug);
CREATE INDEX IF NOT EXISTS idx_templates_category ON public.templates(category);
CREATE INDEX IF NOT EXISTS idx_templates_is_active ON public.templates(is_active);

-- Add updated_at trigger for templates
DROP TRIGGER IF EXISTS trigger_templates_updated_at ON public.templates;
CREATE TRIGGER trigger_templates_updated_at
  BEFORE UPDATE ON public.templates
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

-- =============================================================================
-- SETTINGS TABLE (NEW)
-- =============================================================================
-- For store settings

CREATE TABLE IF NOT EXISTS public.settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  key TEXT UNIQUE NOT NULL,
  value JSONB NOT NULL,
  description TEXT,
  
  -- Metadata
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_settings_key ON public.settings(key);

-- Add updated_at trigger for settings
DROP TRIGGER IF EXISTS trigger_settings_updated_at ON public.settings;
CREATE TRIGGER trigger_settings_updated_at
  BEFORE UPDATE ON public.settings
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

-- Insert default settings
INSERT INTO public.settings (key, value, description) VALUES
  ('store_name', '"Banner Direct"', 'Store name'),
  ('store_email', '"hello@bannerdirect.ca"', 'Store contact email'),
  ('store_phone', '"1-800-555-1234"', 'Store phone number'),
  ('currency', '"CAD"', 'Default currency'),
  ('tax_rate', '0.13', 'Default tax rate (13% for Ontario)'),
  ('free_shipping_threshold', '150', 'Order value for free shipping')
ON CONFLICT (key) DO NOTHING;
