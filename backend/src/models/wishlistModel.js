import { query } from '../config/db.js'

export const wishlistModel = {
  async getWishlistIds(userId) {
    const rows = await query('SELECT product_id FROM wishlist_items WHERE user_id = ? ORDER BY created_at DESC', [userId])
    return rows.map(r => r.product_id)
  },

  async getWishlistProducts(userId) {
    const sql = `
      SELECT p.*, a.name as artisan_name
      FROM wishlist_items wi
      JOIN products p ON wi.product_id = p.id
      JOIN artisans a ON p.artisan_id = a.id
      WHERE wi.user_id = ?
      ORDER BY wi.created_at DESC
    `
    const rows = await query(sql, [userId])
    return rows.map(row => {
      const parsedImages = typeof row.images === 'string' ? JSON.parse(row.images) : (row.images || [])
      return {
        id: row.id,
        name: row.name,
        slug: row.slug,
        category: row.category_id,
        price: Number(row.price),
        displayPrice: row.display_price,
        images: parsedImages,
        alt: row.alt,
        material: row.material,
        region: row.region,
        technique: row.technique,
        artisanId: row.artisan_id,
        artisanName: row.artisan_name,
        description: row.description,
        dimensions: row.dimensions,
        care: row.care,
        provenance: row.provenance,
        badge: row.badge,
        inStock: Boolean(row.in_stock)
      }
    })
  },

  async toggleWishlist(userId, productId) {
    const rows = await query('SELECT id FROM wishlist_items WHERE user_id = ? AND product_id = ? LIMIT 1', [userId, productId])
    if (rows.length > 0) {
      await query('DELETE FROM wishlist_items WHERE user_id = ? AND product_id = ?', [userId, productId])
      return { inWishlist: false }
    } else {
      await query('INSERT INTO wishlist_items (user_id, product_id) VALUES (?, ?)', [userId, productId])
      return { inWishlist: true }
    }
  }
}
