import { serve } from "https://deno.land/std@0.177.0/http/server.ts"
import { corsHeaders } from "../_shared/cors.ts"

console.log("ai-chat Edge Function initialized")

interface CatalogProduct {
  id: string;
  name: string;
  category: string;
  craft: string;
  price: string;
  region: string;
  material: string;
  description: string;
  badge?: string;
}

interface RawMaterialItem {
  id: string;
  name: string;
  category: string;
  price: string;
  unit: string;
  origin: string;
  description: string;
}

// Authentic catalog ground truth matching Supabase database
const CATALOG_PRODUCTS: CatalogProduct[] = [
  {
    id: 'b0000001-0000-0000-0000-000000000001',
    name: 'Shikargah Katan Silk Banarasi Saree',
    category: 'Sarees',
    craft: 'Kadwa Hand-Brocade Weave',
    price: '₹48,500',
    region: 'Varanasi, Uttar Pradesh',
    material: 'Pure Katan Silk & Electroplated Gold Zari',
    description: 'Woven over 38 days on a traditional Varanasi pit loom, depicting royal Mughal flora and fauna motifs using Kadwa technique.',
    badge: 'Bestseller'
  },
  {
    id: 'b0000001-0000-0000-0000-000000000002',
    name: 'Korvai Temple Border Kanchipuram Silk Saree',
    category: 'Sarees',
    craft: 'Korvai Double-Shuttle Interlock',
    price: '₹39,200',
    region: 'Kanchipuram, Tamil Nadu',
    material: 'Mulberry Heavy Twisted Silk & Pure Gold Zari',
    description: 'Two master weavers concurrently interlocking body warp with contrasting ruby temple borders.',
    badge: 'Handwoven'
  },
  {
    id: 'b0000001-0000-0000-0000-000000000003',
    name: 'Handspun Ahimsa Tussar Silk Stole',
    category: 'Stoles & Dupattas',
    craft: 'Hand-thrown Slub Weave & Botanical Dyeing',
    price: '₹8,400',
    region: 'Bhagalpur, Bihar',
    material: 'Wild Forest Ahimsa Tussar Silk',
    description: 'Reeled by hand from empty forest cocoons without harming the silkworm, with warm golden slub texture.',
    badge: 'New'
  },
  {
    id: 'b0000001-0000-0000-0000-000000000004',
    name: 'Kashmiri Sozni Hand-Embroidered Pashmina Shawl',
    category: 'Stoles & Dupattas',
    craft: 'Fine Sozni Needle Embroidery',
    price: '₹62,000',
    region: 'Srinagar, Jammu & Kashmir',
    material: '100% Changthangi Ladakhi Pashm Wool',
    description: 'Handspun Ladakhi goat underbelly fleece embroidered with fine sozni needlework over six months.',
    badge: 'Limited'
  },
  {
    id: 'b0000001-0000-0000-0000-000000000005',
    name: 'Chanderi Pure Silk-Cotton Zari Saree',
    category: 'Sarees',
    craft: 'Ek Nali Sheer Weave with Ashrafi Butis',
    price: '₹18,500',
    region: 'Chanderi, Madhya Pradesh',
    material: 'Mulberry Silk & High-Count Handspun Cotton',
    description: 'Translucent gossamer drape combining fine silk warp and unspun cotton weft with gold coin motifs.',
    badge: 'Handwoven'
  },
  {
    id: 'b0000001-0000-0000-0000-000000000006',
    name: 'Kutch Natural Indigo Ajrakh Modal Kurta',
    category: 'Apparel & Kurtas',
    craft: '16-Stage Ajrakh Resist Block Printing',
    price: '₹6,800',
    region: 'Dhamadka, Kutch, Gujarat',
    material: 'Natural Modal Silk & Organic Fermented Indigo',
    description: 'Printed through 16 stages of resist printing, washing, and dipping into organic subterranean indigo vats.',
    badge: 'New'
  },
  {
    id: 'b0000001-0000-0000-0000-000000000007',
    name: 'Bhujodi Organic Kala Cotton Throw',
    category: 'Home Textiles & Throws',
    craft: 'Kutch Extra-Weft Pit Loom Weave',
    price: '₹5,400',
    region: 'Bhujodi, Gujarat',
    material: '100% Rain-fed Indigenous Kala Cotton',
    description: 'Crafted from indigenous rain-fed Kala cotton with extra-weft tribal patterns and braided artisanal fringe.',
    badge: 'New'
  },
  {
    id: 'b0000001-0000-0000-0000-000000000008',
    name: 'Royal Yeola Paithani Peacock Pallu Saree',
    category: 'Sarees',
    craft: 'Tapestry Weave with Asavali Vine Borders',
    price: '₹56,000',
    region: 'Yeola, Maharashtra',
    material: 'Filature Silk & Pure Silver-Gold Electroplated Zari',
    description: 'Queen of Silks in Maharashtra featuring an oblique interlocking tapestry weave pallu with vibrant peacocks.',
    badge: 'Limited'
  }
]

