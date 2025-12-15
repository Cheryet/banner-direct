-- =============================================================================
-- MIGRATION: Split full_name into first_name and last_name
-- =============================================================================
-- This migration updates the profiles table to use separate first_name and 
-- last_name fields instead of a single full_name field, and ensures phone
-- is properly captured during signup.
-- =============================================================================

-- Add new columns
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS first_name TEXT,
ADD COLUMN IF NOT EXISTS last_name TEXT;

-- Migrate existing data: split full_name into first_name and last_name
UPDATE public.profiles
SET 
  first_name = SPLIT_PART(full_name, ' ', 1),
  last_name = CASE 
    WHEN POSITION(' ' IN full_name) > 0 
    THEN SUBSTRING(full_name FROM POSITION(' ' IN full_name) + 1)
    ELSE NULL
  END
WHERE full_name IS NOT NULL AND first_name IS NULL;

-- Drop the old full_name column
ALTER TABLE public.profiles DROP COLUMN IF EXISTS full_name;

-- Update the handle_new_user function to use new fields
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, first_name, last_name, phone, is_anonymous)
  VALUES (
    NEW.id,
    NEW.email,
    NEW.raw_user_meta_data->>'first_name',
    NEW.raw_user_meta_data->>'last_name',
    NEW.raw_user_meta_data->>'phone',
    COALESCE(NEW.is_anonymous, false)
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
