import http from 'http'
import jwt from 'jsonwebtoken'
import app from '../src/app.js'
import { orderModel } from '../src/models/orderModel.js'

const PORT = 5097
const JWT_SECRET = process.env.JWT_SECRET

const ownerToken = jwt.sign(
  { id: 'user_hc_2026', email: 'collector@handloomconnect.com', role: 'customer', fullName: 'Ananya Collector' },
  JWT_SECRET,
  { expiresIn: '2h' }
)

const intruderToken = jwt.sign(
  { id: 'user_intruder_999', email: 'intruder@example.com', role: 'customer', fullName: 'Intruder' },
  JWT_SECRET,
  { expiresIn: '2h' }
)

const adminToken = jwt.sign(
  { id: 'user_admin_hc', email: 'admin@handloomconnect.in', role: 'admin', fullName: 'Curator Admin' },
  JWT_SECRET,
  { expiresIn: '2h' }
)

function request(path, options = {}) {
  return new Promise((resolve, reject) => {
    const reqOptions = {
      hostname: '127.0.0.1',
      port: PORT,
      path,
      method: options.method || 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...(options.headers || {})
      }
    }

    const req = http.request(reqOptions, (res) => {
      let data = ''
      res.on('data', chunk => { data += chunk })
      res.on('end', () => {
        try {
          const json = JSON.parse(data)
          resolve({ status: res.statusCode, data: json })
        } catch {
          resolve({ status: res.statusCode, data })
        }
      })
    })

    req.on('error', reject)
    if (options.body) {
      req.write(JSON.stringify(options.body))
    }
    req.end()
  })
}

let passed = 0
let failed = 0

function test(description, condition, details = '') {
  if (condition) {
    console.log(`  ✅ [PASS] ${description}`)
    passed++
  } else {
    console.error(`  ❌ [FAIL] ${description} ${details ? `(${details})` : ''}`)
    failed++
  }
}

