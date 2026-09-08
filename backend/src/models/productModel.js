import { query } from '../config/db.js'

function formatProduct(row) {
  if (!row) return null
  return {
    id: row.id,
    name: row.name,
    slug: row.slug,
    category: row.category_id || row.category,
    price: Number(row.price),
    displayPrice: row.display_price || `₹${Number(row.price).toLocaleString('en-IN')}`,
    images: typeof row.images === 'string' ? JSON.parse(row.images) : (row.images || []),
    alt: row.alt,
    material: row.material,
    region: row.region,
    technique: row.technique,
    artisanId: row.artisan_id || row.artisanId,
    artisanName: row.artisan_name || undefined,
    artisan: row.artisan_name ? {
      id: row.artisan_id || row.artisanId,
      name: row.artisan_name,
      craft: row.artisan_craft,
      region: row.artisan_region,
      avatarUrl: row.artisan_image
    } : undefined,
    description: row.description,
    dimensions: row.dimensions,
    care: row.care,
    provenance: row.provenance,
    badge: row.badge,
    inStock: Boolean(row.in_stock),
    stockQuantity: row.stock_quantity || 0,
    createdAt: row.created_at
  }
}

function formatPassport(row) {
  if (!row) return null
  return {
    authenticityId: row.id,
    productId: row.product_id,
    productName: row.product_name || '',
    verificationStatus: row.verification_status,
    handwovenVerified: Boolean(row.handwoven_verified),
    originVerified: Boolean(row.origin_verified),
    giRegistryNo: row.gi_registry_no,
    silkMarkNo: row.silk_mark_no,
    loomType: row.loom_type,
    warpThreadCount: row.warp_thread_count,
    weaveDensity: row.weave_density,
    culturalStory: row.cultural_story,
    craftJourney: typeof row.craft_journey === 'string' ? JSON.parse(row.craft_journey) : (row.craft_journey || [])
  }
}

