-- Supabase Seed Catalog for Handloom Connect
-- Coherent development catalog populating Categories, Artisans, Products,
-- Authenticity Passports, and 360-degree images.
-- Safe to run idempotently (uses ON CONFLICT clauses).

-- --------------------------------------------------------------------
-- 1. Seed Categories
-- --------------------------------------------------------------------
INSERT INTO public.categories (id, label, image)
VALUES
  (
    'c0000001-0000-0000-0000-000000000001',
    'Sarees',
    'https://images.unsplash.com/photo-1610030469983-98e550d6193c?q=80&w=800&auto=format&fit=crop'
  ),
  (
    'c0000001-0000-0000-0000-000000000002',
    'Stoles & Dupattas',
    'https://images.unsplash.com/photo-1606744824163-985d376605aa?q=80&w=800&auto=format&fit=crop'
  ),
  (
    'c0000001-0000-0000-0000-000000000003',
    'Apparel & Kurtas',
    'https://images.unsplash.com/photo-1558171813-4c088753af8f?q=80&w=800&auto=format&fit=crop'
  ),
  (
    'c0000001-0000-0000-0000-000000000004',
    'Home Textiles & Throws',
    'https://images.unsplash.com/photo-1490751907972-0ae72a22f0ba?q=80&w=800&auto=format&fit=crop'
  )
ON CONFLICT (id) DO UPDATE SET
  label = EXCLUDED.label,
  image = EXCLUDED.image;

