-- ==============================================================================
-- PROPOSED DATABASE IMAGE UPDATES MIGRATION PLAN
-- File: supabase/migrations/proposed_image_updates.sql
-- Status: PENDING USER APPROVAL (Do not execute without explicit consent)
--
-- Objective:
-- Replace all third-party Unsplash and placeholder URLs in Supabase tables
-- with authentic, verified handloom imagery matching exact craft traditions.
-- ==============================================================================

BEGIN;

-- 1. UPDATE CATEGORIES
UPDATE public.categories
SET image = '/images/categories/sarees.jpg'
WHERE id = 'c0000001-0000-0000-0000-000000000001';

UPDATE public.categories
SET image = '/images/categories/stoles-dupattas.jpg'
WHERE id = 'c0000001-0000-0000-0000-000000000002';

UPDATE public.categories
SET image = '/images/categories/apparel-kurtas.jpg'
WHERE id = 'c0000001-0000-0000-0000-000000000003';

UPDATE public.categories
SET image = '/images/categories/home-textiles.jpg'
WHERE id = 'c0000001-0000-0000-0000-000000000004';


-- 2. UPDATE ARTISAN PROFILES
UPDATE public.artisans
SET image = '/images/artisans/rajeshwar-ansari.jpg'
WHERE id = 'a0000001-0000-0000-0000-000000000001';

UPDATE public.artisans
SET image = '/images/artisans/meera-devi.jpg'
WHERE id = 'a0000001-0000-0000-0000-000000000002';

UPDATE public.artisans
SET image = '/images/artisans/saraswathi-guild.jpg'
WHERE id = 'a0000001-0000-0000-0000-000000000003';

UPDATE public.artisans
SET image = '/images/artisans/ghulam-rasool.jpg'
WHERE id = 'a0000001-0000-0000-0000-000000000004';

UPDATE public.artisans
SET image = '/images/artisans/nila-collective.jpg'
WHERE id = 'a0000001-0000-0000-0000-000000000005';

UPDATE public.artisans
SET image = '/images/artisans/phulia-weavers.jpg'
WHERE id = 'a0000001-0000-0000-0000-000000000006';


-- 3. UPDATE PRODUCT CATALOG IMAGES
UPDATE public.products
SET images = '["/images/products/banarasi-zari-saree.jpg", "/images/360/banarasi-90.jpg"]'::jsonb,
    alt = 'Authentic Shikargah Banarasi Katan Silk Saree in royal crimson with pure gold zari kadwa brocade'
WHERE id = 'b0000001-0000-0000-0000-000000000001';

UPDATE public.products
SET images = '["/images/products/kanchipuram-korvai.jpg", "/images/360/kanchipuram-90.jpg"]'::jsonb,
    alt = 'Peacock green Kanchipuram silk saree with ruby red interlocking Korvai temple borders'
WHERE id = 'b0000001-0000-0000-0000-000000000002';

UPDATE public.products
SET images = '["/images/products/bhagalpuri-silk-stole.jpg"]'::jsonb,
    alt = 'Warm golden handspun Ahimsa Tussar silk stole with natural plant-dyed borders'
WHERE id = 'b0000001-0000-0000-0000-000000000003';

UPDATE public.products
SET images = '["/images/products/pashmina-sozni-shawl.jpg"]'::jsonb,
    alt = 'Master-embroidered Kashmiri sozni pashmina shawl with intricate floral paisley border'
WHERE id = 'b0000001-0000-0000-0000-000000000004';

UPDATE public.products
SET images = '["/images/products/chanderi-silk-saree.jpg"]'::jsonb,
    alt = 'Gossamer sheer ivory Chanderi silk-cotton saree with delicate gold coin motifs'
WHERE id = 'b0000001-0000-0000-0000-000000000005';

UPDATE public.products
SET images = '["/images/products/khadi-linen-kurta.jpg"]'::jsonb,
    alt = 'Hand-printed natural indigo Ajrakh modal silk kurta with authentic desert star motifs'
