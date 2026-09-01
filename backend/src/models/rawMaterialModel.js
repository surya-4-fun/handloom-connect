import { query } from '../config/db.js'

function formatRawMaterial(row) {
  if (!row) return null
  return {
    id: row.id,
    name: row.name,
    category: row.category,
    materialType: row.material_type,
    origin: row.origin,
    supplier: {
      id: row.supplier_id,
      name: row.supplier_name,
      location: row.supplier_location,
      rating: Number(row.supplier_rating || 4.9),
      certified: Boolean(row.supplier_certified),
      verifiedGI: Boolean(row.supplier_verified_gi),
      specialty: row.supplier_specialty,
      contactEmail: row.supplier_email
    },
    quality: row.quality,
    quantityUnit: row.quantity_unit,
    price: Number(row.price),
    displayPrice: row.display_price || `₹${Number(row.price).toLocaleString('en-IN')}`,
    minOrderQty: row.min_order_qty,
    inStock: Boolean(row.in_stock),
    sustainabilityInfo: row.sustainability_info,
    description: row.description,
    images: typeof row.images === 'string' ? JSON.parse(row.images) : (row.images || []),
    badge: row.badge,
    denierOrCount: row.denier_or_count,
    createdAt: row.created_at
  }
}

export const rawMaterialModel = {
  async getAll(filters = {}) {
    let sql = `
      SELECT rm.*, 
        s.name as supplier_name, 
        s.location as supplier_location, 
        s.rating as supplier_rating, 
        s.certified as supplier_certified, 
        s.verified_gi as supplier_verified_gi, 
        s.specialty as supplier_specialty, 
        s.contact_email as supplier_email
      FROM raw_materials rm
      JOIN material_suppliers s ON rm.supplier_id = s.id
      WHERE 1=1
    `
    const params = []

    if (filters.category && filters.category !== 'all') {
      sql += ' AND rm.category = ?'
      params.push(filters.category)
    }

    if (filters.origin && filters.origin !== 'all') {
      sql += ' AND rm.origin LIKE ?'
      params.push(`%${filters.origin}%`)
    }

    if (filters.quality && filters.quality !== 'all') {
      sql += ' AND rm.quality = ?'
      params.push(filters.quality)
    }

    if (filters.inStockOnly) {
      sql += ' AND rm.in_stock = 1'
    }

    if (filters.search && filters.search.trim()) {
      const term = `%${filters.search.trim()}%`
      sql += ' AND (rm.name LIKE ? OR rm.material_type LIKE ? OR rm.origin LIKE ? OR s.name LIKE ?)'
      params.push(term, term, term, term)
    }

    switch (filters.sort) {
      case 'price-asc':
        sql += ' ORDER BY rm.price ASC'
        break
      case 'price-desc':
        sql += ' ORDER BY rm.price DESC'
        break
      case 'min-order':
        sql += ' ORDER BY rm.min_order_qty ASC'
        break
      case 'featured':
      default:
        sql += ' ORDER BY rm.badge IS NOT NULL DESC, rm.price DESC'
        break
    }

    const rows = await query(sql, params)
    return rows.map(formatRawMaterial)
  },

  async getById(id) {
    const sql = `
      SELECT rm.*, 
        s.name as supplier_name, 
        s.location as supplier_location, 
        s.rating as supplier_rating, 
        s.certified as supplier_certified, 
        s.verified_gi as supplier_verified_gi, 
        s.specialty as supplier_specialty, 
        s.contact_email as supplier_email
      FROM raw_materials rm
      JOIN material_suppliers s ON rm.supplier_id = s.id
      WHERE rm.id = ?
      LIMIT 1
    `
    const rows = await query(sql, [id])
    return formatRawMaterial(rows[0])
  },

  async createBulkRequest(data) {
    const referenceNo = `B2B-${Math.floor(100000 + Math.random() * 900000)}`
    await query(
      `INSERT INTO bulk_requests 
        (reference_no, material_id, material_name, requested_qty, unit, artisan_name, organization_name, email, phone, notes, color_shade_ref)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        referenceNo,
        data.materialId,
        data.materialName,
        data.requestedQty,
        data.unit || 'kg',
        data.artisanName,
        data.organizationName || null,
        data.email,
        data.phone,
        data.notes || null,
        data.colorShadeRef || null
      ]
    )

    return { referenceNo, ...data }
  }
}