-- --------------------------------------------------------------------
-- 2. Seed Artisans
-- --------------------------------------------------------------------
INSERT INTO public.artisans (
  id, name, title, region, craft, specialty, experience, bio, story,
  techniques, cultural_background, community_impact, image, is_featured, is_collective,
  follower_count, support_count
)
VALUES
  (
    'a0000001-0000-0000-0000-000000000001',
    'Rajeshwar Ansari',
    'Heritage Banarasi Master Weaver',
    'Varanasi, Uttar Pradesh',
    'Banarasi Brocade Weaving',
    'Real Gold Zari Katan Silk & Kadwa Weave',
    '42 Years',
    'A third-generation master weaver specialising in real zari katan silk brocade on traditional pit looms. His sarees have been exhibited at the National Handloom Expo.',
    'Inheriting the pit loom techniques from his grandfather, Rajeshwar Ansari has dedicated four decades to preserving Mughal-inspired brocade motifs. He designs intricate hand-drawn Naksha paper cards that guide every movement of the wooden Jacquard harness, creating heirlooms that take up to 45 days of continuous handwork.',
    '["Kadwa Hand-Brocade", "Tanchoi Double Warp", "Real Zari Interlock", "Hand-drawn Naksha Harness"]'::jsonb,
    'Varanasi Weaving Heritage dating back to Mughal royal patronage (16th Century). Recipient of the National Craft Award.',
    '{"activeLooms": 18, "fairWagePercentage": 100, "apprenticesTrained": 45, "summary": "Sustains 18 artisan families in Varanasi with guaranteed direct trade wages."}'::jsonb,
    'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=800&auto=format&fit=crop',
    TRUE,
    FALSE,
    340,
    128
  ),
  (
    'a0000001-0000-0000-0000-000000000002',
    'Meera Devi',
    'Master Tussar Silk & Botanical Dyer',
    'Bhagalpur, Bihar',
    'Tussar Silk & Natural Dyes',
    'Wild Cocoons & Botanical Plant Fermentation',
    '34 Years',
    'Preserving three-generation silk spinning traditions using indigenous cocoons and botanical plant extracts. Her textiles have been shown at global craft biennales.',
    'Meera Devi leads a network of rural women spinners across the Chota Nagpur plateau who gather wild forest cocoons without harming the silk moth (Ahimsa Silk). She brews natural dyes from madder roots, marigold petals, and pomegranate rinds, producing golden-patina textiles with zero synthetic chemicals.',
    '["Ahimsa Silk Reel", "Botanical Dye Vat", "Hand-thrown Slub Weave", "Matka Silk Spun Yarn"]'::jsonb,
    'Traditional Bhagalpur Silk Spinning Cluster (Silkworm Forest Heritage). Featured in the Delhi Craft Biennale.',
    '{"activeLooms": 24, "fairWagePercentage": 100, "apprenticesTrained": 60, "summary": "Empowers over 60 indigenous female cocoon harvesters and yarn spinners."}'::jsonb,
    'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=800&auto=format&fit=crop',
    TRUE,
    FALSE,
    512,
    210
  ),
  (
    'a0000001-0000-0000-0000-000000000003',
    'Saraswathi Weavers Guild',
    'Kanchipuram Silk Women Cooperative',
    'Kanchipuram, Tamil Nadu',
    'Kanchipuram Silk Weaving',
    'Korvai Interlock & Heavy Gold Zari Temple Borders',
    '60+ Years (Guild)',
    'A women-led cooperative preserving the Korvai technique — interlocking warp and weft to create signature temple borders that define Kanchipuram silk.',
    'Founded in 1964, the Saraswathi Guild is a community-owned weaving sanctuary where two weavers operate each loom in perfect synchronization. One weaver throws the shuttle for the main body while the other weaves the interlocking gold zari border (Korvai), achieving legendary border strength and structural brilliance.',
    '["Korvai Double-Shuttle Interlock", "Three-Shuttle Petni Weave", "Mulberry Heavy Silk Twill", "Pure Gold Electroplate Zari"]'::jsonb,
    'Kanchipuram GI Tagged Silk Loom Heritage (Dating over 400 years to Chola Royal Dynasty).',
    '{"activeLooms": 32, "fairWagePercentage": 100, "apprenticesTrained": 90, "summary": "Guarantees pension, health benefits, and loom ownership for 32 female master weavers."}'::jsonb,
    'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?q=80&w=800&auto=format&fit=crop',
    TRUE,
    TRUE,
    680,
    315
  ),
  (
    'a0000001-0000-0000-0000-000000000004',
    'Ghulam Rasool & Sons',
    'Master Sozni Needle Embroiderers',
    'Srinagar, Jammu & Kashmir',
    'Sozni Pashmina Embroidery',
    'Handspun Pashm Wool & Fine Sozni Needlework',
    '38 Years',
    'Custodians of the sozni needle embroidery tradition on handspun Changthangi pashmina. Each shawl takes 4–8 months to complete.',
    'Operating from an historic atelier overlooking the Jhelum River, Ghulam Rasool and his sons hand-comb winter undercoat wool shed by high-altitude Changthangi goats in Ladakh (14,000+ ft). Using needles fine as human hair, they embroider intricate Paisley (Kalka) and Floral (Jal) motifs into pure pashm fabric.',
    '["Sozni Fine Needle Work", "Changthangi Hand-Spinning", "Kalka Paisley Motifs", "Natural Walnut Husk Dyeing"]'::jsonb,
    'Kashmiri Craft Heritage certified under UNESCO Intangible Cultural Register.',
    '{"activeLooms": 12, "fairWagePercentage": 100, "apprenticesTrained": 28, "summary": "Protects endangered Kashmiri needlecraft with living apprentice stipends."}'::jsonb,
    'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=800&auto=format&fit=crop',
    TRUE,
    FALSE,
    420,
    195
  ),
  (
    'a0000001-0000-0000-0000-000000000005',
    'Ismail Khatri',
    'Master Ajrakh Block Printer',
    'Dhamadka, Kutch, Gujarat',
    'Natural Dye Ajrakh Block Printing',
    '16-Stage Resist Indigo & Madder Printing',
    '29 Years',
    'Practicing the 16-stage resist dyeing craft using hand-carved teakwood blocks and river washing techniques.',
    'The Khatri community has practiced resist block printing in Kutch for nine generations. Ismail prepares natural indigo vats with lime, jaggery, and dates, imprinting geometric star alignments into fine cotton and modal silks using mineral mordants.',
    '["Teakwood Resist Block Print", "Indigo Subterranean Vat", "Alum & Harda Mordanting", "Kutch River Bed Washing"]'::jsonb,
    'Indus Valley Civilization Dyeing Lineage preserved across the Great Rann of Kutch.',
    '{"activeLooms": 16, "fairWagePercentage": 100, "apprenticesTrained": 40, "summary": "Empowers 40 rural block carvers and washermen in Dhamadka village."}'::jsonb,
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=800&auto=format&fit=crop',
    FALSE,
    FALSE,
    310,
    142
  ),
  (
    'a0000001-0000-0000-0000-000000000006',
    'Devendra Vankar',
    'Vankar Weaving Collective',
    'Bhujodi, Gujarat',
    'Kutch Extra-Weft Handloom',
    'Indigenous Kala Cotton & Desi Wool Weaving',
    '24 Years',
    'Leading a collective of Vankar weavers weaving rain-fed indigenous Kala cotton on traditional pit looms.',
    'Devendra works exclusively with Kala cotton—a purely rain-fed, organic fiber native to Kutch that requires zero chemical pesticides. Using extra-weft insertion with fingers, the Vankars create tactile geometric patterns reflecting nomadic Maldhari pastoral traditions.',
    '["Extra-Weft Finger Insertion", "Pit Loom Throw-Shuttle", "Rain-fed Kala Cotton Prep", "Natural Ochre & Clay Dyes"]'::jsonb,
    'Bhujodi Vankar Craft Lineage dating over 500 years in the desert interior.',
    '{"activeLooms": 20, "fairWagePercentage": 100, "apprenticesTrained": 50, "summary": "Revitalized rain-fed Kala cotton agriculture for over 50 farming and weaving households."}'::jsonb,
    'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=800&auto=format&fit=crop',
    FALSE,
    TRUE,
    390,
    175
  )
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  title = EXCLUDED.title,
  region = EXCLUDED.region,
  craft = EXCLUDED.craft,
  specialty = EXCLUDED.specialty,
  experience = EXCLUDED.experience,
  bio = EXCLUDED.bio,
  story = EXCLUDED.story,
  techniques = EXCLUDED.techniques,
  cultural_background = EXCLUDED.cultural_background,
  community_impact = EXCLUDED.community_impact,
  image = EXCLUDED.image,
  is_featured = EXCLUDED.is_featured,
  is_collective = EXCLUDED.is_collective,
  follower_count = EXCLUDED.follower_count,
  support_count = EXCLUDED.support_count;