const CATALOG_RAW_MATERIALS: RawMaterialItem[] = [
  {
    id: 'b1111111-1111-1111-1111-111111111111',
    name: 'Grade AAA Mulberry Silk Filament Yarn',
    category: 'Silk Yarn',
    price: '₹5,400',
    unit: 'kg',
    origin: 'Kanchipuram, Tamil Nadu',
    description: 'Superior tensile strength Mulberry filament reeled under GI certified standards.'
  },
  {
    id: 'b2222222-2222-2222-2222-222222222222',
    name: 'Wild Forest Golden Muga Silk Hanks',
    category: 'Silk Yarn',
    price: '₹14,200',
    unit: 'kg',
    origin: 'Sualkuchi, Assam',
    description: 'Rare, non-bleached golden silk with perpetual natural sheen harvested from Som trees.'
  },
  {
    id: 'b3333333-3333-3333-3333-333333333333',
    name: 'Desi Organic Khadi Cotton Hanks (100s Count)',
    category: 'Cotton Yarn',
    price: '₹2,100',
    unit: 'kg',
    origin: 'Wardha, Maharashtra',
    description: 'Hand-ginned rain-fed desi cotton yarn spun on traditional Ambar charkha.'
  },
  {
    id: 'b4444444-4444-4444-4444-444444444444',
    name: 'Pure Organic Indigofera Tinctoria Cakes',
    category: 'Natural Indigo',
    price: '₹3,200',
    unit: 'kg',
    origin: 'Dhamadka, Kutch, Gujarat',
    description: 'Naturally fermented indigo dye extracted using heritage subterranean fermentation pits.'
  },
  {
    id: 'b5555555-5555-5555-5555-555555555555',
    name: 'Natural Madder Root Powder (Rubia Cordifolia)',
    category: 'Botanical Dye',
    price: '₹1,850',
    unit: 'kg',
    origin: 'Majuli, Assam',
    description: 'Shade-dried madder roots yielding warm earthy reds and crimson patinas.'
  },
  {
    id: 'b6666666-6666-6666-6666-666666666666',
    name: 'Pure Electroplated Gold Zari Spools',
    category: 'Metallic Zari',
    price: '₹28,500',
    unit: '250g',
    origin: 'Varanasi, Uttar Pradesh',
    description: 'Silver wire core electroplated with 24k gold leaf, drawn to microscopic micron count.'
  }
]

async function fetchCatalogProducts(): Promise<CatalogProduct[]> {
  const supabaseUrl = Deno.env.get('SUPABASE_URL')
  const supabaseKey = Deno.env.get('SUPABASE_ANON_KEY') || Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')

  if (supabaseUrl && supabaseKey) {
    try {
      const res = await fetch(`${supabaseUrl}/rest/v1/products?select=id,name,price,display_price,technique,region,material,description,badge`, {
        headers: {
          'apikey': supabaseKey,
          'Authorization': `Bearer ${supabaseKey}`
        }
      })
      if (res.ok) {
        const rows = await res.json()
        if (Array.isArray(rows) && rows.length > 0) {
          return rows.map((r: { id: string; name: string; technique?: string; display_price?: string; price: number; region?: string; material?: string; description?: string; badge?: string }) => ({
            id: r.id,
            name: r.name,
            category: 'Handloom',
            craft: r.technique || 'Handloom Weave',
            price: r.display_price || `₹${Number(r.price).toLocaleString('en-IN')}`,
            region: r.region || 'India',
            material: r.material || 'Natural Fiber',
            description: r.description || '',
            badge: r.badge
          }))
        }
      }
    } catch (e) {
      console.warn('Could not fetch products from database, using seed catalog cache:', e)
    }
  }
  return CATALOG_PRODUCTS
}

