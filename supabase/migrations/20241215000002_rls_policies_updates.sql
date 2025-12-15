-- =============================================================================
-- BANNER DIRECT - RLS POLICIES FOR NEW TABLES
-- =============================================================================

-- =============================================================================
-- CATEGORIES TABLE RLS
-- =============================================================================
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;

-- Anyone can read active categories
CREATE POLICY "Anyone can read active categories"
  ON public.categories
  FOR SELECT
  USING (is_active = true);

-- Admins can do everything with categories
CREATE POLICY "Admins can manage categories"
  ON public.categories
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

-- =============================================================================
-- SHIPPING ZONES TABLE RLS
-- =============================================================================
ALTER TABLE public.shipping_zones ENABLE ROW LEVEL SECURITY;

-- Anyone can read active shipping zones
CREATE POLICY "Anyone can read active shipping zones"
  ON public.shipping_zones
  FOR SELECT
  USING (is_active = true);

-- Admins can do everything with shipping zones
CREATE POLICY "Admins can manage shipping zones"
  ON public.shipping_zones
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

-- =============================================================================
-- SHIPPING RATES TABLE RLS
-- =============================================================================
ALTER TABLE public.shipping_rates ENABLE ROW LEVEL SECURITY;

-- Anyone can read active shipping rates
CREATE POLICY "Anyone can read active shipping rates"
  ON public.shipping_rates
  FOR SELECT
  USING (is_active = true);

-- Admins can do everything with shipping rates
CREATE POLICY "Admins can manage shipping rates"
  ON public.shipping_rates
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

-- =============================================================================
-- LEAD TIMES TABLE RLS
-- =============================================================================
ALTER TABLE public.lead_times ENABLE ROW LEVEL SECURITY;

-- Anyone can read active lead times
CREATE POLICY "Anyone can read active lead times"
  ON public.lead_times
  FOR SELECT
  USING (is_active = true);

-- Admins can do everything with lead times
CREATE POLICY "Admins can manage lead times"
  ON public.lead_times
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

-- =============================================================================
-- TEMPLATES TABLE RLS
-- =============================================================================
ALTER TABLE public.templates ENABLE ROW LEVEL SECURITY;

-- Anyone can read active templates
CREATE POLICY "Anyone can read active templates"
  ON public.templates
  FOR SELECT
  USING (is_active = true);

-- Admins can do everything with templates
CREATE POLICY "Admins can manage templates"
  ON public.templates
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

-- =============================================================================
-- SETTINGS TABLE RLS
-- =============================================================================
ALTER TABLE public.settings ENABLE ROW LEVEL SECURITY;

-- Anyone can read settings (public store config)
CREATE POLICY "Anyone can read settings"
  ON public.settings
  FOR SELECT
  USING (true);

-- Only admins can modify settings
CREATE POLICY "Admins can manage settings"
  ON public.settings
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );
