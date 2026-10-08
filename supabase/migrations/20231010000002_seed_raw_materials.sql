-- ====================================================================
-- Migration: 20231010000002_seed_raw_materials.sql
-- Description: Enable RLS, grant permissions, and seed catalog data
--              for material_suppliers and raw_materials.
-- ====================================================================

-- 1. Table-level Permissions for Anonymous & Authenticated roles
GRANT SELECT ON TABLE public.material_suppliers TO anon, authenticated;
GRANT SELECT ON TABLE public.raw_materials TO anon, authenticated;
GRANT INSERT ON TABLE public.bulk_requests TO anon, authenticated;

-- Revoke write privileges on catalog tables from anon
REVOKE INSERT, UPDATE, DELETE, TRUNCATE ON TABLE 
  public.material_suppliers,
  public.raw_materials
FROM anon;

-- 2. Ensure Row Level Security is Enabled
ALTER TABLE public.material_suppliers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.raw_materials ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bulk_requests ENABLE ROW LEVEL SECURITY;

-- 3. Idempotent RLS Policies
DROP POLICY IF EXISTS "Public read material suppliers" ON public.material_suppliers;
CREATE POLICY "Public read material suppliers" 
  ON public.material_suppliers 
  FOR SELECT 
  TO anon, authenticated 
  USING (true);

DROP POLICY IF EXISTS "Public read raw materials" ON public.raw_materials;
CREATE POLICY "Public read raw materials" 
  ON public.raw_materials 
  FOR SELECT 
  TO anon, authenticated 
  USING (true);

DROP POLICY IF EXISTS "Anyone can insert bulk requests" ON public.bulk_requests;
CREATE POLICY "Anyone can insert bulk requests" 
  ON public.bulk_requests 
  FOR INSERT 
  TO anon, authenticated 
  WITH CHECK (true);

-- 4. Seed Material Suppliers (Idempotent UPSERT)
INSERT INTO public.material_suppliers (id, name, location, rating, certified, verified_gi, specialty, contact_email)
VALUES
  (
    'a1111111-1111-1111-1111-111111111111',
    'Kanchipuram Silk Reelers Federation',
    'Kanchipuram, Tamil Nadu',
    4.95,
    TRUE,
    TRUE,
    'Mulberry Raw Silk & Degummed Filaments',
    'supply@kanchisilkfederation.org'
  ),
  (
    'a2222222-2222-2222-2222-222222222222',
    'Varanasi Zari & Metallic Guild',
    'Varanasi, Uttar Pradesh',
    4.90,
    TRUE,
    TRUE,
    'Pure Silver Electroplated Gold Zari',
    'guild@varanasizari.in'
  ),
  (
    'a3333333-3333-3333-3333-333333333333',
    'Kutch Organic Indigo & Natural Dye Co-op',
    'Bhuj, Gujarat',
    4.98,
    TRUE,
    TRUE,
    'Bio-Fermented Natural Indigo & Madder',
    'contact@kutchdyecoop.org'
  ),
  (
    'a4444444-4444-4444-4444-444444444444',
    'Changthang Pashmina Herders Union',
    'Leh, Ladakh',
    4.92,
    TRUE,
    TRUE,
    'Raw High-Altitude Pashm Fiber',
    'ladakhpashm@changthang.org'
  ),
  (
    'a5555555-5555-5555-5555-555555555555',
    'Assam Wild Sericulture Cooperative',
    'Sualkuchi, Assam',
    4.88,
    TRUE,
    TRUE,
    'Golden Muga & Wild Forest Tussar Silk',
    'muga@assamwildsilk.org'
  ),
  (
    'a6666666-6666-6666-6666-666666666666',
    'Wardha Khadi & Organic Spinners Guild',
    'Wardha, Maharashtra',
    4.85,
    TRUE,
    TRUE,
    'Hand-Ginned Desi Organic Cotton Yarn',
    'info@wardhakhadi.org'
  )
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  location = EXCLUDED.location,
  rating = EXCLUDED.rating,
  certified = EXCLUDED.certified,
  verified_gi = EXCLUDED.verified_gi,
  specialty = EXCLUDED.specialty,
  contact_email = EXCLUDED.contact_email;

