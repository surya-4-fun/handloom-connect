-- Supabase PostgreSQL Schema for Handloom Connect

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- --------------------------------------------------------------------
-- 1. Users Table (Extends Supabase auth.users)
-- --------------------------------------------------------------------
CREATE TABLE public.users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL UNIQUE,
  full_name TEXT NOT NULL,
  avatar_url TEXT,
  role TEXT NOT NULL DEFAULT 'customer' CHECK (role IN ('customer', 'artisan', 'admin')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- --------------------------------------------------------------------
-- 2. User Addresses Table
-- --------------------------------------------------------------------
CREATE TABLE public.user_addresses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  type TEXT NOT NULL DEFAULT 'shipping' CHECK (type IN ('billing', 'shipping')),
  full_name TEXT NOT NULL,
  address_line1 TEXT NOT NULL,
  address_line2 TEXT,
  city TEXT NOT NULL,
  state TEXT NOT NULL,
  postal_code TEXT NOT NULL,
  country TEXT NOT NULL DEFAULT 'India',
  is_default BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- --------------------------------------------------------------------
-- 3. User Preferences Table
-- --------------------------------------------------------------------
CREATE TABLE public.user_preferences (
  user_id UUID PRIMARY KEY REFERENCES public.users(id) ON DELETE CASCADE,
  newsletter BOOLEAN NOT NULL DEFAULT TRUE,
  currency TEXT NOT NULL DEFAULT 'INR' CHECK (currency IN ('INR', 'USD', 'EUR', 'GBP')),
  theme TEXT NOT NULL DEFAULT 'dark' CHECK (theme IN ('system', 'light', 'dark')),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- --------------------------------------------------------------------
-- 4. Categories Table
-- --------------------------------------------------------------------
CREATE TABLE public.categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  label TEXT NOT NULL,
  image TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- --------------------------------------------------------------------
-- 5. Artisans Table
-- --------------------------------------------------------------------
CREATE TABLE public.artisans (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  title TEXT,
  region TEXT NOT NULL,
  craft TEXT NOT NULL,
  specialty TEXT,
  experience TEXT NOT NULL,
  bio TEXT NOT NULL,
  story TEXT,
  techniques JSONB,
  cultural_background TEXT,
  community_impact JSONB,
  image TEXT NOT NULL,
  is_featured BOOLEAN NOT NULL DEFAULT FALSE,
  is_collective BOOLEAN NOT NULL DEFAULT FALSE,
  follower_count INTEGER NOT NULL DEFAULT 0,
  support_count INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- --------------------------------------------------------------------
-- 6. Products Table
-- --------------------------------------------------------------------
CREATE TABLE public.products (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  category_id UUID NOT NULL REFERENCES public.categories(id) ON DELETE RESTRICT,
  price DECIMAL(10, 2) NOT NULL,
  display_price TEXT NOT NULL,
  images JSONB NOT NULL,
  alt TEXT NOT NULL,
  material TEXT NOT NULL,
  region TEXT NOT NULL,
  technique TEXT NOT NULL,
  artisan_id UUID NOT NULL REFERENCES public.artisans(id) ON DELETE RESTRICT,
  description TEXT NOT NULL,
  dimensions TEXT,
  care TEXT,
  provenance TEXT,
  badge TEXT,
  in_stock BOOLEAN NOT NULL DEFAULT TRUE,
  stock_quantity INTEGER NOT NULL DEFAULT 10,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- --------------------------------------------------------------------
-- 7. Authenticity Passports Table
-- --------------------------------------------------------------------
CREATE TABLE public.authenticity_passports (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id UUID NOT NULL UNIQUE REFERENCES public.products(id) ON DELETE CASCADE,
  verification_status TEXT NOT NULL DEFAULT 'GI Associated Craft',
  handwoven_verified BOOLEAN NOT NULL DEFAULT TRUE,
  origin_verified BOOLEAN NOT NULL DEFAULT TRUE,
  gi_registry_no TEXT NOT NULL,
  silk_mark_no TEXT NOT NULL,
  loom_type TEXT NOT NULL,
  warp_thread_count TEXT NOT NULL,
  weave_density TEXT NOT NULL,
  cultural_story TEXT NOT NULL,
  craft_journey JSONB NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- --------------------------------------------------------------------
-- 7b. Product 360° Rotating Angle Images Table
-- --------------------------------------------------------------------
CREATE TABLE public.product_360_images (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  image_url TEXT NOT NULL,
  sequence_number INTEGER NOT NULL,
  angle_label TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (product_id, sequence_number)
);

-- --------------------------------------------------------------------
-- 8. Material Suppliers Table
-- --------------------------------------------------------------------
CREATE TABLE public.material_suppliers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  location TEXT NOT NULL,
  rating DECIMAL(3, 2) NOT NULL DEFAULT 4.90,
  certified BOOLEAN NOT NULL DEFAULT TRUE,
  verified_gi BOOLEAN NOT NULL DEFAULT TRUE,
  specialty TEXT NOT NULL,
  contact_email TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- --------------------------------------------------------------------
-- 9. Raw Materials Table
-- --------------------------------------------------------------------
CREATE TABLE public.raw_materials (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  material_type TEXT NOT NULL,
  origin TEXT NOT NULL,
  supplier_id UUID NOT NULL REFERENCES public.material_suppliers(id) ON DELETE RESTRICT,
  quality TEXT NOT NULL,
  quantity_unit TEXT NOT NULL,
  price DECIMAL(10, 2) NOT NULL,
  display_price TEXT NOT NULL,
  min_order_qty INTEGER NOT NULL DEFAULT 1,
  in_stock BOOLEAN NOT NULL DEFAULT TRUE,
  sustainability_info TEXT NOT NULL,
  description TEXT NOT NULL,
  images JSONB NOT NULL,
  badge TEXT,
  denier_or_count TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- --------------------------------------------------------------------
-- 10. Cart Items Table
-- --------------------------------------------------------------------
CREATE TABLE public.cart_items (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  quantity INTEGER NOT NULL DEFAULT 1,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (user_id, product_id)
);

-- --------------------------------------------------------------------
-- 11. Wishlist Items Table
-- --------------------------------------------------------------------
CREATE TABLE public.wishlist_items (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (user_id, product_id)
);

-- --------------------------------------------------------------------
-- 12. Artisan Follows Table
-- --------------------------------------------------------------------
CREATE TABLE public.artisan_follows (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  artisan_id UUID NOT NULL REFERENCES public.artisans(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (user_id, artisan_id)
);

-- --------------------------------------------------------------------
-- 13. Orders Table
-- --------------------------------------------------------------------
CREATE TABLE public.orders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
  shipping_address JSONB NOT NULL,
  delivery_method JSONB NOT NULL,
  payment_details JSONB NOT NULL,
  subtotal DECIMAL(10, 2) NOT NULL,
  shipping_fee DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
  gift_box_fee DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
  tax_fee DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
  total_amount DECIMAL(10, 2) NOT NULL,
  status TEXT NOT NULL DEFAULT 'commissioned' CHECK (status IN ('commissioned', 'yarn_washing', 'organic_dyeing', 'warp_prep', 'weaving_in_progress', 'quality_audit', 'dispatched', 'delivered')),
  current_stage INTEGER NOT NULL DEFAULT 0,
  total_hours INTEGER NOT NULL DEFAULT 120,
  completed_hours INTEGER NOT NULL DEFAULT 12,
  estimated_delivery TEXT NOT NULL,
  silk_mark_no TEXT NOT NULL,
  gi_tag_no TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- --------------------------------------------------------------------
-- 14. Order Items Table
-- --------------------------------------------------------------------
CREATE TABLE public.order_items (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE RESTRICT,
  name TEXT NOT NULL,
  price DECIMAL(10, 2) NOT NULL,
  display_price TEXT NOT NULL,
  quantity INTEGER NOT NULL DEFAULT 1,
  image TEXT NOT NULL,
  craft TEXT NOT NULL,
  artisan_name TEXT NOT NULL,
  cluster TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- --------------------------------------------------------------------
-- 15. Bulk B2B Requests Table
-- --------------------------------------------------------------------
CREATE TABLE public.bulk_requests (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  reference_no TEXT NOT NULL UNIQUE,
  material_id UUID NOT NULL REFERENCES public.raw_materials(id) ON DELETE RESTRICT,
  material_name TEXT NOT NULL,
  requested_qty INTEGER NOT NULL,
  unit TEXT NOT NULL,
  artisan_name TEXT NOT NULL,
  organization_name TEXT,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  notes TEXT,
  color_shade_ref TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- --------------------------------------------------------------------
-- 16. Contact Inquiries Table
-- --------------------------------------------------------------------
CREATE TABLE public.contact_inquiries (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  message TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- --------------------------------------------------------------------
-- Row Level Security (RLS) Policies
-- --------------------------------------------------------------------

-- Enable RLS on all tables
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_addresses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.artisans ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.authenticity_passports ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_360_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.material_suppliers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.raw_materials ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cart_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.wishlist_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.artisan_follows ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bulk_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contact_inquiries ENABLE ROW LEVEL SECURITY;

-- 1. Users can read and update their own profiles
CREATE POLICY "Users can read own profile" ON public.users FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON public.users FOR UPDATE USING (auth.uid() = id);

-- 2. User Addresses: users can manage their own
CREATE POLICY "Users manage own addresses" ON public.user_addresses FOR ALL USING (auth.uid() = user_id);

-- 3. User Preferences: users can manage their own
CREATE POLICY "Users manage own preferences" ON public.user_preferences FOR ALL USING (auth.uid() = user_id);

-- 4. Public access for reading catalog data
CREATE POLICY "Public read categories" ON public.categories FOR SELECT USING (true);
CREATE POLICY "Public read artisans" ON public.artisans FOR SELECT USING (true);
CREATE POLICY "Public read products" ON public.products FOR SELECT USING (true);
CREATE POLICY "Public read passports" ON public.authenticity_passports FOR SELECT USING (true);
CREATE POLICY "Public read 360 images" ON public.product_360_images FOR SELECT USING (true);
CREATE POLICY "Public read material suppliers" ON public.material_suppliers FOR SELECT USING (true);
CREATE POLICY "Public read raw materials" ON public.raw_materials FOR SELECT USING (true);

-- 5. Cart Items: users can manage their own
CREATE POLICY "Users manage own cart" ON public.cart_items FOR ALL USING (auth.uid() = user_id);

-- 6. Wishlist Items: users can manage their own
CREATE POLICY "Users manage own wishlist" ON public.wishlist_items FOR ALL USING (auth.uid() = user_id);

-- 7. Artisan Follows: users can manage their own
CREATE POLICY "Users manage own follows" ON public.artisan_follows FOR ALL USING (auth.uid() = user_id);

-- 8. Orders: users can read their own orders. Only backend/functions should insert securely if payment involved, but we allow insert for authenticated users for this migration.
CREATE POLICY "Users can view own orders" ON public.orders FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create own orders" ON public.orders FOR INSERT WITH CHECK (auth.uid() = user_id);

-- 9. Order Items: users can view their own order items
CREATE POLICY "Users can view own order items" ON public.order_items FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.orders WHERE orders.id = order_items.order_id AND orders.user_id = auth.uid())
);
CREATE POLICY "Users can insert own order items" ON public.order_items FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM public.orders WHERE orders.id = order_items.order_id AND orders.user_id = auth.uid())
);

-- 10. Contact Inquiries & Bulk Requests: Anyone can insert
CREATE POLICY "Anyone can insert contact inquiries" ON public.contact_inquiries FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can insert bulk requests" ON public.bulk_requests FOR INSERT WITH CHECK (true);