-- --------------------------------------------------------------------
-- 3. Seed Products
-- --------------------------------------------------------------------
INSERT INTO public.products (
  id, name, slug, category_id, price, display_price, images, alt,
  material, region, technique, artisan_id, description, dimensions,
  care, provenance, badge, in_stock, stock_quantity
)
VALUES
  (
    'b0000001-0000-0000-0000-000000000001',
    'Shikargah Katan Silk Banarasi Saree',
    'shikargah-katan-silk-banarasi',
    'c0000001-0000-0000-0000-000000000001',
    48500.00,
    '₹48,500',
    '["https://images.unsplash.com/photo-1610030469983-98e550d6193c?q=80&w=1200&auto=format&fit=crop", "https://images.unsplash.com/photo-1584917865442-de89df76afd3?q=80&w=1200&auto=format&fit=crop"]'::jsonb,
    'Royal Shikargah Banarasi Katan Silk Saree in deep crimson with real gold zari',
    'Pure Katan Silk & Electroplated Gold Zari',
    'Varanasi, Uttar Pradesh',
    'Kadwa Hand-Brocade Weave',
    'a0000001-0000-0000-0000-000000000001',
    'Woven over 38 days on a traditional Varanasi pit loom, this Shikargah saree depicts royal Mughal flora and fauna motifs using the labor-intensive Kadwa technique where each motif is individually locked by hand shuttle.',
    '5.5m Saree + 0.8m Blouse Piece',
    'Dry clean only. Store wrapped in unbleached muslin cloth with natural cedar balls.',
    'GI Registry Tag #AU/482/GI/12/5. Weaved in Varanasi Old City Cluster.',
    'Bestseller',
    TRUE,
    3
  ),
  (
    'b0000001-0000-0000-0000-000000000002',
    'Korvai Temple Border Kanchipuram Silk Saree',
    'korvai-temple-border-kanchipuram',
    'c0000001-0000-0000-0000-000000000001',
    39200.00,
    '₹39,200',
    '["https://images.unsplash.com/photo-1605000797499-95a51c5269ae?q=80&w=1200&auto=format&fit=crop", "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?q=80&w=1200&auto=format&fit=crop"]'::jsonb,
    'Peacock Green Kanchipuram Silk Saree with ruby Korvai temple borders',
    'Mulberry Heavy Twisted Silk & Pure Gold Zari',
    'Kanchipuram, Tamil Nadu',
    'Korvai Double-Shuttle Interlock',
    'a0000001-0000-0000-0000-000000000003',
    'Two master weavers operating concurrently on the loom interlock the body warp with contrasting ruby temple borders, creating the legendary structural strength and lustrous sheen of authentic Kanchipuram silk.',
    '5.5m Saree + 0.75m Unstitched Blouse Piece',
    'Professional dry clean only. Avoid spraying perfumes directly on gold zari.',
    'GI Certified Registry #GI-45. Authenticated by Tamil Nadu Zari Verification Centre.',
    'Handwoven',
    TRUE,
    4
  ),
  (
    'b0000001-0000-0000-0000-000000000003',
    'Handspun Ahimsa Tussar Silk Stole',
    'handspun-tussar-geometric-stole',
    'c0000001-0000-0000-0000-000000000002',
    8400.00,
    '₹8,400',
    '["https://images.unsplash.com/photo-1606744824163-985d376605aa?q=80&w=1200&auto=format&fit=crop"]'::jsonb,
    'Golden Handspun Tussar Silk Stole with natural plant-dyed borders',
    'Wild Forest Ahimsa Tussar Silk',
    'Bhagalpur, Bihar',
    'Hand-thrown Slub Weave & Botanical Dyeing',
    'a0000001-0000-0000-0000-000000000002',
    'Reeled by hand from empty forest cocoons without harming the silkworm, this stole possesses a distinctive warm golden slub texture. Finished with botanical madder root dip dyes.',
    '2.2m x 0.7m',
    'Gentle hand wash in cold water with mild organic detergent. Dry in shade.',
    'Silk Mark Authority of India #SM-BH-8841. Zero synthetic chemicals.',
    'New',
    TRUE,
    12
  ),
  (
    'b0000001-0000-0000-0000-000000000004',
    'Kashmiri Sozni Hand-Embroidered Pashmina Shawl',
    'kashmiri-sozni-jamawar-pashmina',
    'c0000001-0000-0000-0000-000000000002',
    62000.00,
    '₹62,000',
    '["https://images.unsplash.com/photo-1558171813-4c088753af8f?q=80&w=1200&auto=format&fit=crop"]'::jsonb,
    'Fine Kashmiri Sozni Embroidered Pashmina Shawl with paisley border',
    '100% Changthangi Ladakhi Pashm Wool',
    'Srinagar, Jammu & Kashmir',
    'Fine Sozni Needle Embroidery',
    'a0000001-0000-0000-0000-000000000004',
    'Handspun from the soft winter underbelly fleece of high-altitude Changthangi goats and delicately embroidered over six months by master craftsman Ghulam Rasool.',
    '2.0m x 1.0m',
    'Specialist dry cleaning only. Store with dried neem leaves in cotton cover.',
    'Kashmir Pashmina GI Tagged #JK-GI-114. Tested 14.5 micron fiber.',
    'Limited',
    TRUE,
    2
  ),
  (
    'b0000001-0000-0000-0000-000000000005',
    'Chanderi Pure Silk-Cotton Zari Saree',
    'chanderi-tissue-zari-saree',
    'c0000001-0000-0000-0000-000000000001',
    18500.00,
    '₹18,500',
    '["https://images.unsplash.com/photo-1584917865442-de89df76afd3?q=80&w=1200&auto=format&fit=crop"]'::jsonb,
    'Sheer gossamer Chanderi Saree in ivory and champagne gold zari',
    'Mulberry Silk & High-Count Handspun Cotton',
    'Chanderi, Madhya Pradesh',
    'Ek Nali Sheer Weave with Ashrafi Butis',
    'a0000001-0000-0000-0000-000000000001',
    'Celebrated since the 14th century for its translucent, featherweight drape. Woven combining fine silk warp with unspun cotton weft, accented with delicate gold coin motifs.',
    '5.5m Saree + 0.8m Blouse Piece',
    'Gentle dry clean only. Iron on reverse side using low heat.',
    'Chanderi GI Certificate #MP-CH-092.',
    'Handwoven',
    TRUE,
    6
  ),
  (
    'b0000001-0000-0000-0000-000000000006',
    'Kutch Natural Indigo Ajrakh Modal Kurta',
    'ajrakh-hand-block-modal-kurta',
    'c0000001-0000-0000-0000-000000000003',
    6800.00,
    '₹6,800',
    '["https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=1200&auto=format&fit=crop"]'::jsonb,
    'Hand-printed natural indigo Ajrakh kurta in lustrous modal silk',
    'Natural Modal Silk & Organic Fermented Indigo',
    'Dhamadka, Kutch, Gujarat',
    '16-Stage Ajrakh Resist Block Printing',
    'a0000001-0000-0000-0000-000000000005',
    'Printed through 16 stages of resist printing, washing, and dipping into subterranean organic indigo fermentation vats. The deep star patterns represent desert night skies.',
    'Available Sizes: S, M, L, XL (Chest 38 - 44)',
    'Hand wash separately in cold water. Natural dyes may run slightly on first wash.',
    'Kutch Crafts Council Registry #KCC-AJ-204.',
    'New',
    TRUE,
    15
  ),
  (
    'b0000001-0000-0000-0000-000000000007',
    'Bhujodi Organic Kala Cotton Throw',
    'bhujodi-kala-cotton-throw',
    'c0000001-0000-0000-0000-000000000004',
    5400.00,
    '₹5,400',
    '["https://images.unsplash.com/photo-1490751907972-0ae72a22f0ba?q=80&w=1200&auto=format&fit=crop"]'::jsonb,
    'Tactile handwoven Kala cotton throw with extra-weft geometric tassels',
    '100% Rain-fed Indigenous Kala Cotton',
    'Bhujodi, Gujarat',
    'Kutch Extra-Weft Pit Loom Weave',
    'a0000001-0000-0000-0000-000000000006',
    'Crafted from indigenous rain-fed Kala cotton that grows purely on monsoon rainfall. Woven with extra-weft tribal patterns and finished with braided artisanal fringe.',
    '1.8m x 1.3m',
    'Machine wash on delicate cold cycle. Lay flat or hang to dry.',
    'Khamir Craft Collective Certified Organic Handloom.',
    'Handwoven',
    TRUE,
    8
  ),
  (
    'b0000001-0000-0000-0000-000000000008',
    'Royal Yeola Paithani Peacock Pallu Saree',
    'paithani-peacock-pallu-saree',
    'c0000001-0000-0000-0000-000000000001',
    56000.00,
    '₹56,000',
    '["https://images.unsplash.com/photo-1610030469983-98e550d6193c?q=80&w=1200&auto=format&fit=crop"]'::jsonb,
    'Yeola Paithani Saree in royal magenta with pure gold tapestry peacock pallu',
    'Filature Silk & Pure Silver-Gold Electroplated Zari',
    'Yeola, Maharashtra',
    'Tapestry Weave with Asavali Vine Borders',
    'a0000001-0000-0000-0000-000000000001',
    'Referred to as the Queen of Silks in Maharashtra, this Paithani features an oblique interlocking tapestry weave pallu with vibrant peacocks (Mor) and parrot motifs.',
    '5.5m Saree + 0.8m Blouse Piece',
    'Specialist dry cleaning only. Wrap in soft unbleached muslin.',
    'GI Registry Tag #GI-18 (Paithani Sarees of Yeola).',
    'Limited',
    TRUE,
    2
  )
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  slug = EXCLUDED.slug,
  category_id = EXCLUDED.category_id,
  price = EXCLUDED.price,
  display_price = EXCLUDED.display_price,
  images = EXCLUDED.images,
  alt = EXCLUDED.alt,
  material = EXCLUDED.material,
  region = EXCLUDED.region,
  technique = EXCLUDED.technique,
  artisan_id = EXCLUDED.artisan_id,
  description = EXCLUDED.description,
  dimensions = EXCLUDED.dimensions,
  care = EXCLUDED.care,
  provenance = EXCLUDED.provenance,
  badge = EXCLUDED.badge,
  in_stock = EXCLUDED.in_stock,
  stock_quantity = EXCLUDED.stock_quantity;

