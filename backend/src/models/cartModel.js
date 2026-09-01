import { query } from '../config/db.js'

export const cartModel = {
  async getCart(userId) {
    const sql = `
      SELECT 
        ci.product_id as productId,
        ci.quantity,
        p.name,
        p.price,
        p.display_price as displayPrice,
        p.images,
        p.technique as craft,
        a.name as artisanName,
        p.region as cluster,
        p.in_stock as inStock,
        p.stock_quantity as stockQuantity
      FROM cart_items ci
      JOIN products p ON ci.product_id = p.id
      JOIN artisans a ON p.artisan_id = a.id
      WHERE ci.user_id = ?
      ORDER BY ci.created_at ASC
    `
    const rows = await query(sql, [userId])
    return rows.map(r => {
      const parsedImages = typeof r.images === 'string' ? JSON.parse(r.images) : (r.images || [])
      return {
        productId: r.productId,
        quantity: r.quantity,
        name: r.name,
        price: Number(r.price),
        displayPrice: r.displayPrice,
        image: parsedImages[0] || '',
        craft: r.craft,
        artisanName: r.artisanName,
        cluster: r.cluster,
        inStock: Boolean(r.inStock)
      }
    })
  },

  async addItem(userId, productId, quantity = 1) {
    // Verify product exists and in stock
    const products = await query('SELECT id, in_stock FROM products WHERE id = ? LIMIT 1', [productId])
    if (!products.length || !products[0].in_stock) {
      throw new Error('Product not available or out of stock')
    }

    await query(
      `INSERT INTO cart_items (user_id, product_id, quantity)
       VALUES (?, ?, ?)
       ON DUPLICATE KEY UPDATE quantity = quantity + VALUES(quantity)`,
      [userId, productId, Math.max(1, quantity)]
    )

    return this.getCart(userId)
  },

  async updateQuantity(userId, productId, quantity) {
    if (quantity <= 0) {
      return this.removeItem(userId, productId)
    }

    await query(
      'UPDATE cart_items SET quantity = ? WHERE user_id = ? AND product_id = ?',
      [quantity, userId, productId]
    )

    return this.getCart(userId)
  },

  async removeItem(userId, productId) {
    await query('DELETE FROM cart_items WHERE user_id = ? AND product_id = ?', [userId, productId])
    return this.getCart(userId)
  },

  async clearCart(userId) {
    await query('DELETE FROM cart_items WHERE user_id = ?', [userId])
    return []
  },

  async syncCart(userId, items = []) {
    if (!Array.isArray(items) || items.length === 0) {
      return this.getCart(userId)
    }

    for (const item of items) {
      if (item.productId && item.quantity > 0) {
        await query(
          `INSERT INTO cart_items (user_id, product_id, quantity)
           VALUES (?, ?, ?)
           ON DUPLICATE KEY UPDATE quantity = GREATEST(quantity, VALUES(quantity))`,
          [userId, item.productId, item.quantity]
        )
      }
    }

    return this.getCart(userId)
  }
}
