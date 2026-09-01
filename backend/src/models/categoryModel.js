import { query } from '../config/db.js'

export const categoryModel = {
  async getAllWithCounts() {
    const categories = await query('SELECT id, label, image FROM categories ORDER BY id = "all" DESC, label ASC')
    const productCounts = await query('SELECT category_id, COUNT(*) as count FROM products WHERE in_stock = 1 GROUP BY category_id')
    const totalCountRes = await query('SELECT COUNT(*) as total FROM products WHERE in_stock = 1')
    const totalProducts = totalCountRes[0]?.total || 0

    const countMap = {}
    productCounts.forEach(pc => {
      countMap[pc.category_id] = pc.count
    })

    return categories.map(cat => ({
      id: cat.id,
      label: cat.label,
      image: cat.image,
      count: cat.id === 'all' ? totalProducts : (countMap[cat.id] || 0)
    }))
  },

  async getById(id) {
    const rows = await query('SELECT id, label, image FROM categories WHERE id = ? LIMIT 1', [id])
    return rows[0] || null
  }
}
