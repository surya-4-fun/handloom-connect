-- ====================================================================
-- Handloom Connect - Complete Database Seed Data
-- Directly matching all mock and demo records from frontend
-- ====================================================================

USE handloom_connect;

-- Explicit UTF-8 character encoding configuration
SET NAMES utf8mb4;
SET CHARACTER SET utf8mb4;
SET character_set_connection = utf8mb4;
SET character_set_results = utf8mb4;
SET character_set_client = utf8mb4;

SET FOREIGN_KEY_CHECKS = 0;

-- --------------------------------------------------------------------
-- 1. Seed Categories
-- --------------------------------------------------------------------
TRUNCATE TABLE categories;
INSERT INTO categories (id, label, image) VALUES
('all', 'All', 'https://images.unsplash.com/photo-1558171813-4c088753af8f?q=80&w=400&auto=format&fit=crop'),
('sarees', 'Sarees', 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?q=80&w=400&auto=format&fit=crop'),
('dupattas', 'Dupattas', 'https://images.unsplash.com/photo-1594040226829-7f251ab46d80?q=80&w=400&auto=format&fit=crop'),
('shawls', 'Shawls', 'https://images.unsplash.com/photo-1601244005535-a48d21d951ac?q=80&w=400&auto=format&fit=crop'),
('kurtas', 'Kurtas', 'https://images.unsplash.com/photo-1606760227091-3dd858d9721d?q=80&w=400&auto=format&fit=crop'),
('home-textiles', 'Home Textiles', 'https://images.unsplash.com/photo-1586105251261-72a756497a11?q=80&w=400&auto=format&fit=crop'),
('stoles', 'Stoles', 'https://images.unsplash.com/photo-1606744824163-985d376605aa?q=80&w=400&auto=format&fit=crop'),
('accessories', 'Accessories', 'https://images.unsplash.com/photo-1490751907972-0ae72a22f0ba?q=80&w=400&auto=format&fit=crop');

-- --------------------------------------------------------------------
-- 2. Seed Users
-- Password for all demo accounts: password123
-- (Bcrypt hash: $2a$10$1Y8T10eQxP1K5vVjUe9.9.5PzJ9pXh8H7y4J0K1L2M3N4O5P6Q7R8)
-- --------------------------------------------------------------------
TRUNCATE TABLE users;
INSERT INTO users (id, email, password_hash, full_name, avatar_url, role, created_at) VALUES
(
  'user_hc_2026',
  'collector@handloomconnect.com',
  '$2a$10$w8T0M0G6eB5lXk6/8J/Z0.cTeqiZ0k86Vj5y7kL2jQ5iWk3F6cI6G',
  'Ananya Collector',
  'https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=200&auto=format&fit=crop',
  'customer',
  '2025-10-12 00:00:00'
),
(
  'user_artisan_rajeshwar',
  'rajeshwar@banarasiartisan.org',
  '$2a$10$w8T0M0G6eB5lXk6/8J/Z0.cTeqiZ0k86Vj5y7kL2jQ5iWk3F6cI6G',
  'Rajeshwar Ansari',
  'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=200&auto=format&fit=crop',
  'artisan',
  '2025-08-01 00:00:00'
),
(
  'user_admin_hc',
  'admin@handloomconnect.in',
  '$2a$10$w8T0M0G6eB5lXk6/8J/Z0.cTeqiZ0k86Vj5y7kL2jQ5iWk3F6cI6G',
  'Curator Admin',
  NULL,
  'admin',
  '2025-01-01 00:00:00'
);

-- --------------------------------------------------------------------
-- 3. Seed User Addresses & Preferences
-- --------------------------------------------------------------------
TRUNCATE TABLE user_addresses;
INSERT INTO user_addresses (id, user_id, type, full_name, address_line1, address_line2, city, state, postal_code, country, is_default) VALUES
('addr-1', 'user_hc_2026', 'shipping', 'Ananya Collector', '128 Heritage Enclave, Block B', 'Indiranagar, Stage 2', 'Bengaluru', 'Karnataka', '560038', 'India', TRUE);

TRUNCATE TABLE user_preferences;
INSERT INTO user_preferences (user_id, newsletter, currency, theme) VALUES
('user_hc_2026', TRUE, 'INR', 'dark');

-- --------------------------------------------------------------------
-- 4. Seed Artisans
-- --------------------------------------------------------------------
TRUNCATE TABLE artisans;
INSERT INTO artisans (id, name, title, region, craft, specialty, experience, bio, story, techniques, cultural_background, community_impact, image, is_featured, is_collective, follower_count, support_count) VALUES
(
  'rajeshwar-ansari',
  'Rajeshwar Ansari',
  'Heritage Banarasi Master Weaver',
  'Varanasi, Uttar Pradesh',
  'Banarasi Brocade Weaving',
  'Real Gold Zari Katan Silk & Kadwa Weave',
  '42 Years',
  'A third-generation master weaver specialising in real zari katan silk brocade on traditional pit looms. His sarees have been exhibited at the National Handloom Expo.',
  'Inheriting the pit loom techniques from his grandfather, Rajeshwar Ansari has dedicated four decades to preserving Mughal-inspired brocade motifs. He designs intricate hand-drawn Naksha paper cards that guide every movement of the wooden Jacquard harness, creating heirlooms that take up to 45 days of continuous handwork.',
  '["Kadwa Hand-Brocade", "Tanchoi Double Warp", "Real Zari Interlock", "Hand-drawn Naksha Harness"]',
  'Varanasi Weaving Heritage dating back to Mughal royal patronage (16th Century). Recipient of the National Craft Award.',
  '{"activeLooms": 18, "fairWagePercentage": 100, "apprenticesTrained": 45, "summary": "Sustains 18 artisan families in Varanasi with guaranteed direct trade wages."}',
  'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=800&auto=format&fit=crop',
  TRUE,
  FALSE,
  340,
  128
),
(
  'meera-devi',
  'Meera Devi',
  'Master Tussar Silk & Botanical Dyer',
  'Bhagalpur, Bihar',
  'Tussar Silk & Natural Dyes',
  'Wild Cocoons & Botanical Plant Fermentation',
  '34 Years',
  'Preserving three-generation silk spinning traditions using indigenous cocoons and botanical plant extracts. Her textiles have been shown at global craft biennales.',
  'Meera Devi leads a network of rural women spinners across the Chota Nagpur plateau who gather wild forest cocoons without harming the silk moth (Ahimsa Silk). She brews natural dyes from madder roots, marigold petals, and pomegranate rinds, producing golden-patina textiles with zero synthetic chemicals.',
  '["Ahimsa Silk Reel", "Botanical Dye Vat", "Hand-thrown Slub Weave", "Matka Silk Spun Yarn"]',
  'Traditional Bhagalpur Silk Spinning Cluster (Silkworm Forest Heritage). Featured in the Delhi Craft Biennale.',
  '{"activeLooms": 24, "fairWagePercentage": 100, "apprenticesTrained": 60, "summary": "Empowers over 60 indigenous female cocoon harvesters and yarn spinners."}',
  'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=800&auto=format&fit=crop',
  TRUE,
  FALSE,
  512,
  210
),
(
  'saraswathi-guild',
  'Saraswathi Weavers Guild',
  'Kanchipuram Silk Women Cooperative',
  'Kanchipuram, Tamil Nadu',
  'Kanchipuram Silk Weaving',
  'Korvai Interlock & Heavy Gold Zari Temple Borders',
  '60+ Years (Guild)',
  'A women-led cooperative preserving the Korvai technique — interlocking warp and weft to create signature temple borders that define Kanchipuram silk.',
  'Founded in 1964, the Saraswathi Guild is a community-owned weaving sanctuary where two weavers operate each loom in perfect synchronization. One weaver throws the shuttle for the main body while the other weaves the interlocking gold zari border (Korvai), achieving legendary border strength and structural brilliance.',
  '["Korvai Double-Shuttle Interlock", "Three-Shuttle Petni Weave", "Mulberry Heavy Silk Twill", "Pure Gold Electroplate Zari"]',
  'Kanchipuram GI Tagged Silk Loom Heritage (Dating over 400 years to Chola Royal Dynasty).',
  '{"activeLooms": 32, "fairWagePercentage": 100, "apprenticesTrained": 90, "summary": "Guarantees pension, health benefits, and loom ownership for 32 female master weavers."}',
  'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?q=80&w=800&auto=format&fit=crop',
  TRUE,
  TRUE,
  680,
  315
),
(
  'ghulam-rasool',
  'Ghulam Rasool & Sons',
  'Master Sozni Needle Embroiderers',
  'Srinagar, Jammu & Kashmir',
  'Sozni Pashmina Embroidery',
  'Handspun Pashm Wool & Fine Sozni Needlework',
  '38 Years',
  'Custodians of the sozni needle embroidery tradition on handspun Changthangi pashmina. Each shawl takes 4–8 months to complete.',
  'Operating from an historic atelier overlooking the Jhelum River, Ghulam Rasool and his sons hand-comb winter undercoat wool shed by high-altitude Changthangi goats in Ladakh (14,000+ ft). Using needles fine as human hair, they embroider intricate Paisley (Kalka) and Floral (Jal) motifs into pure pashm fabric.',
  '["Sozni Fine Needle Work", "Changthangi Hand-Spinning", "Kalka Paisley Motifs", "Natural Walnut Husk Dyeing"]',
  'Kashmiri Craft Heritage certified under UNESCO Intangible Cultural Register.',
  '{"activeLooms": 12, "fairWagePercentage": 100, "apprenticesTrained": 30, "summary": "Supports nomadic Changpa herders in Changthang and Kashmiri needle artisans."}',
  'https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=800&auto=format&fit=crop',
  FALSE,
  FALSE,
  290,
  95
),
(
  'nila-collective',
  'Nila Artisan Collective',
  'Kutch Natural Indigo & Ajrakh Masters',
  'Bhuj, Kutch, Gujarat',
  'Natural Indigo & Ajrakh',
  'Indigo Vat Fermentation & Hand Block Print',
  '28 Years',
  'Custodians of natural indigo vat fermentation passed down through generations. Using mineral-rich water wells and carved teakwood blocks.',
  'The Nila Collective operates 12-foot deep subterranean clay vats in Kutch where indigo leaves ferment with natural jaggery and lime. Using hand-carved teakwood blocks dipped in natural resist paste, they layer geometric Ajrakh motifs that mirror desert night skies.',
  '["Natural Indigo Vat Fermentation", "16-Stage Ajrakh Block Printing", "Kala Organic Cotton Weave", "Teakwood Hand-Carving"]',
  'Kutch Desert Craft Guild & Natural Dye Heritage (500+ years of Sindhi/Kutchi printing).',
  '{"activeLooms": 20, "fairWagePercentage": 100, "apprenticesTrained": 50, "summary": "Reclaims organic Kala Cotton farming and preserves non-chemical indigo wells."}',
  'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=800&auto=format&fit=crop',
  TRUE,
  TRUE,
  420,
  180
),
(
  'phulia-weavers',
  'Phulia Master Weavers',
  'Jamdani Muslin Weaving Guild',
  'Phulia, West Bengal',
  'Jamdani & Fine Muslin',
  'UNESCO Jamdani Inlay & Featherlight Cotton Muslin',
  '50+ Years (Guild)',
  'Keeping alive the UNESCO-recognized Jamdani weave — supplementary weft patterns inserted by hand into gossamer-fine muslin on traditional looms.',
  'Phulia weavers work in damp pit looms where humidity preserves thread elasticity. Using wooden bamboo needles (Kandis), weavers insert delicate cotton motifs into gossamer muslin thread by thread without tracing or drawing on the warp.',
  '["UNESCO Jamdani Hand-Inlay", "Discontinuous Weft Technique", "Gossamer Muslin Spinning", "Natural Starch Sizing"]',
  'UNESCO Representative List of Intangible Cultural Heritage of Humanity (Jamdani).',
  '{"activeLooms": 26, "fairWagePercentage": 100, "apprenticesTrained": 70, "summary": "Maintains Bengal’s historic 200-count muslin spinning heritage."}',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=800&auto=format&fit=crop',
  FALSE,
  TRUE,
  380,
  140
);

-- --------------------------------------------------------------------
-- 5. Seed Products
-- --------------------------------------------------------------------
TRUNCATE TABLE products;
INSERT INTO products (id, name, slug, category_id, price, display_price, images, alt, material, region, technique, artisan_id, description, dimensions, care, provenance, badge, in_stock, stock_quantity) VALUES
(
  'banarasi-zari-saree',
  'Banarasi Real Zari Katan Silk Saree',
  'banarasi-zari-saree',
  'sarees',
  48500.00,
  '₹48,500',
  '["https://images.unsplash.com/photo-1610030469983-98e550d6193c?q=80&w=800&auto=format&fit=crop", "https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?q=80&w=800&auto=format&fit=crop"]',
  'Banarasi Zari Katan Silk Saree in deep crimson with gold brocade',
  'Pure Mulberry Silk & Fine Silver-Gold Zari',
  'Varanasi, Uttar Pradesh',
  'Pit Loom Brocade',
  'rajeshwar-ansari',
  'Woven over 42 days on a traditional pit loom using pure mulberry silk and electroplated gold-silver thread work inspired by Mughal flora.',
  '5.5m saree + 0.8m blouse piece',
  'Dry clean only. Store folded in muslin cloth.',
  'GI Tagged · Silk Mark Certified',
  'Bestseller',
  TRUE,
  5
),
(
  'kanchipuram-korvai',
  'Kanchipuram Temple Border Korvai Silk',
  'kanchipuram-korvai',
  'sarees',
  39200.00,
  '₹39,200',
  '["https://images.unsplash.com/photo-1612817288484-6f916006741a?q=80&w=800&auto=format&fit=crop", "https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?q=80&w=800&auto=format&fit=crop"]',
  'Kanchipuram silk saree with temple border korvai technique',
  'Heavy Weight Mulberry Silk',
  'Kanchipuram, Tamil Nadu',
  'Korvai Interlocking Warp',
  'saraswathi-guild',
  'Interlocking warp technique (Korvai) creating sharp contrast borders with pure zari temple gopuram motifs along the pallu.',
  '6.3m saree + 0.8m blouse piece',
  'Dry clean only. Avoid direct sunlight storage.',
  'Handloom Mark Verified · Silk Mark Certified',
  'Handwoven',
  TRUE,
  8
),
(
  'jamdani-muslin-saree',
  'Dhakai Jamdani Fine Muslin Saree',
  'jamdani-muslin-saree',
  'sarees',
  28400.00,
  '₹28,400',
  '["https://images.unsplash.com/photo-1553062407-98eeb64c6a62?q=80&w=800&auto=format&fit=crop"]',
  'Jamdani fine muslin saree with geometric woven motifs',
  '100s Count Fine Handspun Cotton',
  'Phulia, West Bengal',
  'Supplementary Weft Jamdani',
  'phulia-weavers',
  'Supplementary weft technique where delicate geometric motifs are hand-inserted into fine muslin like embroidery on the loom.',
  '5.5m saree + 0.8m blouse piece',
  'Gentle hand wash with mild detergent. Air dry in shade.',
  'UNESCO Intangible Cultural Heritage Craft',
  'Handwoven',
  TRUE,
  4
),
(
  'chanderi-silk-saree',
  'Chanderi Silk Cotton Zari Border Saree',
  'chanderi-silk-saree',
  'sarees',
  14800.00,
  '₹14,800',
  '["https://images.unsplash.com/photo-1583391733956-6c78276477e2?q=80&w=800&auto=format&fit=crop"]',
  'Chanderi silk cotton saree with gold zari border',
  'Silk Cotton Blend with Zari',
  'Chanderi, Madhya Pradesh',
  'Traditional Chanderi Weave',
  'meera-devi',
  'Lightweight and translucent Chanderi with its characteristic sheer texture, adorned with traditional coin and floral butis woven in gold zari.',
  '5.5m saree + 0.8m blouse piece',
  'Dry clean recommended. Gentle hand wash possible.',
  'GI Tagged Chanderi',
  'New',
  TRUE,
  12
),
(
  'pochampally-ikat',
  'Pochampally Double Ikat Silk Saree',
  'pochampally-ikat',
  'sarees',
  22500.00,
  '₹22,500',
  '["https://images.unsplash.com/photo-1528459801416-a9e53bbf4e17?q=80&w=800&auto=format&fit=crop"]',
  'Pochampally double ikat silk saree in vivid tones',
  'Pure Silk with Natural Dyes',
  'Pochampally, Telangana',
  'Double Ikat Resist Dyeing',
  'meera-devi',
  'Both warp and weft threads are tie-dyed before weaving, creating precise geometric patterns that emerge only when the fabric is woven — a technique mastered by few.',
  '5.5m saree + 0.8m blouse piece',
  'Dry clean only. Store rolled to preserve ikat pattern.',
  'GI Tagged · UNESCO Heritage',
  NULL,
  TRUE,
  6
),
(
  'pashmina-sozni-shawl',
  'Kashmiri Hand-Embroidered Pashmina Shawl',
  'pashmina-sozni-shawl',
  'shawls',
  62000.00,
  '₹62,000',
  '["https://images.unsplash.com/photo-1601244005535-a48d21d951ac?q=80&w=800&auto=format&fit=crop"]',
  'Kashmiri Pashmina shawl with intricate Sozni embroidery',
  '100% Hand-Spun Changthangi Pashmina',
  'Srinagar, Jammu & Kashmir',
  'Sozni Needle Embroidery',
  'ghulam-rasool',
  'Spun from high-altitude Ladakh pashm wool and hand-embroidered with micro Sozni needle stitches taking over 6 months to complete.',
  '200cm × 70cm',
  'Dry clean only. Store with cedar or lavender sachets.',
  'Authentic Kashmir Pashmina GI Tagged',
  'Limited',
  TRUE,
  3
),
(
  'kani-pashmina-shawl',
  'Kani Weave Pashmina Jamawar Shawl',
  'kani-pashmina-shawl',
  'shawls',
  85000.00,
  '₹85,000',
  '["https://images.unsplash.com/photo-1584917865442-de89df76afd3?q=80&w=800&auto=format&fit=crop"]',
  'Kani pashmina jamawar shawl with elaborate pattern',
  '100% Pashmina with Natural Dyes',
  'Kanihama, Jammu & Kashmir',
  'Kani Twill Tapestry',
  'ghulam-rasool',
  'The rarest of Kashmiri shawls — woven on a special loom using small wooden sticks (kanis) instead of shuttles. A single shawl can take over 18 months.',
  '200cm × 140cm',
  'Professional dry clean only. Heirloom storage recommended.',
  'GI Tagged · Master Artisan Certified',
  'Limited',
  TRUE,
  2
),
(
  'kullu-wool-shawl',
  'Kullu Handloom Wool Shawl',
  'kullu-wool-shawl',
  'shawls',
  4200.00,
  '₹4,200',
  '["https://images.unsplash.com/photo-1544441893-675973e31985?q=80&w=800&auto=format&fit=crop"]',
  'Kullu handloom wool shawl with traditional border',
  'Local Himalayan Sheep Wool',
  'Kullu, Himachal Pradesh',
  'Traditional Kullu Handloom',
  'nila-collective',
  'Woven with locally sourced Himalayan wool, featuring signature Kullu geometric borders in vibrant natural dye colours.',
  '220cm × 100cm',
  'Gentle hand wash in cold water. Lay flat to dry.',
  'GI Tagged Kullu Shawl',
  'New',
  TRUE,
  15
),
(
  'ajrakh-modal-dupatta',
  'Kutch Natural Indigo Ajrakh Dupatta',
  'ajrakh-modal-dupatta',
  'dupattas',
  5600.00,
  '₹5,600',
  '["https://images.unsplash.com/photo-1594040226829-7f251ab46d80?q=80&w=800&auto=format&fit=crop"]',
  'Ajrakh hand block printed dupatta in natural indigo',
  'Handwoven Modal Silk',
  'Dhamadka, Kutch, Gujarat',
  '16-Stage Ajrakh Block Print',
  'nila-collective',
  'Sixteen-stage resist block printing using natural indigo, madder, and harda. Each motif is stamped by hand using carved teakwood blocks.',
  '2.5m × 1m',
  'Hand wash separately in cold water with mild detergent.',
  'Craft Mark Certified · Natural Dye Guaranteed',
  'Bestseller',
  TRUE,
  10
),
(
  'kantha-tussar-dupatta',
  'Kantha Embroidered Tussar Silk Dupatta',
  'kantha-tussar-dupatta',
  'dupattas',
  8900.00,
  '₹8,900',
  '["https://images.unsplash.com/photo-1558171813-4c088753af8f?q=80&w=800&auto=format&fit=crop"]',
  'Kantha embroidered dupatta on wild tussar silk',
  'Wild Tussar Silk & Cotton Thread',
  'Shantiniketan, West Bengal',
  'Nakshi Kantha Embroidery',
  'phulia-weavers',
  'Thousands of running stitches depicting scenes from rural Bengal life, hand-embroidered by women artisans over 3 weeks.',
  '2.4m × 0.9m',
  'Dry clean recommended to preserve fine embroidery.',
  'GI Tagged Nakshi Kantha',
  'Handwoven',
  TRUE,
  7
),
(
  'indigo-kala-throw',
  'Kala Cotton Indigo Woven Throw',
  'indigo-kala-throw',
  'home-textiles',
  4800.00,
  '₹4,800',
  '["https://images.unsplash.com/photo-1586105251261-72a756497a11?q=80&w=800&auto=format&fit=crop"]',
  'Kala cotton reversible throw in natural indigo',
  '100% Organic Rain-fed Kala Cotton',
  'Bhuj, Kutch, Gujarat',
  'Pit Loom Extra Weft',
  'nila-collective',
  'Woven from indigenous, rain-fed Kala cotton that requires no pesticides or irrigation. Natural indigo vat-dyed with reversible geometric motifs.',
  '150cm × 200cm',
  'Machine wash cold, gentle cycle. Air dry.',
  'Organic Cotton Certified · Fair Trade',
  'New',
  TRUE,
  14
),
(
  'khadi-tussar-stole',
  'Handspun Khadi Tussar Silk Stole',
  'khadi-tussar-stole',
  'stoles',
  3600.00,
  '₹3,600',
  '["https://images.unsplash.com/photo-1606744824163-985d376605aa?q=80&w=800&auto=format&fit=crop"]',
  'Khadi tussar silk stole in golden natural hue',
  '50% Handspun Khadi Cotton, 50% Tussar Silk',
  'Bhagalpur, Bihar',
  'Charkha Spun Handloom',
  'meera-devi',
  'A breathable blend of charkha-spun cotton and wild forest tussar silk, creating a rich slubbed texture that softens with every wash.',
  '180cm × 60cm',
  'Hand wash in cold water. Air dry.',
  'Khadi Certified · Silk Mark Certified',
  'Handwoven',
  TRUE,
  18
);

-- --------------------------------------------------------------------
-- 6. Seed Authenticity Passports
-- --------------------------------------------------------------------
TRUNCATE TABLE authenticity_passports;
INSERT INTO authenticity_passports (id, product_id, verification_status, handwoven_verified, origin_verified, gi_registry_no, silk_mark_no, loom_type, warp_thread_count, weave_density, cultural_story, craft_journey) VALUES
(
  'AUTH-HC-BANA-2026-9812',
  'banarasi-zari-saree',
  'GI Associated Craft',
  TRUE,
  TRUE,
  'GI-8821-UP-KATAN',
  'SM-VA-2026-4482',
  'Traditional Hand-operated Wooden Pit Loom',
  '2,400 Filaments (Double Warp)',
  '72 Ends/Inch x 68 Picks/Inch',
  'The Banarasi Real Zari Katan Silk Saree embodies centuries of Pit Loom Brocade artistry passed down through generations in Varanasi, Uttar Pradesh. Each warp thread is hand-spun and guided on traditional pit looms by Rajeshwar Ansari, preserving a living cultural heritage recognized under India\'s Geographical Indications (GI) Registry.',
  '[
    {"stageNumber": 1, "title": "Raw Material Sourcing", "subtitle": "Unadulterated Fiber Harvesting", "description": "Pure Mulberry Silk fibers gathered directly from verified indigenous agricultural clusters in Varanasi, Uttar Pradesh.", "location": "Varanasi, Uttar Pradesh", "weaverNote": "Raw thread degummed in natural spring water with zero chemical bleaches.", "completed": true},
    {"stageNumber": 2, "title": "Botanical & Organic Dyeing", "subtitle": "Natural Plant Color Extraction", "description": "Yarn hank dyeing in small earthen vats using natural madder root, marigold extracts, and fermented indigo.", "location": "Varanasi Dye Vats", "weaverNote": "Sun-dried on wooden racks over 3 days to fix deep light patina.", "completed": true},
    {"stageNumber": 3, "title": "Pit Loom Warp Setting", "subtitle": "Manual Heddle Thread Alignment", "description": "Over 2,400 individual warp threads aligned manually through bamboo heddles on a traditional pit loom.", "location": "Varanasi Atelier Loom", "weaverNote": "Warp tension calibrated for interlocking Kadwa brocade strength.", "completed": true},
    {"stageNumber": 4, "title": "Master Shuttle Weaving", "subtitle": "Painstaking Hand Artistry", "description": "Woven by Rajeshwar Ansari using the authentic Pit Loom Brocade technique at ~3.5 cm per hour.", "location": "Varanasi Guild Loom", "weaverNote": "Hand-thrown shuttles with pure gold zari thread interlock.", "completed": true},
    {"stageNumber": 5, "title": "Handloom Quality Audit", "subtitle": "Craft Quality & Density Audit", "description": "Physical density audit (ends x picks per inch), weave integrity inspection, and master weaver signature.", "location": "Regional Craft Guild Station", "weaverNote": "Inspected for traditional weave density and Geographical Indication (GI) regional association.", "completed": true},
    {"stageNumber": 6, "title": "Express Heirloom Dispatch", "subtitle": "Wax Sealed Atelier Packaging", "description": "Packed in padded cedarwood cotton dustbags with tamper-evident wax seal and direct express transit.", "location": "Handloom Connect Atelier Vault", "weaverNote": "Dispatched with signed Certificate of Authenticity.", "completed": true}
  ]'
),
(
  'AUTH-HC-KANC-2026-9812',
  'kanchipuram-korvai',
  'GI Authenticated',
  TRUE,
  TRUE,
  'GI-4482-TN-SILK',
  'SM-KA-2026-9812',
  'Two-Weaver Synchronized Pit Loom',
  '2,800 Filaments (Heavy Mulberry Silk)',
  '84 Ends/Inch x 76 Picks/Inch',
  'The Kanchipuram Temple Border Korvai Silk embodies legendary Chola Dynasty lineage in Kanchipuram, Tamil Nadu. Two master weavers synchronize every shuttle throw to achieve iconic temple borders.',
  '[
    {"stageNumber": 1, "title": "Raw Mulberry Filament Harvesting", "subtitle": "Grade AAA Silk Cocoons", "description": "High-tensile Grade AAA mulberry filaments reeled in natural mountain spring water.", "location": "Kanchipuram, Tamil Nadu", "weaverNote": "Hand-reeled with natural degumming.", "completed": true},
    {"stageNumber": 2, "title": "Botanical Hank Dyeing", "subtitle": "Natural Dye Patina", "description": "Yarn dyed in small batches with botanical pigments.", "location": "Kanchi Guild Vats", "weaverNote": "Deep jewel tones fixed in shade racks.", "completed": true},
    {"stageNumber": 3, "title": "Korvai Warp Alignment", "subtitle": "Double Shuttle Setup", "description": "2,800 warp threads set for contrast temple border interlock.", "location": "Saraswathi Guild Atelier", "weaverNote": "Two-weaver synchronized tension.", "completed": true},
    {"stageNumber": 4, "title": "Korvai Border Shuttle Weaving", "subtitle": "Real Zari Interlock", "description": "Petni and Korvai weaving creating contrast gopuram motifs.", "location": "Guild Loom Room", "weaverNote": "Electroplated gold zari shuttle work.", "completed": true},
    {"stageNumber": 5, "title": "Silk Mark & GI Audit", "subtitle": "Government Certification", "description": "Physical Silk Mark testing and GI tag certification.", "location": "Kanchipuram Silk Board", "weaverNote": "Certified pure mulberry silk.", "completed": true},
    {"stageNumber": 6, "title": "Heirloom Cedar Packaging", "subtitle": "Wax Sealed Dispatch", "description": "Vault packed with certificate of provenance.", "location": "Atelier Dispatch", "weaverNote": "Dispatched with insured courier.", "completed": true}
  ]'
);