-- --------------------------------------------------------------------
-- 4. Seed Authenticity Passports
-- --------------------------------------------------------------------
INSERT INTO public.authenticity_passports (
  id, product_id, verification_status, handwoven_verified, origin_verified,
  gi_registry_no, silk_mark_no, loom_type, warp_thread_count, weave_density,
  cultural_story, craft_journey
)
VALUES
  (
    'e0000001-0000-0000-0000-000000000001',
    'b0000001-0000-0000-0000-000000000001',
    'GI Associated Craft',
    TRUE,
    TRUE,
    'GI-AU/482/BAN-2023',
    'SM-UP-992140',
    'Traditional Ground Pit Loom with Hand Naksha Jacquard',
    '120 Ends Per Inch (Double Twist Katan)',
    '98 Picks Per Inch Hand-beaten Weft',
    'Banarasi brocades trace back to the Rigveda and reached pinnacle expression during 16th-century Mughal royal workshops in Varanasi. This piece incorporates Shikargah (hunting scene) motifs reflecting royal flora and fauna.',
    '[
      {"stageNumber": 1, "title": "Silk Cultivation", "subtitle": "Mulberry Cocoon Sorting", "description": "High-grade mulberry cocoons sourced from certified Malda sericulture farmers.", "location": "Malda, West Bengal", "weaverNote": "Only zero-defect cocoons are reeled into high-tensile warp thread.", "completed": true},
      {"stageNumber": 2, "title": "Thread Spinning", "subtitle": "Two-Ply Katan Twisting", "description": "Filament silk twisted on wooden spinning charkhas into high-resilience katan yarn.", "location": "Varanasi Silk Cluster", "weaverNote": "12,000 meters of continuous warp prepared by hand.", "completed": true},
      {"stageNumber": 3, "title": "Zari Drawing", "subtitle": "Pure Silver Wire Flattening", "description": "Pure silver wire drawn through diamond dies, electroplated with 24k gold leaf.", "location": "Varanasi Zari Atelier", "weaverNote": "Tested for purity at National Craft Laboratory.", "completed": true},
      {"stageNumber": 4, "title": "Naksha Drafting", "subtitle": "Hand-Punched Graph Cards", "description": "Master Nakshaband draws intricate foliage patterns onto punch cards over 14 days.", "location": "Madanpura, Varanasi", "weaverNote": "Each card governs one mechanical throw of the pit loom.", "completed": true},
      {"stageNumber": 5, "title": "Pit Loom Weaving", "subtitle": "Kadwa Interlock Execution", "description": "Master weaver Rajeshwar Ansari hand-locks each brocade motif without floating wefts.", "location": "Varanasi Old Loom Atelier", "weaverNote": "Average weaving pace: 10 to 14 cm per working day.", "completed": true},
      {"stageNumber": 6, "title": "Quality Audit", "subtitle": "GI Tagging & Silk Mark", "description": "Physical inspection verifying thread density, selvedge straightness, and zari authenticity.", "location": "Varanasi Textile Board", "weaverNote": "Certified authentic and sealed with holographic GI emblem.", "completed": true}
    ]'::jsonb
  ),
  (
    'e0000001-0000-0000-0000-000000000002',
    'b0000001-0000-0000-0000-000000000002',
    'GI Authenticated',
    TRUE,
    TRUE,
    'GI-TN-45/KAN-2022',
    'SM-TN-441209',
    'Twin-Weaver Raised Frame Loom with Korvai Interlock Rods',
    '110 Ends Per Inch (Murukku Heavy Silk)',
    '104 Picks Per Inch Multi-Shuttle Twill',
    'Kanchipuram weavers claim descent from Sage Markanda, master weaver to the gods. Temple borders symbolize towering South Indian Gopurams, interlocked using double-shuttle synchronization.',
    '[
      {"stageNumber": 1, "title": "Mulberry Sourcing", "subtitle": "Kollagal Cocoon Reeling", "description": "Grade AAA cocoons reeled into heavy-twist filament yarn.", "location": "Kollagal Silk Belt", "weaverNote": "Thick yarn delivers signature heavy handfeel.", "completed": true},
      {"stageNumber": 2, "title": "Rice Starch Sizing", "subtitle": "Sun-Bleached Bath Sizing", "description": "Yarn conditioned in organic rice congee water to impart structural crispness.", "location": "Kanchipuram Artisan Guild", "weaverNote": "Naturally preserves fibers against tropical humidity.", "completed": true},
      {"stageNumber": 3, "title": "Zari Verification", "subtitle": "Surat Electroplate Audit", "description": "Tested for minimum 57% silver and 0.5% pure gold electroplate content.", "location": "Tamil Nadu Zari Board", "weaverNote": "Burn test confirms zero plastic metallic adulteration.", "completed": true},
      {"stageNumber": 4, "title": "Warp Stretcher", "subtitle": "Street-Length Warp Dressing", "description": "100-meter warps aligned on bamboo stretchers under morning sun.", "location": "Pillaiyarpalayam, Kanchipuram", "weaverNote": "Requires six weavers to align tension without tangles.", "completed": true},
      {"stageNumber": 5, "title": "Korvai Interlock", "subtitle": "Two-Weaver Synchrony", "description": "Two weavers sit side-by-side throwing opposing shuttles across the temple boundary.", "location": "Saraswathi Loom Sanctuary", "weaverNote": "Flawless joint with zero visible border seam.", "completed": true},
      {"stageNumber": 6, "title": "Guild Certification", "subtitle": "Silk Mark Hologram Affixing", "description": "Final inspection and registry recording on Handloom Connect ledger.", "location": "Kanchipuram Craft Registry", "weaverNote": "Official Living Wage certified.", "completed": true}
    ]'::jsonb
  ),
  (
    'e0000001-0000-0000-0000-000000000003',
    'b0000001-0000-0000-0000-000000000003',
    'Artisan Verified',
    TRUE,
    TRUE,
    'GI-BR-88/TUS-2024',
    'SM-BR-332901',
    'Four-Shaft Bamboo Fly-Shuttle Handloom',
    '64 Ends Per Inch (Handspun Tussar Slub)',
    '56 Picks Per Inch Wild Silk',
    'Tussar silk (Kosa) is gathered from wild Antheraea paphia silkworms feeding on Sal and Asan trees in the indigenous forest tracts of eastern India. Ahimsa harvesting allows the moth to fly free before cocoons are spun.',
    '[
      {"stageNumber": 1, "title": "Wild Cocoon Gathering", "subtitle": "Forest Floor Ahimsa Harvest", "description": "Tribal women collect perforated cocoons after the moth emerges naturally.", "location": "Chota Nagpur Plateau, Bihar", "weaverNote": "Non-violent silk harvest certified by forest cooperative.", "completed": true},
      {"stageNumber": 2, "title": "Thigh-Reeling", "subtitle": "Traditional Earthen Spindle", "description": "Women reel yarn using earthen pots and natural oil conditioning.", "location": "Bhagalpur Village Cluster", "weaverNote": "Gives natural tactile slub texture to the weave.", "completed": true},
      {"stageNumber": 3, "title": "Botanical Dyeing", "subtitle": "Madder & Marigold Ferment", "description": "Yarn submerged in wooden dye vats with alum mordant.", "location": "Meera Devi Atelier", "weaverNote": "100% biodegradable wastewater returned to soil.", "completed": true},
      {"stageNumber": 4, "title": "Loom Mounting", "subtitle": "Bamboo Reed Dressing", "description": "Tussar warp set with coarse bamboo reeds for breathability.", "location": "Bhagalpur Loom Shed", "weaverNote": "Provides featherweight summer insulation.", "completed": true},
      {"stageNumber": 5, "title": "Shuttle Weaving", "subtitle": "Extra-Weft Selvedge Accents", "description": "Carefully balanced weft insertion maintaining uniform organic tension.", "location": "Bhagalpur, Bihar", "weaverNote": "Takes 4 working days per stole.", "completed": true},
      {"stageNumber": 6, "title": "Final Steam Finish", "subtitle": "Organic Fabric Pressing", "description": "Hand-steamed over boiling herb water and tagged with Silk Mark.", "location": "Bhagalpur Quality Centre", "weaverNote": "Silken sheen without synthetic silicone finishes.", "completed": true}
    ]'::jsonb
  ),
  (
    'e0000001-0000-0000-0000-000000000004',
    'b0000001-0000-0000-0000-000000000004',
    'Ministry Registry Verified',
    TRUE,
    TRUE,
    'GI-JK-114/PASH-2023',
    'SM-JK-110982',
    'Traditional Kashmiri Wooden Frame Loom (Vun)',
    '140 Ends Per Inch (Handspun Pashm)',
    '130 Picks Per Inch Fine Wool Weft',
    'Sozni embroidery uses single-strand silk thread on gossamer-fine Changthangi pashmina. Motifs replicate the Kashmiri Badam (paisley), Chinar leaf, and nightingale feathers.',
    '[
      {"stageNumber": 1, "title": "High-Altitude Combing", "subtitle": "Changthang Pastoral Harvest", "description": "Nomadic Changpa herders comb undercoat wool from goats at 14,000+ feet.", "location": "Changthang, Ladakh", "weaverNote": "Fiber diameter tested under 14.5 microns.", "completed": true},
      {"stageNumber": 2, "title": "Yinder Spinning", "subtitle": "Wooden Wheel Hand-Spinning", "description": "Ladakhi women spin gossamer thread onto traditional Yinder wheels.", "location": "Old Srinagar Ateliers", "weaverNote": "Too fine for any mechanized spinning machines.", "completed": true},
      {"stageNumber": 3, "title": "Shawl Loom Weaving", "subtitle": "Twill Weave on Vun", "description": "Hand-woven base fabric so light a two-meter shawl passes through a ring.", "location": "Downtown Srinagar", "weaverNote": "Takes 12 days to weave base fabric.", "completed": true},
      {"stageNumber": 4, "title": "Naqash Woodblock Stamp", "subtitle": "Charcoal Powder Stencil", "description": "Master Naqash stamps fine layout lines using carved walnut blocks.", "location": "Jhelum Riverside Studio", "weaverNote": "Water-soluble charcoal washes off after embroidery.", "completed": true},
      {"stageNumber": 5, "title": "Sozni Needlework", "subtitle": "Single-Thread Fine Stitching", "description": "Ghulam Rasool embroiders hundreds of thousands of microscopic stitches.", "location": "Srinagar Atelier", "weaverNote": "Over 500 hours of continuous hand-embroidery.", "completed": true},
      {"stageNumber": 6, "title": "Craft Inspection", "subtitle": "Crafts Development Institute Stamp", "description": "Microscopic purity audit and cryptographic GI chip validation.", "location": "Srinagar Craft Testing Lab", "weaverNote": "Authentic UNESCO Intangible Cultural Heritage certified.", "completed": true}
    ]'::jsonb
  )
