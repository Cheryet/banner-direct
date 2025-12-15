-- =============================================================================
-- BANNER DIRECT - INITIAL DATABASE SCHEMA
-- =============================================================================
-- This migration creates the foundational tables for:
-- - User profiles (with role-based access)
-- - Products and configurations
-- - Orders and order items
-- - File uploads
-- - Cart (for anonymous and authenticated users)
-- =============================================================================

-- Enable UUID extension in extensions schema (Supabase default)
CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA extensions;

-- =============================================================================
-- PROFILES TABLE
-- Extends Supabase auth.users with application-specific data
-- =============================================================================
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT,
  full_name TEXT,
  phone TEXT,
  role TEXT NOT NULL DEFAULT 'user' CHECK (role IN ('user', 'admin')),
  is_anonymous BOOLEAN NOT NULL DEFAULT false,
  
  -- Address fields for shipping
  shipping_address JSONB,
  billing_address JSONB,
  
  -- Metadata
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Index for role-based queries
CREATE INDEX idx_profiles_role ON public.profiles(role);
CREATE INDEX idx_profiles_is_anonymous ON public.profiles(is_anonymous);

-- =============================================================================
-- PRODUCTS TABLE
-- Stores banner product definitions
-- =============================================================================
CREATE TABLE public.products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  category TEXT NOT NULL,
  base_price DECIMAL(10,2) NOT NULL,
  is_active BOOLEAN NOT NULL DEFAULT true,
  
  -- Product configuration options (stored as JSONB for flexibility)
  sizes JSONB NOT NULL DEFAULT '[]',
  materials JSONB NOT NULL DEFAULT '[]',
  finishings JSONB NOT NULL DEFAULT '[]',
  lead_times JSONB NOT NULL DEFAULT '[]',
  tier_pricing JSONB NOT NULL DEFAULT '[]',
  
  -- SEO and display
  image_url TEXT,
  badges JSONB DEFAULT '[]',
  specs TEXT,
  
  -- Metadata
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_products_slug ON public.products(slug);
CREATE INDEX idx_products_category ON public.products(category);
CREATE INDEX idx_products_is_active ON public.products(is_active);

-- =============================================================================
-- UPLOADS TABLE
-- Stores user artwork uploads
-- =============================================================================
CREATE TABLE public.uploads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  
  -- File information
  file_name TEXT NOT NULL,
  file_url TEXT NOT NULL,
  file_type TEXT NOT NULL,
  file_size INTEGER NOT NULL,
  
  -- Processing status
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'approved', 'rejected')),
  admin_notes TEXT,
  
  -- Metadata
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_uploads_user_id ON public.uploads(user_id);
CREATE INDEX idx_uploads_status ON public.uploads(status);

-- =============================================================================
-- CART TABLE
-- Stores shopping cart items for both anonymous and authenticated users
-- =============================================================================
CREATE TABLE public.cart_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  
  -- Configuration snapshot
  configuration JSONB NOT NULL,
  quantity INTEGER NOT NULL DEFAULT 1 CHECK (quantity > 0),
  unit_price DECIMAL(10,2) NOT NULL,
  
  -- Linked upload (optional)
  upload_id UUID REFERENCES public.uploads(id) ON DELETE SET NULL,
  
  -- Metadata
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_cart_items_user_id ON public.cart_items(user_id);