-- 5. Seed Raw Materials (Idempotent UPSERT)
INSERT INTO public.raw_materials (
  id,
  name,
  category,
  material_type,
  origin,
  supplier_id,
  quality,
  quantity_unit,
  price,
  display_price,
  min_order_qty,
  in_stock,
  sustainability_info,
  description,
  images,
  badge,
  denier_or_count
)
VALUES
  (
    'b1111111-1111-1111-1111-111111111111',
    'Grade AAA Mulberry Silk Filament Yarn',
    'Silk Yarn',
    'Mulberry Silk 20/22D',
    'Kanchipuram, Tamil Nadu',
    'a1111111-1111-1111-1111-111111111111',
    'Grade AAA Pure',
    'kg',
    5400.00,
    '₹5,400',
    2,
    TRUE,
    'Rainwater reeled, eco-degummed with zero petrochemical surfactants.',
    'Superior tensile strength Mulberry filament reeled under GI certified standards. Ideal for high-density warp setting in temple border brocades and bridal heirlooms.',
    '["https://images.unsplash.com/photo-1610030469983-98e550d6193c?q=80&w=1200&auto=format&fit=crop"]'::jsonb,
    'GI Certified',
    '20/22 Denier'
  ),
  (
    'b2222222-2222-2222-2222-222222222222',
    'Wild Forest Golden Muga Silk Hanks',
    'Silk Yarn',
    'Wild Muga Reeled Silk',
    'Sualkuchi, Assam',
    'a5555555-5555-5555-5555-555555555555',
    'Grade AAA Pure',
    'kg',
    14200.00,
    '₹14,200',
    1,
    TRUE,
    'Naturally golden wild silkworm filaments, harvested sustainably from Som and Soalu trees.',
    'Rare, non-bleached golden silk with perpetual natural sheen. Gains lustrous sheen with each wash and lasts over a century.',
    '["https://images.unsplash.com/photo-1558171813-4c088753af8f?q=80&w=1200&auto=format&fit=crop"]'::jsonb,
    'GI Certified',
    '32/34 Denier'
  ),
  (
    'b3333333-3333-3333-3333-333333333333',
    'Desi Organic Khadi Cotton Hanks (100s Count)',
    'Cotton Yarn',
    'Desi Khadi Cotton',
    'Wardha, Maharashtra',
    'a6666666-6666-6666-6666-666666666666',
    'Certified Organic',
    'kg',
    1850.00,
    '₹1,850',
    5,
    TRUE,
    'Rain-fed indigenous Karunganni seeds, hand-spun on Amber Charkha with zero synthetic sizing.',
    'Breathable, ultra-soft high count cotton hanks suited for gossamer muslin wefts and daily artisan handlooms.',
    '["https://images.unsplash.com/photo-1606744824163-985d376605aa?q=80&w=1200&auto=format&fit=crop"]'::jsonb,
    'Certified Organic',
    '100s Count'
  ),
  (
    'b4444444-4444-4444-4444-444444444444',
    'Raw Changthangi Cashmere (Pashm) Fiber',
    'Wool',
    'Raw Pashm Fleece',
    'Leh, Ladakh',
    'a4444444-4444-4444-4444-444444444444',
    'Hand-spun Artisan',
    'kg',
    18500.00,
    '₹18,500',
    1,
    TRUE,
    'Ethically combed during natural spring molting by nomadic Changpa pastoralists at 14,000 feet.',
    'Finest 12-14 micron unspun raw cashmere wool combings with extraordinary insulation properties.',
    '["https://images.unsplash.com/photo-1584917865442-de89df76afd3?q=80&w=1200&auto=format&fit=crop"]'::jsonb,
    'Direct Guild',
    '12-14 Micron'
  ),
  (
    'b5555555-5555-5555-5555-555555555555',
    'Pure Organic Indigofera Tinctoria Cakes',
    'Indigo',
    'Natural Indigo Pigment',
    'Bhuj, Gujarat',
    'a3333333-3333-3333-3333-333333333333',
    'Certified Organic',
    'kg',
    3200.00,
    '₹3,200',
    2,
    TRUE,
    'Fermented using jaggery, lime, and wood-ash water in subterranean terracotta vats.',
    'High-purity organic natural indigo extract containing 45%+ indigotin. Delivers deep, lightfast midnight blues for Ajrakh and tie-dye resist crafts.',
    '["https://images.unsplash.com/photo-1490751907972-0ae72a22f0ba?q=80&w=1200&auto=format&fit=crop"]'::jsonb,
    'Organic Vat',
    'Pre-ferment pigment'
  ),
  (
    'b6666666-6666-6666-6666-666666666666',
    'Madder Root (Manjistha) Sun-Dried Chunks',
    'Natural Dyes',
    'Botanical Colorant',
    'Bhuj, Gujarat',
    'a3333333-3333-3333-3333-333333333333',
    'Certified Organic',
    'kg',
    850.00,
    '₹850',
    5,
    TRUE,
    'Wild-harvested Rubia cordifolia roots, washed and solar-cured without chemical stabilizers.',
    'Produces rich earthy rusts, deep vermilions, and rubies when paired with alum or harda mordants.',
    '["https://images.unsplash.com/photo-1605000797499-95a51c5269ae?q=80&w=1200&auto=format&fit=crop"]'::jsonb,
    'Organic Vat',
    'Roots chunks'
  ),
  (
    'b7777777-7777-7777-7777-777777777777',
    '24K Electroplated Silver-Gold Zari Spool',
    'Weaving Materials',
    'Metallic Weaving Thread',
    'Varanasi, Uttar Pradesh',
    'a2222222-2222-2222-2222-222222222222',
    'Pure Metallic',
    'spool',
    8800.00,
    '₹8,800',
    1,
    TRUE,
    'Recycled high-conductivity silver core wrapped on natural silk base with micro-fine gold layer.',
    'Authentic Banarasi test-pass metallic thread. Does not tarnish, crack, or discolor when exposed to humidity and heirloom aging.',
    '["https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=1200&auto=format&fit=crop"]'::jsonb,
    'Direct Guild',
    '240/2 Zari Core'
  ),
  (
    'b8888888-8888-8888-8888-888888888888',
    'Hand-Carved Teakwood Block Print Blocks (Set of 4)',
    'Craft Accessories',
    'Carved Printing Blocks',
    'Bhuj, Gujarat',
    'a3333333-3333-3333-3333-333333333333',
    'Hand-spun Artisan',
    'set',
    2600.00,
    '₹2,600',
    1,
    TRUE,
    'Seasoned salvage CP teak, carved with hand gouges and pre-soaked in mustard oil for longevity.',
    'Set of 4 interlocking outline (Rekh) and filler (Gad/Datta) blocks for multi-color traditional Bagru and Ajrakh botanical motifs.',
    '["https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=1200&auto=format&fit=crop"]'::jsonb,
    'Artisan Grade',
    '4-Block Motif Set'
  )
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  category = EXCLUDED.category,
  material_type = EXCLUDED.material_type,
  origin = EXCLUDED.origin,
  supplier_id = EXCLUDED.supplier_id,
  quality = EXCLUDED.quality,
  quantity_unit = EXCLUDED.quantity_unit,
  price = EXCLUDED.price,
  display_price = EXCLUDED.display_price,
  min_order_qty = EXCLUDED.min_order_qty,
  in_stock = EXCLUDED.in_stock,
  sustainability_info = EXCLUDED.sustainability_info,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  badge = EXCLUDED.badge,
  denier_or_count = EXCLUDED.denier_or_count;