async function fetchRawMaterials(): Promise<RawMaterialItem[]> {
  const supabaseUrl = Deno.env.get('SUPABASE_URL')
  const supabaseKey = Deno.env.get('SUPABASE_ANON_KEY') || Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')

  if (supabaseUrl && supabaseKey) {
    try {
      const res = await fetch(`${supabaseUrl}/rest/v1/raw_materials?select=id,name,category,display_price,price,quantity_unit,origin,description`, {
        headers: {
          'apikey': supabaseKey,
          'Authorization': `Bearer ${supabaseKey}`
        }
      })
      if (res.ok) {
        const rows = await res.json()
        if (Array.isArray(rows) && rows.length > 0) {
          return rows.map((r: { id: string; name: string; category?: string; display_price?: string; price: number; quantity_unit?: string; origin?: string; description?: string }) => ({
            id: r.id,
            name: r.name,
            category: r.category || 'Raw Material',
            price: r.display_price || `₹${Number(r.price).toLocaleString('en-IN')}`,
            unit: r.quantity_unit || 'kg',
            origin: r.origin || 'India',
            description: r.description || ''
          }))
        }
      }
    } catch (e) {
      console.warn('Could not fetch raw materials from database, using seed catalog cache:', e)
    }
  }
  return CATALOG_RAW_MATERIALS
}

function formatProductSuggestions(productIds: string[], catalog: CatalogProduct[]) {
  const matches: Array<{
    id: string;
    productId: string;
    title: string;
    craft: string;
    price: string;
    category: string;
    reason?: string;
  }> = []

  for (const id of productIds) {
    const p = catalog.find(item => item.id === id)
    if (p && !matches.some(m => m.id === p.id)) {
      matches.push({
        id: p.id,
        productId: p.id,
        title: p.name,
        craft: p.craft,
        price: p.price,
        category: p.category
      })
    }
  }

  return matches
}

