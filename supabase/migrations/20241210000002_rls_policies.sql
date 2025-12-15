-- =============================================================================
-- BANNER DIRECT - ROW LEVEL SECURITY POLICIES
-- =============================================================================
-- Implements secure access control for:
-- - Anonymous users (browse, cart, uploads)
-- - Permanent users (full account access)
-- - Admin users (full system access)
-- =============================================================================

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.uploads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cart_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;

-- =============================================================================
-- HELPER FUNCTIONS FOR RLS
-- =============================================================================

-- Check if current user is admin
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid()
    AND role = 'admin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;

-- Get current user's role
CREATE OR REPLACE FUNCTION public.get_user_role()
RETURNS TEXT AS $$
BEGIN
  RETURN (
    SELECT role FROM public.profiles
    WHERE id = auth.uid()
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;

-- =============================================================================
-- PROFILES POLICIES
-- =============================================================================

-- Users can read their own profile
CREATE POLICY "Users can read own profile"
  ON public.profiles
  FOR SELECT
  USING (auth.uid() = id);

-- Users can update their own profile (except role)
CREATE POLICY "Users can update own profile"
  ON public.profiles
  FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (
    auth.uid() = id
    -- Prevent users from changing their own role
    AND (
      role = (SELECT role FROM public.profiles WHERE id = auth.uid())
      OR public.is_admin()
    )
  );

-- Admins can read all profiles
CREATE POLICY "Admins can read all profiles"
  ON public.profiles
  FOR SELECT
  USING (public.is_admin());

-- Admins can update all profiles
CREATE POLICY "Admins can update all profiles"
  ON public.profiles
  FOR UPDATE
  USING (public.is_admin());

-- =============================================================================
-- PRODUCTS POLICIES
-- =============================================================================

-- Anyone can read active products (public catalog)
CREATE POLICY "Anyone can read active products"
  ON public.products
  FOR SELECT
  USING (is_active = true);

-- Admins can read all products (including inactive)
CREATE POLICY "Admins can read all products"
  ON public.products
  FOR SELECT
  USING (public.is_admin());

-- Admins can insert products
CREATE POLICY "Admins can insert products"
  ON public.products
  FOR INSERT
  WITH CHECK (public.is_admin());

-- Admins can update products
CREATE POLICY "Admins can update products"
  ON public.products
  FOR UPDATE
  USING (public.is_admin());

-- Admins can delete products
CREATE POLICY "Admins can delete products"
  ON public.products
  FOR DELETE
  USING (public.is_admin());

-- =============================================================================
-- UPLOADS POLICIES
-- =============================================================================

-- Users can read their own uploads
CREATE POLICY "Users can read own uploads"
  ON public.uploads
  FOR SELECT
  USING (auth.uid() = user_id);

-- Users can insert their own uploads
CREATE POLICY "Users can insert own uploads"
  ON public.uploads
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Users can delete their own uploads (if not yet used in order)
CREATE POLICY "Users can delete own uploads"
  ON public.uploads
  FOR DELETE
  USING (
    auth.uid() = user_id
    AND NOT EXISTS (
      SELECT 1 FROM public.order_items
      WHERE upload_id = uploads.id
    )
  );

-- Admins can read all uploads
CREATE POLICY "Admins can read all uploads"
  ON public.uploads
  FOR SELECT
  USING (public.is_admin());

-- Admins can update uploads (for approval/rejection)
CREATE POLICY "Admins can update uploads"
  ON public.uploads
  FOR UPDATE
  USING (public.is_admin());

-- =============================================================================
-- CART ITEMS POLICIES
-- =============================================================================

-- Users can read their own cart
CREATE POLICY "Users can read own cart"
  ON public.cart_items
  FOR SELECT
  USING (auth.uid() = user_id);

-- Users can insert into their own cart
CREATE POLICY "Users can insert into own cart"
  ON public.cart_items
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Users can update their own cart items
CREATE POLICY "Users can update own cart"
  ON public.cart_items
  FOR UPDATE
  USING (auth.uid() = user_id);

-- Users can delete from their own cart
CREATE POLICY "Users can delete from own cart"
  ON public.cart_items
  FOR DELETE
  USING (auth.uid() = user_id);

-- Admins can read all carts
CREATE POLICY "Admins can read all carts"
  ON public.cart_items
  FOR SELECT
  USING (public.is_admin());

-- =============================================================================
-- ORDERS POLICIES
-- =============================================================================

-- Users can read their own orders
CREATE POLICY "Users can read own orders"
  ON public.orders
  FOR SELECT
  USING (auth.uid() = user_id);

-- Users can insert orders (checkout)
CREATE POLICY "Users can create orders"
  ON public.orders
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Admins can read all orders
CREATE POLICY "Admins can read all orders"
  ON public.orders
  FOR SELECT
  USING (public.is_admin());

-- Admins can update orders
CREATE POLICY "Admins can update orders"
  ON public.orders
  FOR UPDATE
  USING (public.is_admin());

-- =============================================================================
-- ORDER ITEMS POLICIES
-- =============================================================================

-- Users can read their own order items
CREATE POLICY "Users can read own order items"
  ON public.order_items
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.orders
      WHERE orders.id = order_items.order_id
      AND orders.user_id = auth.uid()
    )
  );

-- Users can insert order items (during checkout)
CREATE POLICY "Users can create order items"
  ON public.order_items
  FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.orders
      WHERE orders.id = order_items.order_id
      AND orders.user_id = auth.uid()
    )
  );

-- Admins can read all order items
CREATE POLICY "Admins can read all order items"
  ON public.order_items
  FOR SELECT
  USING (public.is_admin());

-- Admins can update order items
CREATE POLICY "Admins can update order items"
  ON public.order_items
  FOR UPDATE
  USING (public.is_admin());

-- =============================================================================
-- STORAGE POLICIES (for file uploads)
-- =============================================================================
-- Note: These are applied via Supabase Dashboard or separate storage policies
-- The bucket should be named 'uploads' with the following policies:
--
-- SELECT: auth.uid() = (storage.foldername(name))[1]::uuid OR is_admin()
-- INSERT: auth.uid() = (storage.foldername(name))[1]::uuid
-- DELETE: auth.uid() = (storage.foldername(name))[1]::uuid OR is_admin()