-- =============================================================================
-- ORDERS TABLE
-- Stores completed orders
-- =============================================================================
CREATE TABLE public.orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_number TEXT UNIQUE NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  
  -- Customer info (denormalized for order history)
  customer_email TEXT NOT NULL,
  customer_name TEXT,
  customer_phone TEXT,
  
  -- Addresses
  shipping_address JSONB NOT NULL,
  billing_address JSONB,
  
  -- Order status
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN (
    'pending', 'confirmed', 'processing', 'printing', 
    'quality_check', 'shipped', 'delivered', 'cancelled', 'refunded'
  )),
  
  -- Pricing
  subtotal DECIMAL(10,2) NOT NULL,
  shipping_cost DECIMAL(10,2) NOT NULL DEFAULT 0,
  tax DECIMAL(10,2) NOT NULL DEFAULT 0,
  discount DECIMAL(10,2) NOT NULL DEFAULT 0,
  total DECIMAL(10,2) NOT NULL,
  
  -- Payment
  payment_status TEXT NOT NULL DEFAULT 'pending' CHECK (payment_status IN (
    'pending', 'paid', 'failed', 'refunded', 'partially_refunded'
  )),
  payment_method TEXT,
  payment_intent_id TEXT,
  
  -- Shipping
  shipping_method TEXT,
  tracking_number TEXT,
  estimated_delivery DATE,
  
  -- Notes
  customer_notes TEXT,
  admin_notes TEXT,
  
  -- Metadata
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_orders_user_id ON public.orders(user_id);
CREATE INDEX idx_orders_status ON public.orders(status);
CREATE INDEX idx_orders_order_number ON public.orders(order_number);
CREATE INDEX idx_orders_created_at ON public.orders(created_at DESC);

-- =============================================================================
-- ORDER ITEMS TABLE
-- Stores individual items within an order
-- =============================================================================
CREATE TABLE public.order_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
  product_id UUID REFERENCES public.products(id) ON DELETE SET NULL,
  
  -- Product snapshot (denormalized for order history)
  product_title TEXT NOT NULL,
  product_slug TEXT NOT NULL,
  
  -- Configuration snapshot
  configuration JSONB NOT NULL,
  quantity INTEGER NOT NULL CHECK (quantity > 0),
  unit_price DECIMAL(10,2) NOT NULL,
  total_price DECIMAL(10,2) NOT NULL,
  
  -- Linked upload
  upload_id UUID REFERENCES public.uploads(id) ON DELETE SET NULL,
  
  -- Item status (for production tracking)
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN (
    'pending', 'printing', 'quality_check', 'ready', 'shipped'
  )),
  
  -- Metadata
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_order_items_order_id ON public.order_items(order_id);

-- =============================================================================
-- FUNCTIONS
-- =============================================================================

-- Function to generate order numbers
CREATE OR REPLACE FUNCTION generate_order_number()
RETURNS TEXT AS $$
DECLARE
  new_number TEXT;
  year_prefix TEXT;
BEGIN
  year_prefix := TO_CHAR(NOW(), 'YY');
  SELECT 'BD' || year_prefix || '-' || LPAD((COALESCE(MAX(SUBSTRING(order_number FROM 6)::INTEGER), 0) + 1)::TEXT, 6, '0')
  INTO new_number
  FROM public.orders
  WHERE order_number LIKE 'BD' || year_prefix || '-%';
  
  RETURN new_number;
END;
$$ LANGUAGE plpgsql;

-- Trigger to auto-generate order number
CREATE OR REPLACE FUNCTION set_order_number()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.order_number IS NULL THEN
    NEW.order_number := generate_order_number();
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_set_order_number
  BEFORE INSERT ON public.orders
  FOR EACH ROW
  EXECUTE FUNCTION set_order_number();

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply updated_at triggers
CREATE TRIGGER trigger_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER trigger_products_updated_at
  BEFORE UPDATE ON public.products
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER trigger_uploads_updated_at
  BEFORE UPDATE ON public.uploads
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER trigger_cart_items_updated_at
  BEFORE UPDATE ON public.cart_items
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER trigger_orders_updated_at
  BEFORE UPDATE ON public.orders
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

-- =============================================================================
-- HANDLE NEW USER FUNCTION
-- Automatically creates a profile when a new user signs up
-- =============================================================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, is_anonymous)
  VALUES (
    NEW.id,
    NEW.email,
    NEW.is_anonymous
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to create profile on user signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();