async function runOrderRegressionTests() {
  console.log('======================================================================')
  console.log('STARTING ORDER RETRIEVAL & COMMISSIONING REGRESSION TEST SUITE')
  console.log('======================================================================')

  const server = app.listen(PORT, async () => {
    try {
      console.log(`✓ Express test server listening on port ${PORT}\n`)

      // ------------------------------------------------------------------
      // Test A: Direct Model - Successful order retrieval (Existing Seeded Order)
      // ------------------------------------------------------------------
      console.log('--- Test A: Successful Order Retrieval (Direct Model) ---')
      const seededOrderId = 'HC-2026-8942'
      const seededOrder = await orderModel.getOrderById(seededOrderId)

      test('getOrderById returns non-null for existing seeded order', seededOrder !== null)
      test('Returned order ID matches requested ID', seededOrder?.id === seededOrderId)
      test('Returned order contains user ID', seededOrder?.userId === 'user_hc_2026')
      test('Returned order contains parsed shippingAddress object', typeof seededOrder?.shippingAddress === 'object' && seededOrder?.shippingAddress?.city === 'Bengaluru')
      test('Returned order contains parsed deliveryMethod object', typeof seededOrder?.deliveryMethod === 'object' && seededOrder?.deliveryMethod?.id === 'express')
      test('Returned order contains numeric subtotal and totalAmount', typeof seededOrder?.subtotal === 'number' && typeof seededOrder?.totalAmount === 'number')
      test('Returned order contains non-empty items array', Array.isArray(seededOrder?.items) && seededOrder.items.length > 0)
      test('Order item contains required fields (name, price, quantity, craft)', 
        Boolean(seededOrder?.items[0]?.name && seededOrder?.items[0]?.price && seededOrder?.items[0]?.quantity && seededOrder?.items[0]?.craft)
      )

      // Test case insensitivity in orderId lookup
      const lowerCaseOrder = await orderModel.getOrderById(seededOrderId.toLowerCase())
      test('getOrderById handles lower-case order ID correctly', lowerCaseOrder?.id === seededOrderId)

      // ------------------------------------------------------------------
      // Test B: Missing & Invalid Order Handling
      // ------------------------------------------------------------------
      console.log('\n--- Test B: Missing and Invalid Order ID Handling ---')
      const missingOrder = await orderModel.getOrderById('HC-NON-EXISTENT-99999')
      test('getOrderById returns null for non-existent order ID', missingOrder === null)

      const nullOrder = await orderModel.getOrderById(null)
      test('getOrderById returns null for null orderId without throwing', nullOrder === null)

      const emptyOrder = await orderModel.getOrderById('')
      test('getOrderById returns null for empty string orderId', emptyOrder === null)

      const numericOrder = await orderModel.getOrderById(12345)
      test('getOrderById returns null for non-string orderId without throwing', numericOrder === null)

      // ------------------------------------------------------------------
      // Test C: Successful Order Creation Return Value (createOrderWithItems)
      // ------------------------------------------------------------------
      console.log('\n--- Test C: Successful Order Creation Return Value ---')
      const createdOrder = await orderModel.createOrderWithItems({
        userId: 'user_hc_2026',
        items: [
          { productId: 'kanchipuram-korvai', quantity: 1 }
        ],
        shippingAddress: {
          fullName: 'Ananya Collector',
          addressLine1: '128 Heritage Enclave',
          city: 'Bengaluru',
          state: 'Karnataka',
          postalCode: '560038',
          country: 'India'
        },
        deliveryMethod: {
          id: 'standard',
          name: 'Standard Insured Craft Transit',
          cost: 0
        },
        paymentDetails: {
          method: 'upi',
          upiId: 'ananya@upi'
        },
        includeGiftBox: true
      })

      test('createOrderWithItems returns non-null order object', createdOrder !== null)
      test('Created order has generated ID matching HC-2026-xxxx pattern', /^HC-2026-\d{4}$/.test(createdOrder?.id))
      test('Created order has status "commissioned"', createdOrder?.status === 'commissioned')
      test('Created order contains items array with 1 item', Array.isArray(createdOrder?.items) && createdOrder.items.length === 1)
      test('Created order item has authentic product details from MySQL', 
        createdOrder?.items[0]?.productId === 'kanchipuram-korvai' &&
        createdOrder?.items[0]?.name === 'Kanchipuram Temple Border Korvai Silk' &&
        createdOrder?.items[0]?.price === 39200
      )
      test('Created order total reflects item price + gift box fee (750) + 5% tax', 
        createdOrder?.subtotal === 39200 &&
        createdOrder?.giftBoxFee === 750 &&
        createdOrder?.taxFee === Math.round(39200 * 0.05) &&
        createdOrder?.totalAmount === (39200 + 750 + Math.round(39200 * 0.05))
      )

      // Verify immediate retrieval of newly created order
      const fetchedNewOrder = await orderModel.getOrderById(createdOrder.id)
      test('Newly created order is immediately retrievable via getOrderById', fetchedNewOrder?.id === createdOrder.id)

      // ------------------------------------------------------------------
      // Test D: Order HTTP Endpoints & Tracking Flow
      // ------------------------------------------------------------------
      console.log('\n--- Test D: Order HTTP API & Tracking Endpoints ---')

      // HTTP POST /api/orders
      const apiCreateRes = await request('/api/orders', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${ownerToken}` },
        body: {
          items: [{ productId: 'banarasi-zari-saree', quantity: 1 }],
          shippingAddress: {
            fullName: 'Ananya Collector',
            addressLine1: '128 Heritage Enclave',
            city: 'Bengaluru',
            state: 'Karnataka',
            postalCode: '560038'
          },
          deliveryMethod: { id: 'express', name: 'Express Atelier', cost: 350 },
          paymentDetails: { method: 'card', cardLast4: '4242' },
          includeGiftBox: false
        }
      })

      test('POST /api/orders returns HTTP 201 Created', apiCreateRes.status === 201)
      test('POST /api/orders returns success: true', apiCreateRes.data?.success === true)
      test('POST /api/orders data payload is non-null and contains order ID', Boolean(apiCreateRes.data?.data?.id))
      test('POST /api/orders items array is populated', Array.isArray(apiCreateRes.data?.data?.items) && apiCreateRes.data.data.items.length === 1)

      const apiOrderId = apiCreateRes.data?.data?.id

      // HTTP GET /api/orders/:id by owner
      const apiGetRes = await request(`/api/orders/${apiOrderId}`, {
        headers: { 'Authorization': `Bearer ${ownerToken}` }
      })
      test('GET /api/orders/:id returns 200 for owner', apiGetRes.status === 200)
      test('GET /api/orders/:id matches created order ID', apiGetRes.data?.data?.id === apiOrderId)

      // HTTP GET /api/orders/:id by admin
      const adminGetRes = await request(`/api/orders/${apiOrderId}`, {
        headers: { 'Authorization': `Bearer ${adminToken}` }
      })
      test('GET /api/orders/:id returns 200 for admin user', adminGetRes.status === 200)

      // HTTP GET /api/orders/:id by unauthorized user (IDOR prevention)
      const intruderGetRes = await request(`/api/orders/${apiOrderId}`, {
        headers: { 'Authorization': `Bearer ${intruderToken}` }
      })
      test('GET /api/orders/:id returns 403 Forbidden for another user', intruderGetRes.status === 403)

      // HTTP GET /api/orders/:id/tracking
      const trackingRes = await request(`/api/orders/${apiOrderId}/tracking`, {
        headers: { 'Authorization': `Bearer ${ownerToken}` }
      })
      test('GET /api/orders/:id/tracking returns HTTP 200', trackingRes.status === 200)
      test('Tracking data contains order object', Boolean(trackingRes.data?.data?.order?.id === apiOrderId))
      test('Tracking data contains 6 artisan weaving stages', Array.isArray(trackingRes.data?.data?.stages) && trackingRes.data.data.stages.length === 6)
      test('Tracking data contains calculated progressPercent number', typeof trackingRes.data?.data?.progressPercent === 'number')
      test('Tracking data contains certificate with silkMarkNo and giTagNo', 
        Boolean(trackingRes.data?.data?.certificate?.silkMarkNo && trackingRes.data?.data?.certificate?.giTagNo)
      )

      // Missing order tracking
      const missingTrackingRes = await request('/api/orders/HC-NON-EXISTENT-8888/tracking')
      test('GET /api/orders/:id/tracking returns 404 ORDER_NOT_FOUND for invalid order', missingTrackingRes.status === 404 && missingTrackingRes.data?.code === 'ORDER_NOT_FOUND')

      // Missing order detail
      const missingDetailRes = await request('/api/orders/HC-NON-EXISTENT-8888')
      test('GET /api/orders/:id returns 404 ORDER_NOT_FOUND for invalid order', missingDetailRes.status === 404 && missingDetailRes.data?.code === 'ORDER_NOT_FOUND')

      // ------------------------------------------------------------------
      // User Order History: GET /api/orders
      // ------------------------------------------------------------------
      console.log('\n--- Test E: User Order History (GET /api/orders) ---')
      const myOrdersRes = await request('/api/orders', {
        headers: { 'Authorization': `Bearer ${ownerToken}` }
      })
      test('GET /api/orders returns HTTP 200', myOrdersRes.status === 200)
      test('GET /api/orders returns array of orders for authenticated user', Array.isArray(myOrdersRes.data?.data) && myOrdersRes.data.data.length >= 2)
      test('User orders include items array on each order', myOrdersRes.data?.data?.every(o => Array.isArray(o.items)))

      console.log('======================================================================')
      console.log(`ORDER REGRESSION TEST RESULTS: ${passed} / ${passed + failed} CHECKS PASSED`)
      console.log('======================================================================\n')

      server.close(() => {
        process.exit(failed > 0 ? 1 : 0)
      })
    } catch (err) {
      console.error('Test execution error:', err)
      server.close(() => process.exit(1))
    }
  })
}

runOrderRegressionTests()
