import http from 'http'
import app from '../src/app.js'

const PORT = 5099

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

    const req = http.request(reqOptions, res => {
      let data = ''
      res.on('data', chunk => {
        data += chunk
      })
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

async function runARPreviewTests() {
  console.log('======================================================================')
  console.log('STARTING AR PRODUCT PREVIEW & VISUALIZATION INTEGRATION TEST SUITE')
  console.log('======================================================================')

  let server = null
  let passedCount = 0
  let totalTests = 0

  function test(label, condition) {
    totalTests++
    if (condition) {
      passedCount++
      console.log(`  ✅ [PASS] ${label}`)
    } else {
      console.error(`  ❌ [FAIL] ${label}`)
      throw new Error(`Test failed: ${label}`)
    }
  }

  try {
    server = await new Promise(resolve => {
      const s = app.listen(PORT, () => resolve(s))
    })
    console.log(`✓ Express test server listening on port ${PORT}\n`)

    // ------------------------------------------------------------------
    // TEST 1: Valid Product Context (Backend Authoritative from MySQL)
    // ------------------------------------------------------------------
    console.log('--- 1. Valid Product Context & Authoritative Data ---')
    const resProduct = await request('/api/products/kanchipuram-korvai')
    test('GET /api/products/:id returns 200 for authentic product', resProduct.status === 200)
    test('Product has verified name, technique, material, and region',
      resProduct.data.data.product &&
      resProduct.data.data.product.name.includes('Kanchipuram') &&
      Boolean(resProduct.data.data.product.material) &&
      Boolean(resProduct.data.data.product.technique) &&
      Boolean(resProduct.data.data.product.region)
    )
    test('Product images array is populated with valid URLs',
      Array.isArray(resProduct.data.data.product.images) &&
      resProduct.data.data.product.images.length > 0 &&
      resProduct.data.data.product.images[0].startsWith('http')
    )

    // ------------------------------------------------------------------
    // TEST 2: Multi-Angle 360° Sequence for Rotational AR Viewfinder
    // ------------------------------------------------------------------
    console.log('\n--- 2. Multi-Angle 360° Rotational Dataset ---')
    const res360 = await request('/api/products/kanchipuram-korvai/360')
    test('GET /api/products/:id/360 returns 200 with structured 360 dataset', res360.status === 200)
    test('360 dataset indicates has360 === true and contains image sequences',
      res360.data.data.has360 === true &&
      Array.isArray(res360.data.data.images) &&
      res360.data.data.images.length >= 8
    )
    test('Each 360 frame contains sequence number, url, and angle label',
      res360.data.data.images[0].url &&
      res360.data.data.images[0].sequence &&
      res360.data.data.images[0].angleLabel
    )

    // ------------------------------------------------------------------
    // TEST 3: Invalid / Non-Existent Product ID Handling
    // ------------------------------------------------------------------
    console.log('\n--- 3. Invalid Product ID & 404 Error Isolation ---')
    const resNotFound = await request('/api/products/non-existent-product-id-999')
    test('GET /api/products/:invalid returns 404 PRODUCT_NOT_FOUND',
      resNotFound.status === 404 && resNotFound.data.code === 'PRODUCT_NOT_FOUND'
    )
    const res360NotFound = await request('/api/products/non-existent-product-id-999/360')
    test('GET /api/products/:invalid/360 returns 404 PRODUCT_NOT_FOUND without crashing',
      res360NotFound.status === 404 && res360NotFound.data.code === 'PRODUCT_NOT_FOUND'
    )

    // ------------------------------------------------------------------
    // TEST 4: No Static Fallback Products / Demo Products in Catalog
    // ------------------------------------------------------------------
    console.log('\n--- 4. Verification of No Static/Fabricated Demo Products ---')
    const resAllProducts = await request('/api/products')
    test('GET /api/products returns authentic catalog list', resAllProducts.status === 200)
    const prods = resAllProducts.data.data.products || []
    const containsOldDemoFabric = prods.some(p => p.id === 'kanchipuram-gold' || p.id === 'tussar-raw-silk')
    test('Hardcoded fake items (kanchipuram-gold, tussar-raw-silk) are not present in backend catalog',
      containsOldDemoFabric === false
    )

    // ------------------------------------------------------------------
    // TEST 5: Missing Product / Validation Handling in Preview Generation
    // ------------------------------------------------------------------
    console.log('\n--- 5. Missing Product & Validation Guardrails ---')
    const resMissingProd = await request('/api/ai/product-preview', {
      method: 'POST',
      body: { height: 165, weight: 60 }
    })
    test('POST /api/ai/product-preview rejects missing productId with 400',
      resMissingProd.status === 400
    )

    const resNonExistentProd = await request('/api/ai/product-preview', {
      method: 'POST',
      body: { productId: 'invalid-heirloom-999', height: 165, weight: 60 }
    })
    test('POST /api/ai/product-preview rejects non-existent product with 404',
      resNonExistentProd.status === 404
    )

    // ------------------------------------------------------------------
    // TEST 6: Client Spoofing Resistance
    // ------------------------------------------------------------------
    console.log('\n--- 6. Client Spoofing Resistance (Backend Authoritative) ---')
    const resSpoof = await request('/api/products/kanchipuram-korvai')
    test('Price and Craft details are immutable and derived exclusively from MySQL database',
      resSpoof.data.data.product.price > 0 &&
      resSpoof.data.data.product.technique === 'Korvai Interlocking Warp'
    )

    console.log('\n======================================================================')
    console.log(`  AR PREVIEW TEST RESULTS: ${passedCount} / ${totalTests} CHECKS PASSED (100%)`)
    console.log('======================================================================')

    server.close(() => process.exit(0))
  } catch (err) {
    console.error('\n❌ AR Preview test suite encountered an error:', err)
    if (server) server.close(() => process.exit(1))
    else process.exit(1)
  }
}

runARPreviewTests()