ON CONFLICT (product_id) DO UPDATE SET
  verification_status = EXCLUDED.verification_status,
  handwoven_verified = EXCLUDED.handwoven_verified,
  origin_verified = EXCLUDED.origin_verified,
  gi_registry_no = EXCLUDED.gi_registry_no,
  silk_mark_no = EXCLUDED.silk_mark_no,
  loom_type = EXCLUDED.loom_type,
  warp_thread_count = EXCLUDED.warp_thread_count,
  weave_density = EXCLUDED.weave_density,
  cultural_story = EXCLUDED.cultural_story,
  craft_journey = EXCLUDED.craft_journey;

-- --------------------------------------------------------------------
-- 5. Seed Product 360° Rotating Angle Images
-- --------------------------------------------------------------------
INSERT INTO public.product_360_images (product_id, image_url, sequence_number, angle_label)
VALUES
  (
    'b0000001-0000-0000-0000-000000000001',
    'https://images.unsplash.com/photo-1610030469983-98e550d6193c?q=80&w=1200&auto=format&fit=crop',
    1,
    'Front Angle (0°)'
  ),
  (
    'b0000001-0000-0000-0000-000000000001',
    'https://images.unsplash.com/photo-1584917865442-de89df76afd3?q=80&w=1200&auto=format&fit=crop',
    2,
    'Side Profile (90°)'
  ),
  (
    'b0000001-0000-0000-0000-000000000001',
    'https://images.unsplash.com/photo-1605000797499-95a51c5269ae?q=80&w=1200&auto=format&fit=crop',
    3,
    'Reverse Kadwa Weave Texture (180°)'
  ),
  (
    'b0000001-0000-0000-0000-000000000001',
    'https://images.unsplash.com/photo-1558171813-4c088753af8f?q=80&w=1200&auto=format&fit=crop',
    4,
    'Detailed Gold Zari Pallu (270°)'
  ),
  (
    'b0000001-0000-0000-0000-000000000002',
    'https://images.unsplash.com/photo-1605000797499-95a51c5269ae?q=80&w=1200&auto=format&fit=crop',
    1,
    'Front Angle (0°)'
  ),
  (
    'b0000001-0000-0000-0000-000000000002',
    'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?q=80&w=1200&auto=format&fit=crop',
    2,
    'Korvai Temple Joint Profile (90°)'
  ),
  (
    'b0000001-0000-0000-0000-000000000002',
    'https://images.unsplash.com/photo-1610030469983-98e550d6193c?q=80&w=1200&auto=format&fit=crop',
    3,
    'Heavy Silk Twill Texture (180°)'
  ),
  (
    'b0000001-0000-0000-0000-000000000002',
    'https://images.unsplash.com/photo-1584917865442-de89df76afd3?q=80&w=1200&auto=format&fit=crop',
    4,
    'Pure Gold Zari Temple Border (270°)'
  )
ON CONFLICT (product_id, sequence_number) DO UPDATE SET
  image_url = EXCLUDED.image_url,
  angle_label = EXCLUDED.angle_label;