export const productModel = {
  async getAll(filters = {}) {
    let sql = 'SELECT p.*, a.name as artisan_name, a.craft as artisan_craft, a.region as artisan_region, a.image as artisan_image FROM products p LEFT JOIN artisans a ON p.artisan_id = a.id WHERE 1=1'
    let countSql = 'SELECT COUNT(*) as total FROM products p LEFT JOIN artisans a ON p.artisan_id = a.id WHERE 1=1'
    const params = []
    const countParams = []

    // Category
    if (filters.category && filters.category !== 'all') {
      sql += ' AND p.category_id = ?'
      countSql += ' AND p.category_id = ?'
      params.push(filters.category)
      countParams.push(filters.category)
    }

    // Search
    if (filters.search && filters.search.trim()) {
      const term = `%${filters.search.trim()}%`
      const searchClause = ' AND (p.name LIKE ? OR p.description LIKE ? OR p.material LIKE ? OR p.region LIKE ? OR p.technique LIKE ? OR a.name LIKE ?)'
      sql += searchClause
      countSql += searchClause
      params.push(term, term, term, term, term, term)
      countParams.push(term, term, term, term, term, term)
    }

    // Price range
    if (filters.minPrice !== undefined && filters.minPrice !== null) {
      sql += ' AND p.price >= ?'
      countSql += ' AND p.price >= ?'
      params.push(Number(filters.minPrice))
      countParams.push(Number(filters.minPrice))
    }
    if (filters.maxPrice !== undefined && filters.maxPrice !== null) {
      sql += ' AND p.price <= ?'
      countSql += ' AND p.price <= ?'
      params.push(Number(filters.maxPrice))
      countParams.push(Number(filters.maxPrice))
    }

    // In stock
    if (filters.inStockOnly) {
      sql += ' AND p.in_stock = 1'
      countSql += ' AND p.in_stock = 1'
    }

    // Materials array
    if (Array.isArray(filters.materials) && filters.materials.length > 0) {
      const matClauses = filters.materials.map(() => 'p.material LIKE ?').join(' OR ')
      sql += ` AND (${matClauses})`
      countSql += ` AND (${matClauses})`
      filters.materials.forEach(m => {
        params.push(`%${m}%`)
        countParams.push(`%${m}%`)
      })
    }

    // Regions array
    if (Array.isArray(filters.regions) && filters.regions.length > 0) {
      const regClauses = filters.regions.map(() => 'p.region LIKE ?').join(' OR ')
      sql += ` AND (${regClauses})`
      countSql += ` AND (${regClauses})`
      filters.regions.forEach(r => {
        params.push(`%${r}%`)
        countParams.push(`%${r}%`)
      })
    }

    // Techniques array
    if (Array.isArray(filters.techniques) && filters.techniques.length > 0) {
      const techClauses = filters.techniques.map(() => 'p.technique LIKE ?').join(' OR ')
      sql += ` AND (${techClauses})`
      countSql += ` AND (${techClauses})`
      filters.techniques.forEach(t => {
        params.push(`%${t}%`)
        countParams.push(`%${t}%`)
      })
    }

    // Artisan IDs array
    if (Array.isArray(filters.artisanIds) && filters.artisanIds.length > 0) {
      const artPlaceholders = filters.artisanIds.map(() => '?').join(', ')
      sql += ` AND p.artisan_id IN (${artPlaceholders})`
      countSql += ` AND p.artisan_id IN (${artPlaceholders})`
      filters.artisanIds.forEach(id => {
        params.push(id)
        countParams.push(id)
      })
    }

    // Sort
    switch (filters.sort) {
      case 'price-asc':
        sql += ' ORDER BY p.price ASC'
        break
      case 'price-desc':
        sql += ' ORDER BY p.price DESC'
        break
      case 'newest':
        sql += ' ORDER BY p.created_at DESC'
        break
      case 'popular':
        sql += ' ORDER BY p.badge = "Bestseller" DESC, p.price DESC'
        break
      case 'featured':
      default:
        sql += ' ORDER BY p.badge = "Bestseller" DESC, p.badge = "Handwoven" DESC, p.created_at DESC'
        break
    }

    // Pagination
    if (filters.limit) {
      const limit = parseInt(filters.limit, 10)
      const page = parseInt(filters.page || '1', 10)
      const offset = (page - 1) * limit
      sql += ' LIMIT ? OFFSET ?'
      params.push(limit, offset)
    }

    const [rows, countRes] = await Promise.all([
      query(sql, params),
      query(countSql, countParams)
    ])

    return {
      products: rows.map(formatProduct),
      totalCount: countRes[0]?.total || 0
    }
  },

  async getByIdOrSlug(idOrSlug) {
    const rows = await query(
      'SELECT p.*, a.name as artisan_name, a.craft as artisan_craft, a.region as artisan_region, a.image as artisan_image FROM products p LEFT JOIN artisans a ON p.artisan_id = a.id WHERE p.id = ? OR p.slug = ? LIMIT 1',
      [idOrSlug, idOrSlug]
    )
    return formatProduct(rows[0])
  },

  async getPassportByProductId(productId) {
    const rows = await query(
      'SELECT ap.*, p.name as product_name FROM authenticity_passports ap JOIN products p ON ap.product_id = p.id WHERE ap.product_id = ? OR p.slug = ? LIMIT 1',
      [productId, productId]
    )
    return formatPassport(rows[0])
  },

  async getProductsByArtisanId(artisanId) {
    const rows = await query(
      'SELECT p.*, a.name as artisan_name, a.craft as artisan_craft, a.region as artisan_region, a.image as artisan_image FROM products p LEFT JOIN artisans a ON p.artisan_id = a.id WHERE p.artisan_id = ? ORDER BY p.created_at DESC',
      [artisanId]
    )
    return rows.map(formatProduct)
  },

  async getRelated(productId, categoryId, region, limit = 4) {
    const rows = await query(
      'SELECT p.*, a.name as artisan_name, a.craft as artisan_craft, a.region as artisan_region, a.image as artisan_image FROM products p LEFT JOIN artisans a ON p.artisan_id = a.id WHERE p.id != ? AND (p.category_id = ? OR p.region LIKE ?) LIMIT ?',
      [productId, categoryId, `%${region.split(',')[0]}%`, limit]
    )
    return rows.map(formatProduct)
  },

  async get360Images(productId) {
    const rows = await query(
      'SELECT image_url, sequence_number, angle_label FROM product_360_images WHERE product_id = ? ORDER BY sequence_number ASC',
      [productId]
    )
    return rows.map(r => ({
      sequence: r.sequence_number,
      url: r.image_url,
      angleLabel: r.angle_label
    }))
  },

  async getFacets() {
    const [materials, regions, techniques, priceRange] = await Promise.all([
      query('SELECT DISTINCT material FROM products WHERE in_stock = 1 ORDER BY material ASC'),
      query('SELECT DISTINCT region FROM products WHERE in_stock = 1 ORDER BY region ASC'),
      query('SELECT DISTINCT technique FROM products WHERE in_stock = 1 ORDER BY technique ASC'),
      query('SELECT MIN(price) as minPrice, MAX(price) as maxPrice FROM products WHERE in_stock = 1')
    ])

    return {
      materials: materials.map(m => m.material),
      regions: regions.map(r => r.region),
      techniques: techniques.map(t => t.technique),
      minPrice: Number(priceRange[0]?.minPrice || 0),
      maxPrice: Number(priceRange[0]?.maxPrice || 100000)
    }
  }
}
