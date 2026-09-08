import { pool, query } from '../config/db.js'

function formatOrder(row, items = []) {
  if (!row) return null
  return {
    id: row.id,
    userId: row.user_id,
    createdAt: row.created_at,
    items: items.map(i => ({
      productId: i.product_id,
      name: i.name,
      price: Number(i.price),
      displayPrice: i.display_price || `₹${Number(i.price).toLocaleString('en-IN')}`,
      quantity: i.quantity,
      image: i.image,
      craft: i.craft,
      artisanName: i.artisan_name,
      cluster: i.cluster
    })),
    shippingAddress: typeof row.shipping_address === 'string' ? JSON.parse(row.shipping_address) : row.shipping_address,
    deliveryMethod: typeof row.delivery_method === 'string' ? JSON.parse(row.delivery_method) : row.delivery_method,
    paymentDetails: typeof row.payment_details === 'string' ? JSON.parse(row.payment_details) : row.payment_details,
    subtotal: Number(row.subtotal),
    shippingFee: Number(row.shipping_fee),
    giftBoxFee: Number(row.gift_box_fee),
    taxFee: Number(row.tax_fee),
    totalAmount: Number(row.total_amount),
    status: row.status,
    currentStage: row.current_stage,
    totalHours: row.total_hours,
    completedHours: row.completed_hours,
    estimatedDelivery: row.estimated_delivery,
    silkMarkNo: row.silk_mark_no,
    giTagNo: row.gi_tag_no
  }
}

export const orderModel = {
  async createOrderWithItems({ userId = null, items = [], shippingAddress, deliveryMethod, paymentDetails, includeGiftBox = false }) {
    const conn = await pool.getConnection()
    try {
      await conn.beginTransaction()

      if (!items || items.length === 0) {
        throw new Error('Cannot create order with empty items list')
      }

      // 1. Fetch products from DB to verify price & stock
      let calculatedSubtotal = 0
      const validatedItems = []

      for (const item of items) {
        const [prodRows] = await conn.query(
          `SELECT p.*, a.name as artisan_name 
           FROM products p 
           JOIN artisans a ON p.artisan_id = a.id 
           WHERE p.id = ? OR p.slug = ? FOR UPDATE`,
          [item.productId, item.productId]
        )

        if (!prodRows.length) {
          throw new Error(`Product "${item.productId}" not found`)
        }

        const product = prodRows[0]
        const quantity = Math.max(1, parseInt(item.quantity || '1', 10))

        if (!product.in_stock || product.stock_quantity < quantity) {
          throw new Error(`Insufficient stock for product "${product.name}". Available: ${product.stock_quantity || 0}`)
        }

        const price = Number(product.price)
        calculatedSubtotal += price * quantity

        const images = typeof product.images === 'string' ? JSON.parse(product.images) : product.images
        const firstImage = Array.isArray(images) && images.length ? images[0] : item.image || ''

        validatedItems.push({
          productId: product.id,
          name: product.name,
          price,
          displayPrice: product.display_price || `₹${price.toLocaleString('en-IN')}`,
          quantity,
          image: firstImage,
          craft: product.technique || 'Handloom Weave',
          artisanName: product.artisan_name || 'Master Weaver Guild',
          cluster: product.region || 'India Weaving Cluster'
        })
      }

      // 2. Server-side cost calculation
      const giftBoxFee = includeGiftBox ? 750 : 0
      const shippingFee = deliveryMethod?.cost ? Number(deliveryMethod.cost) : 0
      const taxFee = Math.round(calculatedSubtotal * 0.05) // 5% handloom GST
      const totalAmount = calculatedSubtotal + giftBoxFee + shippingFee + taxFee

      // 3. Estimated delivery calculation (3 to 6 days from now)
      const estDate = new Date()
      estDate.setDate(estDate.getDate() + (deliveryMethod?.id === 'express' ? 3 : 6))
      const estDateStr = estDate.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })

      // 4. Generate unique Order ID
      const randomNum = Math.floor(1000 + Math.random() * 9000)
      const orderId = `HC-2026-${randomNum}`
      const silkMarkNo = `SM-IND-2026-${Math.floor(1000 + Math.random() * 9000)}`
      const giTagNo = `GI-GUILD-2026-${Math.floor(1000 + Math.random() * 9000)}`

      // 5. Insert Order
      await conn.query(
        `INSERT INTO orders 
          (id, user_id, shipping_address, delivery_method, payment_details, subtotal, shipping_fee, gift_box_fee, tax_fee, total_amount, status, current_stage, total_hours, completed_hours, estimated_delivery, silk_mark_no, gi_tag_no)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'commissioned', 0, 120, 12, ?, ?, ?)`,
        [
          orderId,
          userId || null,
          JSON.stringify(shippingAddress),
          JSON.stringify(deliveryMethod),
          JSON.stringify(paymentDetails),
          calculatedSubtotal,
          shippingFee,
          giftBoxFee,
          taxFee,
          totalAmount,
          estDateStr,
          silkMarkNo,
          giTagNo
        ]
      )

      // 6. Insert Order Items & Update Stock
      for (const vi of validatedItems) {
        await conn.query(
          `INSERT INTO order_items 
            (order_id, product_id, name, price, display_price, quantity, image, craft, artisan_name, cluster)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          [
            orderId,
            vi.productId,
            vi.name,
            vi.price,
            vi.displayPrice,
            vi.quantity,
            vi.image,
            vi.craft,
            vi.artisanName,
            vi.cluster
          ]
        )

        // Decrement stock
        await conn.query(
          'UPDATE products SET stock_quantity = GREATEST(0, stock_quantity - ?) WHERE id = ?',
          [vi.quantity, vi.productId]
        )
      }

      // 7. Clear cart if authenticated
      if (userId) {
        await conn.query('DELETE FROM cart_items WHERE user_id = ?', [userId])
      }

      await conn.commit()

      return this.getOrderById(orderId)
    } catch (err) {
      await conn.rollback()
      throw err
    } finally {
      conn.release()
    }
  },

  async getOrderById(orderId) {
    if (!orderId || typeof orderId !== 'string') return null
    const cleanId = orderId.trim().toUpperCase()
    const orderRows = await query('SELECT * FROM orders WHERE UPPER(id) = ? LIMIT 1', [cleanId])
    if (!orderRows || !orderRows.length) return null

    const itemRows = await query('SELECT * FROM order_items WHERE order_id = ?', [orderRows[0].id])
    return formatOrder(orderRows[0], itemRows)
  },

  async getOrdersByUserId(userId) {
    const orders = await query('SELECT * FROM orders WHERE user_id = ? ORDER BY created_at DESC', [userId])
    if (!orders.length) return []

    const orderIds = orders.map(o => o.id)
    const placeholders = orderIds.map(() => '?').join(', ')
    const allItems = await query(`SELECT * FROM order_items WHERE order_id IN (${placeholders})`, orderIds)

    const itemsMap = {}
    allItems.forEach(item => {
      if (!itemsMap[item.order_id]) itemsMap[item.order_id] = []
      itemsMap[item.order_id].push(item)
    })

    return orders.map(ord => formatOrder(ord, itemsMap[ord.id] || []))
  },

  async updateOrderStatus(orderId, { status, currentStage, completedHours }) {
    await query(
      `UPDATE orders SET 
        status = COALESCE(?, status), 
        current_stage = COALESCE(?, current_stage), 
        completed_hours = COALESCE(?, completed_hours) 
       WHERE id = ?`,
      [status, currentStage, completedHours, orderId]
    )
    return this.getOrderById(orderId)
  }
}