WHERE id = 'b0000001-0000-0000-0000-000000000006';

UPDATE public.products
SET images = '["/images/products/indigo-throw.jpg"]'::jsonb,
    alt = 'Tactile handwoven Kala cotton throw with extra-weft geometric patterns and artisanal fringe'
WHERE id = 'b0000001-0000-0000-0000-000000000007';

UPDATE public.products
SET images = '["/images/products/patola-scarf.jpg"]'::jsonb,
    alt = 'Royal Yeola Paithani saree in royal magenta with pure gold tapestry peacock pallu'
WHERE id = 'b0000001-0000-0000-0000-000000000008';


-- 4. UPDATE PRODUCT 360° TURNTABLE ROTATION FRAMES
UPDATE public.product_360_images
SET image_url = '/images/360/banarasi-0.jpg'
WHERE product_id = 'b0000001-0000-0000-0000-000000000001' AND sequence_number = 1;

UPDATE public.product_360_images
SET image_url = '/images/360/banarasi-90.jpg'
WHERE product_id = 'b0000001-0000-0000-0000-000000000001' AND sequence_number = 2;

UPDATE public.product_360_images
SET image_url = '/images/360/banarasi-180.jpg'
WHERE product_id = 'b0000001-0000-0000-0000-000000000001' AND sequence_number = 3;

UPDATE public.product_360_images
SET image_url = '/images/360/banarasi-270.jpg'
WHERE product_id = 'b0000001-0000-0000-0000-000000000001' AND sequence_number = 4;

UPDATE public.product_360_images
SET image_url = '/images/360/kanchipuram-0.jpg'
WHERE product_id = 'b0000001-0000-0000-0000-000000000002' AND sequence_number = 1;

UPDATE public.product_360_images
SET image_url = '/images/360/kanchipuram-90.jpg'
WHERE product_id = 'b0000001-0000-0000-0000-000000000002' AND sequence_number = 2;

UPDATE public.product_360_images
SET image_url = '/images/360/kanchipuram-180.jpg'
WHERE product_id = 'b0000001-0000-0000-0000-000000000002' AND sequence_number = 3;

UPDATE public.product_360_images
SET image_url = '/images/360/kanchipuram-270.jpg'
WHERE product_id = 'b0000001-0000-0000-0000-000000000002' AND sequence_number = 4;


-- 5. UPDATE RAW MATERIALS INVENTORY
UPDATE public.raw_materials
SET images = '["/images/raw-materials/raw-silk-filament-hank.jpg"]'::jsonb
WHERE id = 'b1111111-1111-1111-1111-111111111111';

UPDATE public.raw_materials
SET images = '["/images/raw-materials/raw-silk-filament-hank.jpg"]'::jsonb
WHERE id = 'b2222222-2222-2222-2222-222222222222';

UPDATE public.raw_materials
SET images = '["/images/raw-materials/khadi-charkha-yarn.jpg"]'::jsonb
WHERE id = 'b3333333-3333-3333-3333-333333333333';

UPDATE public.raw_materials
SET images = '["/images/raw-materials/ladakhi-pashm-wool-top.jpg"]'::jsonb
WHERE id = 'b4444444-4444-4444-4444-444444444444';

UPDATE public.raw_materials
SET images = '["/images/raw-materials/indigo-dye-extract.jpg"]'::jsonb
WHERE id = 'b5555555-5555-5555-5555-555555555555';

UPDATE public.raw_materials
SET images = '["/images/raw-materials/madder-dye.jpg"]'::jsonb
WHERE id = 'b6666666-6666-6666-6666-666666666666';

UPDATE public.raw_materials
SET images = '["/images/raw-materials/gold-zari-spool.jpg"]'::jsonb
WHERE id = 'b7777777-7777-7777-7777-777777777777';

UPDATE public.raw_materials
SET images = '["/images/raw-materials/teakwood-printing-blocks.jpg"]'::jsonb
WHERE id = 'b8888888-8888-8888-8888-888888888888';

COMMIT;