// Intelligent domain fallback for resilient conversational responses
function generateDomainFallback(
  message: string,
  catalog: CatalogProduct[],
  rawMaterials: RawMaterialItem[],
  context?: { currentPage?: string; productId?: string; rawMaterialId?: string }
) {
  const q = (message || '').trim().toLowerCase()

  // 1. Polite, conversational greetings
  const greetingWords = ['hi', 'hello', 'hey', 'namaste', 'greetings', 'good morning', 'good afternoon', 'good evening', 'pranam', 'yo']
  const isGreeting = greetingWords.includes(q) || /^(hi|hello|hey|namaste|greetings)[\s!.,?]*$/i.test(q)

  if (isGreeting) {
    return {
      reply: "Namaste! Welcome to Handloom Connect. I am your artisan curator and textile stylist. Whether you are seeking an heirloom saree for an occasion, exploring regional weaves like Banarasi and Kanchipuram, or looking for certified raw materials, how may I assist you today?",
      suggestions: []
    }
  }

  // 2. Latest collections / New arrivals
  if (
    q.includes('latest') ||
    q.includes('new arrival') ||
    q.includes('new collection') ||
    q.includes('what is new') ||
    q.includes("what's new") ||
    q.includes('recent')
  ) {
    const newItems = catalog.filter(p => p.badge === 'New')
    const idsToRecommend = newItems.length > 0 ? newItems.map(p => p.id) : catalog.slice(0, 3).map(p => p.id)
    return {
      reply: "Our latest atelier additions celebrate sustainable, small-batch weaving traditions. Notable highlights include handspun Ahimsa Tussar Silk from Bhagalpur, natural indigo Ajrakh modal silk from Kutch, and handwoven organic Kala cotton throws from Bhujodi.",
      suggestions: formatProductSuggestions(idsToRecommend, catalog)
    }
  }

  // 3. Varanasi / Banarasi Weaves
  if (
    q.includes('varanasi') ||
    q.includes('banaras') ||
    q.includes('banarasi') ||
    q.includes('kadwa') ||
    q.includes('shikargah') ||
    q.includes('katan')
  ) {
    const banarasiItem = catalog.find(p => p.region.toLowerCase().includes('varanasi') || p.name.toLowerCase().includes('banarasi'))
    const ids = banarasiItem ? [banarasiItem.id] : ['b0000001-0000-0000-0000-000000000001']
    return {
      reply: "Varanasi's weaving lineage is world-renowned for pit loom Kadwa hand-brocading. In Kadwa weaving, each motif is independently locked by hand with pure zari, leaving zero loose floating threads on the reverse. Our signature piece is the Shikargah Katan Silk Saree, capturing classic Mughal botanical motifs.",
      suggestions: formatProductSuggestions(ids, catalog)
    }
  }

  // 4. Wedding / Bridal Saree recommendations
  if (
    q.includes('wedding') ||
    q.includes('bridal') ||
    q.includes('marriage') ||
    q.includes('bride') ||
    (q.includes('saree') && (q.includes('recommend') || q.includes('suggest') || q.includes('look')))
  ) {
    const bridalItems = catalog.filter(p =>
      p.category.toLowerCase().includes('saree') ||
      p.name.toLowerCase().includes('banarasi') ||
      p.name.toLowerCase().includes('kanchipuram') ||
      p.name.toLowerCase().includes('paithani')
    ).slice(0, 3)
    const ids = bridalItems.length > 0 ? bridalItems.map(p => p.id) : [
      'b0000001-0000-0000-0000-000000000001',
      'b0000001-0000-0000-0000-000000000002',
      'b0000001-0000-0000-0000-000000000008'
    ]
    return {
      reply: "For wedding celebrations and bridal trousseaus, our patrons cherish authentic heirlooms with rich zari and structural longevity: Varanasi's real gold zari Shikargah Katan silk, Kanchipuram's heavy Korvai interlocking temple border silk, and Maharashtra's Yeola Paithani with pure gold tapestry peacocks. Which regional style or color palette resonates most with you?",
      suggestions: formatProductSuggestions(ids, catalog)
    }
  }

  // 5. Kanchipuram / Korvai Weaving
  if (q.includes('kanchipuram') || q.includes('kanjeevaram') || q.includes('korvai') || q.includes('temple border')) {
    const kanchiItem = catalog.find(p => p.region.toLowerCase().includes('kanchipuram') || p.name.toLowerCase().includes('kanchipuram'))
    const ids = kanchiItem ? [kanchiItem.id] : ['b0000001-0000-0000-0000-000000000002']
    return {
      reply: "Kanchipuram silk sarees are distinguished by the Korvai technique, where two master weavers operate dual shuttles in unison to interlock contrasting temple borders with heavy twisted mulberry silk and pure electroplated gold zari.",
      suggestions: formatProductSuggestions(ids, catalog)
    }
  }

  // 6. Pashmina / Kashmir / Winter Shawls
  if (q.includes('pashmina') || q.includes('kashmir') || q.includes('kashmiri') || q.includes('sozni') || q.includes('shawl') || q.includes('winter')) {
    const pashItem = catalog.find(p => p.name.toLowerCase().includes('pashmina') || p.region.toLowerCase().includes('srinagar'))
    const ids = pashItem ? [pashItem.id] : ['b0000001-0000-0000-0000-000000000004']
    return {
      reply: "Authentic Kashmiri Pashmina is hand-spun from the ultra-fine undercoat fleece of Ladakhi Changthangi goats. Master craftsmen spend up to six months applying intricate Sozni needle embroidery, creating an ethereal, featherweight wrap with unparalleled natural warmth.",
      suggestions: formatProductSuggestions(ids, catalog)
    }
  }

  // 7. Chanderi Weaving
  if (q.includes('chanderi') || q.includes('gossamer') || q.includes('tissue')) {
    const chanderiItem = catalog.find(p => p.name.toLowerCase().includes('chanderi'))
    const ids = chanderiItem ? [chanderiItem.id] : ['b0000001-0000-0000-0000-000000000005']
    return {
      reply: "Celebrated since the 14th century in Madhya Pradesh, Chanderi weaving blends pure silk warp with fine unspun cotton weft to achieve its signature translucent, featherweight drape, adorned with gold coin Ashrafi motifs.",
      suggestions: formatProductSuggestions(ids, catalog)
    }
  }

  // 8. Ajrakh Block Printing / Kurtas
  if (q.includes('ajrakh') || q.includes('kurta') || q.includes('block print') || q.includes('dhamadka')) {
    const ajrakhItem = catalog.find(p => p.name.toLowerCase().includes('ajrakh'))
    const ids = ajrakhItem ? [ajrakhItem.id] : ['b0000001-0000-0000-0000-000000000006']
    return {
      reply: "Ajrakh is a 16-stage resist block-printing tradition native to Dhamadka in Kutch. Artisans use hand-carved teakwood blocks, mineral mordants, and natural subterranean indigo fermentation vats to imprint celestial geometric star alignments.",
      suggestions: formatProductSuggestions(ids, catalog)
    }
  }

  // 9. Tussar / Ahimsa Silk / Bhagalpur
  if (q.includes('tussar') || q.includes('ahimsa') || q.includes('bhagalpur') || q.includes('stole')) {
    const tussarItem = catalog.find(p => p.name.toLowerCase().includes('tussar') || p.material.toLowerCase().includes('tussar'))
    const ids = tussarItem ? [tussarItem.id] : ['b0000001-0000-0000-0000-000000000003']
    return {
      reply: "Bhagalpur Ahimsa Tussar silk is harvested non-violently from wild forest cocoons after the silk moth has naturally emerged. It yields a distinctive, rich golden slub texture and is hand-dyed with botanical plant extracts.",
      suggestions: formatProductSuggestions(ids, catalog)
    }
  }

  // 10. Paithani / Maharashtra
  if (q.includes('paithani') || q.includes('yeola') || q.includes('peacock') || q.includes('pallu')) {
    const paithaniItem = catalog.find(p => p.name.toLowerCase().includes('paithani'))
    const ids = paithaniItem ? [paithaniItem.id] : ['b0000001-0000-0000-0000-000000000008']
    return {
      reply: "Yeola Paithani is often called the Queen of Silks in Maharashtra. It is handcrafted with an oblique interlocking tapestry weave pallu featuring vivid peacocks (Mor) and parrot motifs in pure gold and silver zari.",
      suggestions: formatProductSuggestions(ids, catalog)
    }
  }

  // 11. Kala Cotton / Home Textiles / Throws
  if (q.includes('kala cotton') || q.includes('throw') || q.includes('bhujodi') || (q.includes('cotton') && q.includes('throw'))) {
    const kalaItem = catalog.find(p => p.name.toLowerCase().includes('kala cotton'))
    const ids = kalaItem ? [kalaItem.id] : ['b0000001-0000-0000-0000-000000000007']
    return {
      reply: "Indigenous Kala cotton from Kutch is completely rain-fed and grown organically without pesticides. Master Vankar weavers craft tactile throws on pit looms with nomadic extra-weft geometric patterns and hand-braided fringe.",
      suggestions: formatProductSuggestions(ids, catalog)
    }
  }

  // 12. Raw Materials & Artisan Supplies (B2B)
  if (
    q.includes('yarn') ||
    q.includes('material') ||
    q.includes('raw material') ||
    q.includes('indigo') ||
    q.includes('dye') ||
    q.includes('muga') ||
    q.includes('hanks') ||
    q.includes('supplier')
  ) {
    return {
      reply: "Our B2B artisan supply network connects verified weavers directly with GI-certified raw material federations. We supply Grade AAA Mulberry filaments, rare wild Muga silk hanks, 100s count organic Khadi cotton, fermented Kutch indigo cakes, and 24k electroplated gold zari spools.",
      suggestions: [],
      materialSuggestions: rawMaterials.map(m => ({
        name: m.name,
        category: m.category,
        price: m.price,
        unit: m.unit,
        origin: m.origin
      }))
    }
  }

  // 13. GI Tags, Silk Mark, Authenticity
  if (q.includes('gi tag') || q.includes('geographical indication') || q.includes('authenticity') || q.includes('silk mark') || q.includes('certificate')) {
    return {
      reply: "Every heirloom on Handloom Connect is certified with its official Geographical Indication (GI) registry tag and Silk Mark accreditation. Each product includes a verifiable digital Authenticity Passport outlining warp thread count, weave density, loom type, and master artisan lineage.",
      suggestions: []
    }
  }

  // 14. Out of scope / Irrelevant inquiries
  const outOfScopeKeywords = ['weather', 'python', 'javascript', 'code', 'programming', 'crypto', 'bitcoin', 'sports', 'football', 'cricket score', 'recipe', 'movie', 'joke']
  if (outOfScopeKeywords.some(kw => q.includes(kw))) {
    return {
      reply: "As the Handloom Connect curator, my expertise is dedicated to authentic Indian handlooms, GI-certified weaves, master artisan stories, and sustainable raw materials. Please feel free to ask about regional weaves, bridal drapes, or our artisan catalog!",
      suggestions: []
    }
  }

  // 15. General search against catalog keywords
  const matched = catalog.filter(p => {
    const text = `${p.name} ${p.category} ${p.craft} ${p.region} ${p.material} ${p.description}`.toLowerCase()
    const tokens = q.split(/\s+/).filter(w => w.length > 2)
    return tokens.some(token => text.includes(token))
  })

  if (matched.length > 0) {
    return {
      reply: `Here are the authentic handloom pieces from our atelier matching your interest:`,
      suggestions: formatProductSuggestions(matched.slice(0, 3).map(p => p.id), catalog)
    }
  }

  // 16. Fallback conversational response when no direct match is found
  return {
    reply: "We carry a curated atelier of GI-certified Indian handlooms, including Banarasi Katan silk, Kanchipuram Korvai, Chanderi sheer silks, Yeola Paithani, Kashmiri Pashmina shawls, and organic Kutch textiles. Tell me about the drape, region, or occasion you have in mind and I would be delighted to guide you.",
    suggestions: []
  }
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { message, context, history } = await req.json()
    const userMessage = (message || '').trim()

    // 1. Dynamic Catalog Retrieval from Supabase Database (with cache fallback)
    const activeCatalog = await fetchCatalogProducts()
    const activeRawMaterials = await fetchRawMaterials()

    const geminiApiKey = Deno.env.get('GEMINI_API_KEY')
    const openAiApiKey = Deno.env.get('OPENAI_API_KEY')

    // Prepare catalog context for AI model
    const catalogContext = activeCatalog.map(p =>
      `- ID: "${p.id}" | Title: "${p.name}" | Category: "${p.category}" | Craft: "${p.craft}" | Region: "${p.region}" | Price: "${p.price}" | Material: "${p.material}" | Badge: "${p.badge || 'Standard'}"`
    ).join('\n')

    const systemPrompt = `You are the Handloom Connect AI Curator and Textile Stylist. You specialize in authentic Indian handloom textiles, GI-certified heirlooms, artisan provenance, and natural raw materials.
Provide culturally informed, elegant, polite, and concise guidance.

AUTHENTIC ATELIER CATALOG:
${catalogContext}

STRICT GUIDELINES:
1. GREETINGS (e.g., "Hi", "Hello", "Namaste"):
   Respond with a warm, welcoming greeting and ask what weave, occasion, or craft they would like to explore.
   DO NOT recommend any products on a simple greeting (return empty recommendedProductIds: []).
2. PRODUCT RECOMMENDATIONS:
   - When the user asks about specific occasions ("saree for a wedding"), regions ("Varanasi weave", "Kanchipuram"), or collections ("latest collections"), recommend 1 to 3 relevant products.
   - ONLY recommend products from the AUTHENTIC ATELIER CATALOG above. Use the exact product IDs.
   - For "latest collections" or "new": recommend items marked with "New" badge (e.g., Handspun Ahimsa Tussar Silk Stole, Kutch Natural Indigo Ajrakh Modal Kurta, Bhujodi Organic Kala Cotton Throw).
   - For "Varanasi weave": explain Varanasi pit-loom Kadwa weaving and recommend the Shikargah Katan Silk Banarasi Saree.
   - For "saree for a wedding": recommend suitable bridal sarees (Shikargah Banarasi, Korvai Kanchipuram, or Yeola Paithani).
   - If the user asks for something not in the catalog (e.g. Bandhani lehenga), clearly state that it is not currently in the collection rather than forcing unrelated products.
3. GENERAL & CULTURAL INQUIRIES: Answer questions about weaving techniques, GI tags, and fibers naturally without forcing product cards unless directly helpful.
4. IRRELEVANT INQUIRIES: If the user asks about unrelated topics (e.g., programming, weather), politely clarify your role as the Handloom Connect textile curator.
5. TONE: Modern, sophisticated, respectful. Avoid robotic clichés like "Thank you for consulting Handloom Connect" or "Our artisan guild specializes in...".

OUTPUT FORMAT:
You MUST respond with valid JSON:
{
  "reply": "Your conversational answer here...",
  "recommendedProductIds": ["exact-product-id-1"] // Only include IDs from the catalog when relevant, otherwise empty array []
}`

    let geminiDebug: {
      nativeStatus?: number;
      nativeError?: string;
      modelTried?: string;
      availableModels?: string[];
      compatStatus?: number;
      compatError?: string;
      exception?: string;
    } = {}

    // 2. Primary Provider: Google Gemini API (if GEMINI_API_KEY is configured)
    if (geminiApiKey) {
      try {
        const conversationMessages = [
          ...(Array.isArray(history)
            ? history.slice(-6).map((h: { sender: string; text: string }) => ({
                role: h.sender === 'user' ? 'user' : 'model',
                parts: [{ text: h.text }]
              }))
            : []),
          {
            role: 'user',
            parts: [{
              text: context?.currentPage
                ? `[Context: viewing ${context.currentPage}] ${userMessage}`
                : userMessage
            }]
          }
        ]

        // Helper to invoke generateContent for a given model
        const tryGenerateContent = async (modelName: string) => {
          const cleanModel = modelName.replace(/^models\//, '')
          const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${cleanModel}:generateContent?key=${geminiApiKey}`
          const response = await fetch(geminiUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              systemInstruction: {
                parts: [{ text: systemPrompt }]
              },
              contents: conversationMessages,
              generationConfig: {
                temperature: 0.7,
                maxOutputTokens: 600,
                responseMimeType: 'application/json'
              }
            })
          })
          return { response, model: cleanModel }
        }

        // Try candidate models: gemini-1.5-flash first, then 2026 active models
        const candidateModels = ['gemini-1.5-flash', 'gemini-2.5-flash', 'gemini-flash-latest', 'gemini-2.5-pro', 'gemini-pro-latest']
        let aiResponse: Response | null = null
        let chosenModel = ''

        for (const candidate of candidateModels) {
          const attempt = await tryGenerateContent(candidate)
          aiResponse = attempt.response
          chosenModel = attempt.model
          geminiDebug.modelTried = chosenModel

          if (aiResponse.ok) {
            break
          }
          // If status is not 404 (e.g., 429 quota, 403, 400), stop trying other candidates
          if (aiResponse.status !== 404) {
            break
          }
        }

        // If candidates 404, dynamically discover supported models via ListModels
        if (aiResponse && !aiResponse.ok && aiResponse.status === 404) {
          try {
            const listUrl = `https://generativelanguage.googleapis.com/v1beta/models?key=${geminiApiKey}`
            const listRes = await fetch(listUrl)
            if (listRes.ok) {
              const listData = await listRes.json()
              const supportedModels: string[] = (listData.models || [])
                .filter((m: { supportedGenerationMethods?: string[] }) =>
                  Array.isArray(m.supportedGenerationMethods) && m.supportedGenerationMethods.includes('generateContent')
                )
                .map((m: { name: string }) => m.name.replace(/^models\//, ''))
              geminiDebug.availableModels = supportedModels

              const discoveredModel = supportedModels.find(m => m === 'gemini-2.5-flash') ||
                supportedModels.find(m => m.includes('flash')) ||
                supportedModels.find(m => m.includes('pro')) ||
                supportedModels[0]

              if (discoveredModel) {
                const attemptDiscovered = await tryGenerateContent(discoveredModel)
                aiResponse = attemptDiscovered.response
                chosenModel = attemptDiscovered.model
                geminiDebug.modelTried = chosenModel
              }
            }
          } catch (listErr) {
            console.warn('Failed to dynamically discover Gemini models:', listErr)
          }
        }

        if (aiResponse && aiResponse.ok) {
          const data = await aiResponse.json()
          const rawText = data.candidates?.[0]?.content?.parts?.[0]?.text?.trim()
          if (rawText) {
            try {
              const parsed = JSON.parse(rawText)
              const replyText = parsed.reply?.trim()
              const recIds: string[] = Array.isArray(parsed.recommendedProductIds) ? parsed.recommendedProductIds : []
              const suggestions = formatProductSuggestions(recIds, activeCatalog)

              if (replyText) {
                return new Response(
                  JSON.stringify({
                    reply: replyText,
                    suggestions,
                    provider: 'gemini',
                    model: chosenModel
                  }),
                  { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
                )
              }
            } catch {
              return new Response(
                JSON.stringify({
                  reply: rawText,
                  suggestions: [],
                  provider: 'gemini',
                  model: chosenModel
                }),
                { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
              )
            }
          }
        } else if (aiResponse) {
          geminiDebug.nativeStatus = aiResponse.status
          try {
            const errText = await aiResponse.text()
            const errJson = JSON.parse(errText)
            geminiDebug.nativeError = (errJson?.error?.message || errJson?.error?.status || errText.slice(0, 200))
              .replace(/AIza[0-9A-Za-z-_]+/g, '[REDACTED]')
              .replace(/key=[^&\s"]+/gi, 'key=[REDACTED]')
          } catch {
            geminiDebug.nativeError = 'Failed to parse error response'
          }

          // Fallback Endpoint: OpenAI-compatible Gemini endpoint
          const openAiCompatUrl = 'https://generativelanguage.googleapis.com/v1beta/openai/chat/completions'
          const compatResponse = await fetch(openAiCompatUrl, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${geminiApiKey}`
            },
            body: JSON.stringify({
              model: chosenModel || 'gemini-1.5-flash',
              messages: [
                { role: 'system', content: systemPrompt },
                ...(Array.isArray(history)
                  ? history.slice(-6).map((h: { sender: string; text: string }) => ({
                      role: h.sender === 'user' ? 'user' : 'assistant',
                      content: h.text
                    }))
                  : []),
                { role: 'user', content: userMessage }
              ],
              temperature: 0.7,
              max_tokens: 600
            })
          })

          if (compatResponse.ok) {
            const compatData = await compatResponse.json()
            const replyContent = compatData.choices?.[0]?.message?.content?.trim()
            if (replyContent) {
              try {
                const parsed = JSON.parse(replyContent)
                const recIds: string[] = Array.isArray(parsed.recommendedProductIds) ? parsed.recommendedProductIds : []
                return new Response(
                  JSON.stringify({
                    reply: parsed.reply || replyContent,
                    suggestions: formatProductSuggestions(recIds, activeCatalog),
                    provider: 'gemini-openai-compat'
                  }),
                  { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
                )
              } catch {
                return new Response(
                  JSON.stringify({
                    reply: replyContent,
                    suggestions: [],
                    provider: 'gemini-openai-compat'
                  }),
                  { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
                )
              }
            }
          } else {
            geminiDebug.compatStatus = compatResponse.status
            try {
              const compatErrText = await compatResponse.text()
              const compatErrJson = JSON.parse(compatErrText)
              geminiDebug.compatError = (compatErrJson?.error?.message || compatErrJson?.error?.status || compatErrText.slice(0, 200))
                .replace(/AIza[0-9A-Za-z-_]+/g, '[REDACTED]')
                .replace(/Bearer\s+[^\s"]+/gi, 'Bearer [REDACTED]')
            } catch {
              geminiDebug.compatError = 'Failed to parse compat error'
            }
          }
        }
      } catch (geminiErr: unknown) {
        console.warn('Gemini request encountered an exception, proceeding to resilient domain fallback:', geminiErr)
      }
    }

    // 3. Optional Secondary Provider: OpenAI (if OPENAI_API_KEY is configured)
    if (openAiApiKey) {
      try {
        const messages = [
          { role: 'system', content: systemPrompt },
          ...(Array.isArray(history)
            ? history.slice(-6).map((h: { sender: string; text: string }) => ({
                role: h.sender === 'user' ? 'user' : 'assistant',
                content: h.text
              }))
            : []),
          { role: 'user', content: userMessage }
        ]

        const aiResponse = await fetch('https://api.openai.com/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${openAiApiKey}`
          },
          body: JSON.stringify({
            model: 'gpt-4o-mini',
            messages,
            response_format: { type: 'json_object' },
            temperature: 0.7,
            max_tokens: 600
          })
        })

        if (aiResponse.ok) {
          const data = await aiResponse.json()
          const content = data.choices?.[0]?.message?.content?.trim()
          if (content) {
            const parsed = JSON.parse(content)
            const recIds: string[] = Array.isArray(parsed.recommendedProductIds) ? parsed.recommendedProductIds : []
            return new Response(
              JSON.stringify({
                reply: parsed.reply || content,
                suggestions: formatProductSuggestions(recIds, activeCatalog),
                provider: 'openai'
              }),
              { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
            )
          }
        }
      } catch (openAiErr) {
        console.warn('OpenAI request failed, proceeding to resilient domain fallback:', openAiErr)
      }
    }

    // 4. Resilient Domain Fallback
    const fallbackResult = generateDomainFallback(userMessage, activeCatalog, activeRawMaterials, context)
    return new Response(
      JSON.stringify({
        ...fallbackResult,
        provider: 'domain-fallback',
        geminiDebug: Object.keys(geminiDebug).length > 0 ? geminiDebug : undefined
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error: unknown) {
    const errorMsg = error instanceof Error ? error.message : 'Unknown error'
    return new Response(JSON.stringify({ error: errorMsg }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 400
    })
  }
})