-- --------------------------------------------------------------------
-- 6b. Seed Product 360° Rotating Angle Images
-- --------------------------------------------------------------------
TRUNCATE TABLE product_360_images;
INSERT INTO product_360_images (product_id, image_url, sequence_number, angle_label) VALUES
-- Banarasi Zari Katan Silk (8 Angle Rotation Sequence)
('banarasi-katan-silk', 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?q=80&w=1200&auto=format&fit=crop', 1, '0° Front View'),
('banarasi-katan-silk', 'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?q=80&w=1200&auto=format&fit=crop', 2, '45° Front-Right Drape'),
('banarasi-katan-silk', 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?q=80&w=1200&auto=format&fit=crop', 3, '90° Right Zari Border Profile'),
('banarasi-katan-silk', 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?q=80&w=1200&auto=format&fit=crop', 4, '135° Back-Right Pallu Cascade'),
('banarasi-katan-silk', 'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?q=80&w=1200&auto=format&fit=crop', 5, '180° Full Back Drape'),
('banarasi-katan-silk', 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?q=80&w=1200&auto=format&fit=crop', 6, '225° Back-Left Shoulder Fall'),
('banarasi-katan-silk', 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?q=80&w=1200&auto=format&fit=crop', 7, '270° Left Weave Texture Profile'),
('banarasi-katan-silk', 'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?q=80&w=1200&auto=format&fit=crop', 8, '315° Front-Left Pleat Interlock'),

-- Kanchipuram Korvai Silk (8 Angle Rotation Sequence)
('kanchipuram-korvai', 'https://images.unsplash.com/photo-1612817288484-6f916006741a?q=80&w=1200&auto=format&fit=crop', 1, '0° Front View'),
('kanchipuram-korvai', 'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?q=80&w=1200&auto=format&fit=crop', 2, '45° Front-Right Temple Gopuram'),
('kanchipuram-korvai', 'https://images.unsplash.com/photo-1612817288484-6f916006741a?q=80&w=1200&auto=format&fit=crop', 3, '90° Right Heavy Silk Profile'),
('kanchipuram-korvai', 'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?q=80&w=1200&auto=format&fit=crop', 4, '135° Back-Right Korvai Joint'),
('kanchipuram-korvai', 'https://images.unsplash.com/photo-1612817288484-6f916006741a?q=80&w=1200&auto=format&fit=crop', 5, '180° Full Back Gold Pallu'),
('kanchipuram-korvai', 'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?q=80&w=1200&auto=format&fit=crop', 6, '225° Back-Left Border Drape'),
('kanchipuram-korvai', 'https://images.unsplash.com/photo-1612817288484-6f916006741a?q=80&w=1200&auto=format&fit=crop', 7, '270° Left Contrast Warp View'),
('kanchipuram-korvai', 'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?q=80&w=1200&auto=format&fit=crop', 8, '315° Front-Left Pleated Flare'),

-- Dhakai Jamdani Fine Muslin Saree (8 Angle Rotation Sequence)
('jamdani-muslin-saree', 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?q=80&w=1200&auto=format&fit=crop', 1, '0° Front View'),
('jamdani-muslin-saree', 'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?q=80&w=1200&auto=format&fit=crop', 2, '45° Front-Right Sheer Drape'),
('jamdani-muslin-saree', 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?q=80&w=1200&auto=format&fit=crop', 3, '90° Right Muslin Profile'),
('jamdani-muslin-saree', 'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?q=80&w=1200&auto=format&fit=crop', 4, '135° Back-Right Geometric Motif'),
('jamdani-muslin-saree', 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?q=80&w=1200&auto=format&fit=crop', 5, '180° Full Back Muslin Fall'),
('jamdani-muslin-saree', 'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?q=80&w=1200&auto=format&fit=crop', 6, '225° Back-Left Supplementary Weft'),
('jamdani-muslin-saree', 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?q=80&w=1200&auto=format&fit=crop', 7, '270° Left Translucent Texture'),
('jamdani-muslin-saree', 'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?q=80&w=1200&auto=format&fit=crop', 8, '315° Front-Left Floating Weave'),

-- Kashmiri Pashmina Shawl (8 Angle Rotation Sequence)
('pashmina-shawl', 'https://images.unsplash.com/photo-1607613009820-a29f7bb81c04?q=80&w=1200&auto=format&fit=crop', 1, '0° Front Shoulder Layer'),
('pashmina-shawl', 'https://images.unsplash.com/photo-1528459801416-a9e53bbf4e17?q=80&w=1200&auto=format&fit=crop', 2, '45° Front-Right Sozni Needlework'),
('pashmina-shawl', 'https://images.unsplash.com/photo-1607613009820-a29f7bb81c04?q=80&w=1200&auto=format&fit=crop', 3, '90° Right Featherweight Profile'),
('pashmina-shawl', 'https://images.unsplash.com/photo-1528459801416-a9e53bbf4e17?q=80&w=1200&auto=format&fit=crop', 4, '135° Back-Right Paisley Border'),
('pashmina-shawl', 'https://images.unsplash.com/photo-1607613009820-a29f7bb81c04?q=80&w=1200&auto=format&fit=crop', 5, '180° Full Back Pashm Cascade'),
('pashmina-shawl', 'https://images.unsplash.com/photo-1528459801416-a9e53bbf4e17?q=80&w=1200&auto=format&fit=crop', 6, '225° Back-Left High-Altitude Wool Fall'),
('pashmina-shawl', 'https://images.unsplash.com/photo-1607613009820-a29f7bb81c04?q=80&w=1200&auto=format&fit=crop', 7, '270° Left Needle Embroidery Profile'),
('pashmina-shawl', 'https://images.unsplash.com/photo-1528459801416-a9e53bbf4e17?q=80&w=1200&auto=format&fit=crop', 8, '315° Front-Left Atelier Wrap');

-- --------------------------------------------------------------------
-- 7. Seed Material Suppliers
-- --------------------------------------------------------------------
TRUNCATE TABLE material_suppliers;
INSERT INTO material_suppliers (id, name, location, rating, certified, verified_gi, specialty, contact_email) VALUES
(
  'bhagalpur-silk-guild',
  'Bhagalpur Tussar Silk Reelers Guild',
  'Bhagalpur, Bihar',
  4.90,
  TRUE,
  TRUE,
  'Ahimsa Forest Tussar & Matka Silk Reels',
  'supply@bhagalpursilk.org'
),
(
  'kutch-indigo-vats',
  'Kutch Organic Indigo & Ajrakh Pit Collective',
  'Bhuj, Kutch, Gujarat',
  4.95,
  TRUE,
  TRUE,
  'Subterranean Vat Fermented Organic Indigo Extract',
  'indigo@nila-kutch.org'
),
(
  'changthang-pashm-coop',
  'Ladakh High-Altitude Pashm Herders Co-op',
  'Changthang, Ladakh',
  4.85,
  TRUE,
  TRUE,
  'Hand-combed 14.5 Micron Pashm Wool Tops',
  'pashm@ladakhcraft.org'
),
(
  'varanasi-zari-atelier',
  'Varanasi Royal Gold Zari Wire Atelier',
  'Varanasi, Uttar Pradesh',
  4.92,
  TRUE,
  TRUE,
  'Pure Silver Electroplated Gold Metallic Threads',
  'zari@varanasihandloom.in'
),
(
  'kanchi-silk-reelers',
  'Kanchipuram Mulberry Silk Filament Guild',
  'Kanchipuram, Tamil Nadu',
  4.88,
  TRUE,
  TRUE,
  '20/22 Denier Grade AAA Mulberry Silk Filaments',
  'yarn@kanchisilk.org'
);

-- --------------------------------------------------------------------
-- 8. Seed Raw Materials
-- --------------------------------------------------------------------
TRUNCATE TABLE raw_materials;
INSERT INTO raw_materials (id, name, category, material_type, origin, supplier_id, quality, quantity_unit, price, display_price, min_order_qty, in_stock, sustainability_info, description, images, badge, denier_or_count) VALUES
(
  'mulberry-silk-hank-20-22',
  'Grade AAA Mulberry Silk Filament Hank',
  'Silk Yarn',
  '20/22 Denier Raw Mulberry Silk',
  'Kanchipuram, Tamil Nadu',
  'kanchi-silk-reelers',
  'Grade AAA Pure',
  'per kg (Hank)',
  4200.00,
  '₹4,200',
  1,
  TRUE,
  '100% Pure Mulberry Silk Filaments • Zero Chemical Bleach • Hand-reeled Spring Harvest',
  'High-tensile double warp Mulberry silk yarn specifically prepared for Korvai temple border weaving. Degummed in natural mountain spring water.',
  '["https://images.unsplash.com/photo-1610030469983-98e550d6193c?q=80&w=800&auto=format&fit=crop"]',
  'GI Certified',
  '20/22 Denier'
),
(
  'wild-tussar-slub-yarn',
  'Hand-reeled Wild Tussar Slub Silk Yarn',
  'Silk Yarn',
  'Ahimsa Forest Cocoon Slub Silk',
  'Bhagalpur, Bihar',
  'bhagalpur-silk-guild',
  'Hand-spun Artisan',
  'per kg (Hank)',
  3600.00,
  '₹3,600',
  2,
  TRUE,
  'Wild Forest Cocoons • Eco-Friendly Ahimsa Reel • Botanical Wash',
  'Rich golden-patina Tussar silk yarn with organic slub texture. Ideal for thermal stoles, sarees, and home atelier upholstery.',
  '["https://images.unsplash.com/photo-1558171813-4c088753af8f?q=80&w=800&auto=format&fit=crop"]',
  'Artisan Grade',
  '160 GSM Slub'
),
(
  'kala-organic-cotton-40s',
  'Kala Organic Rain-Fed Cotton Yarn (40s)',
  'Cotton Yarn',
  'Kala Indigenous Organic Cotton',
  'Kutch, Gujarat',
  'kutch-indigo-vats',
  'Certified Organic',
  'per kg (Cone)',
  950.00,
  '₹950',
  5,
  TRUE,
  '100% Rain-fed Indigenous Cotton • Zero Pesticides • Carbon-Negative Farming',
  'Resilient, short-staple rain-fed organic cotton yarn spun in Kutchi villages. Highly absorbent and perfect for natural dye bonding.',
  '["https://images.unsplash.com/photo-1528458876861-544fd1761a91?q=80&w=800&auto=format&fit=crop"]',
  'Organic Vat',
  '40s Count'
),
(
  'fine-muslin-cotton-100s',
  'Gossamer Fine Muslin Cotton Yarn (100s)',
  'Cotton Yarn',
  'Gossamer Muslin Cotton',
  'Phulia, West Bengal',
  'bhagalpur-silk-guild',
  'Grade AAA Pure',
  'per 500g Hank',
  1850.00,
  '₹1,850',
  2,
  TRUE,
  'Humid Pit-Loom Spun • Natural Starch Sizing • Zero Synthetic Finish',
  'Featherlight 100s count combed cotton yarn engineered for UNESCO Jamdani hand-inlay weaving.',
  '["https://images.unsplash.com/photo-1606760227091-3dd858d9721d?q=80&w=800&auto=format&fit=crop"]',
  'Direct Guild',
  '100s Superfine'
),
(
  'ladakhi-pashm-wool-top',
  'Changthangi Ladakhi Pashm Wool Top',
  'Wool',
  '14.5 Micron High-Altitude Wool',
  'Changthang, Ladakh',
  'changthang-pashm-coop',
  'Grade AAA Pure',
  'per 250g Pack',
  4800.00,
  '₹4,800',
  1,
  TRUE,
  'Ethically Shed Winter Undercoat • Nomadic Changpa Co-op • Hand-combed',
  'Ultra-fine 14.5 micron pashm wool combed from Changthangi goats living at 14,000+ ft. Butter-soft tactile hand feel.',
  '["https://images.unsplash.com/photo-1516483638261-f4dbaf036963?q=80&w=800&auto=format&fit=crop"]',
  'GI Certified',
  '14.5 Micron'
),
(
  'organic-indigo-extract',
  'Subterranean Fermented Indigo Extract Cake',
  'Indigo',
  'Indigofera Tinctoria Natural Dye',
  'Bhuj, Kutch, Gujarat',
  'kutch-indigo-vats',
  'Certified Organic',
  'per 500g Cake',
  2400.00,
  '₹2,400',
  1,
  TRUE,
  '12-Foot Deep Clay Vat Fermentation • Jaggery & Lime Reduction • Zero Hydros',
  'Living organic indigo extract cake fermented in Kutchi deep-earth vats. Yields midnight blues with living patina.',
  '["https://images.unsplash.com/photo-1503602642458-232111445657?q=80&w=800&auto=format&fit=crop"]',
  'Organic Vat',
  '100% Botanical'
),
(
  'real-gold-zari-spool',
  '24K Electroplated Real Gold Zari Wire Spool',
  'Weaving Materials',
  'Pure Silver & Gold Zari Thread',
  'Varanasi, Uttar Pradesh',
  'varanasi-zari-atelier',
  'Pure Metallic',
  'per 250g Spool',
  7500.00,
  '₹7,500',
  1,
  TRUE,
  'Pure Silver Core Wire • 24K Gold Electroplating • Silk Core Filament',
  'Authentic royal Banarasi zari wire for Kadwa and Korvai brocade shuttles. Does not tarnish over generations.',
  '["https://images.unsplash.com/photo-1584917865442-de89df76afd3?q=80&w=800&auto=format&fit=crop"]',
  'GI Certified',
  '24K Gold Plated'
);

-- --------------------------------------------------------------------
-- 9. Seed Demo Orders & Order Items
-- --------------------------------------------------------------------
TRUNCATE TABLE orders;
INSERT INTO orders (id, user_id, shipping_address, delivery_method, payment_details, subtotal, shipping_fee, gift_box_fee, tax_fee, total_amount, status, current_stage, total_hours, completed_hours, estimated_delivery, silk_mark_no, gi_tag_no, created_at) VALUES
(
  'HC-2026-8942',
  'user_hc_2026',
  '{"id": "addr-1", "type": "shipping", "fullName": "Ananya Collector", "addressLine1": "128 Heritage Enclave, Block B", "city": "Bengaluru", "state": "Karnataka", "postalCode": "560038", "country": "India", "isDefault": true}',
  '{"id": "express", "name": "Express Atelier Air Courier", "estimatedDays": "2 - 4 Business Days", "cost": 350, "displayCost": "₹350", "description": "Priority flight routing & dedicated artisan handling."}',
  '{"method": "upi", "upiId": "ananya@upi"}',
  24500.00,
  350.00,
  750.00,
  1225.00,
  26825.00,
  'weaving_in_progress',
  3,
  140,
  105,
  'August 4, 2026',
  'SM-TN-2026-9812',
  'GI-KANCHI-4482',
  '2026-07-12 10:30:00'
),
(
  'HC-2026-3105',
  'user_hc_2026',
  '{"id": "addr-1", "type": "shipping", "fullName": "Ananya Collector", "addressLine1": "128 Heritage Enclave, Block B", "city": "Bengaluru", "state": "Karnataka", "postalCode": "560038", "country": "India", "isDefault": true}',
  '{"id": "standard", "name": "Standard Insured Craft Transit", "estimatedDays": "5 - 7 Business Days", "cost": 0, "displayCost": "FREE", "description": "Eco-friendly cardboard tube & handloom cotton dustbag."}',
  '{"method": "card", "cardLast4": "4242", "cardHolderName": "Ananya Collector"}',
  6800.00,
  0.00,
  0.00,
  340.00,
  7140.00,
  'quality_audit',
  4,
  60,
  52,
  'July 30, 2026',
  'SM-BH-2026-1102',
  'GI-BHAGAL-8821',
  '2026-07-18 14:20:00'
);

TRUNCATE TABLE order_items;
INSERT INTO order_items (order_id, product_id, name, price, display_price, quantity, image, craft, artisan_name, cluster) VALUES
(
  'HC-2026-8942',
  'kanchipuram-korvai',
  'Royal Kanchipuram Gold Zari Saree',
  24500.00,
  '₹24,500',
  1,
  'https://images.unsplash.com/photo-1610030469983-98e550d6193c?q=80&w=1200&auto=format&fit=crop',
  'Kanchipuram Double Warp Korvai',
  'Master Weaver Ramanathan & Family',
  'Kanchipuram Cluster, Tamil Nadu'
),
(
  'HC-2026-3105',
  'khadi-tussar-stole',
  'Raw Tussar Silk Stole',
  6800.00,
  '₹6,800',
  1,
  'https://images.unsplash.com/photo-1528459801416-a9e53bbf4e17?q=80&w=1200&auto=format&fit=crop',
  'Hand-reeled Slub Tussar',
  'Devi Prasad Weaving Collective',
  'Bhagalpur Cluster, Bihar'
);

-- --------------------------------------------------------------------
-- 10. Seed Followed Artisans & Wishlist
-- --------------------------------------------------------------------
TRUNCATE TABLE artisan_follows;
INSERT INTO artisan_follows (user_id, artisan_id) VALUES
('user_hc_2026', 'rajeshwar-ansari'),
('user_hc_2026', 'saraswathi-guild');

TRUNCATE TABLE wishlist_items;
INSERT INTO wishlist_items (user_id, product_id) VALUES
('user_hc_2026', 'pashmina-sozni-shawl'),
('user_hc_2026', 'banarasi-zari-saree');

SET FOREIGN_KEY_CHECKS = 1;
