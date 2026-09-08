import http from 'http'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import app from '../src/app.js'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const PORT = 5095

function request(urlPath, options = {}) {
  return new Promise((resolve, reject) => {
    const reqOptions = {
      hostname: '127.0.0.1',
      port: PORT,
      path: urlPath,
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
          resolve({ status: res.statusCode, data: json, headers: res.headers })
        } catch {
          resolve({ status: res.statusCode, data, headers: res.headers })
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

async function runTests() {
  console.log('--- Starting Production Data Consistency & Authenticity Regression Tests ---\n')
  let passed = 0
  let failed = 0

  function assert(condition, message) {
    if (condition) {
      console.log(`✓ PASS: ${message}`)
      passed++
    } else {
      console.error(`✗ FAIL: ${message}`)
      failed++
    }
  }

  const server = app.listen(PORT)
  await new Promise(r => setTimeout(r, 600))

  try {
    // 1. Products API returns authoritative artisanName from MySQL
    const productsRes = await request('/api/products')
    assert(productsRes.status === 200, 'GET /api/products returns HTTP 200')
    assert(Array.isArray(productsRes.data?.data?.products), 'GET /api/products returns products array')
    
    const sampleProduct = productsRes.data?.data?.products?.[0]
    assert(sampleProduct && typeof sampleProduct.artisanName === 'string' && sampleProduct.artisanName.length > 0,
      `Product "${sampleProduct?.name}" has authoritative artisanName: "${sampleProduct?.artisanName}"`)
    assert(sampleProduct?.artisan && typeof sampleProduct.artisan.name === 'string',
      `Product contains authoritative artisan object with name "${sampleProduct?.artisan?.name}"`)

    // 2. Product Detail API returns authoritative product, artisan, and passport from MySQL
    const detailRes = await request('/api/products/banarasi-zari-saree')
    assert(detailRes.status === 200, 'GET /api/products/banarasi-zari-saree returns HTTP 200')
    const detailData = detailRes.data?.data
    assert(detailData?.product?.artisanName === 'Rajeshwar Ansari',
      `Product detail returns authoritative artisanName: "${detailData?.product?.artisanName}"`)
    assert(detailData?.artisan?.name === 'Rajeshwar Ansari',
      `Product detail returns authoritative artisan object: "${detailData?.artisan?.name}"`)
    assert(detailData?.passport?.giRegistryNo === 'GI-8821-UP-KATAN',
      `Product detail returns authoritative GI Registry: "${detailData?.passport?.giRegistryNo}"`)
    assert(detailData?.passport?.silkMarkNo === 'SM-VA-2026-4482',
      `Product detail returns authoritative Silk Mark: "${detailData?.passport?.silkMarkNo}"`)
    assert(Array.isArray(detailData?.passport?.craftJourney) && detailData.passport.craftJourney.length === 6,
      `Product passport has authentic 6-stage craft journey from MySQL`)

    // 3. Facets API returns distinct values from MySQL (/api/products/facets and /api/products/meta/facets)
    const facetsRes = await request('/api/products/facets')
    assert(facetsRes.status === 200, 'GET /api/products/facets returns HTTP 200')
    const facets = facetsRes.data?.data
    assert(Array.isArray(facets?.materials) && facets.materials.length > 0,
      `Backend facets return ${facets?.materials?.length} distinct materials from MySQL: ${facets?.materials?.slice(0, 3).join(', ')}...`)
    assert(Array.isArray(facets?.regions) && facets.regions.length > 0,
      `Backend facets return ${facets?.regions?.length} distinct regions from MySQL: ${facets?.regions?.slice(0, 3).join(', ')}...`)
    assert(Array.isArray(facets?.techniques) && facets.techniques.length > 0,
      `Backend facets return ${facets?.techniques?.length} distinct techniques from MySQL: ${facets?.techniques?.slice(0, 3).join(', ')}...`)

    const metaFacetsRes = await request('/api/products/meta/facets')
    assert(metaFacetsRes.status === 200, 'GET /api/products/meta/facets alias also returns HTTP 200')

    // 4. Authenticity Passport dedicated endpoint (/api/products/:idOrSlug/passport)
    const passportRes = await request('/api/products/banarasi-zari-saree/passport')
    assert(passportRes.status === 200, 'GET /api/products/banarasi-zari-saree/passport returns HTTP 200')
    const passport = passportRes.data?.data
    assert(passport?.authenticityId === 'AUTH-HC-BANA-2026-9812',
      `Passport endpoint returns authentic authenticityId: "${passport?.authenticityId}"`)
    assert(passport?.loomType === 'Traditional Hand-operated Wooden Pit Loom',
      `Passport endpoint returns authentic loomType: "${passport?.loomType}"`)

    // 5. Product without passport returns safe null (not 500 error, not fake certificate)
    const productsAll = productsRes.data?.data?.products || []
    const uncertified = productsAll.find(p => p.slug !== 'banarasi-zari-saree' && p.slug !== 'kanchipuram-korvai')
    if (uncertified) {
      const uncertifiedRes = await request(`/api/products/${uncertified.slug}/passport`)
      assert(uncertifiedRes.status === 200, `GET /api/products/${uncertified.slug}/passport returns HTTP 200`)
      assert(uncertifiedRes.data?.data === null,
        `Uncertified product "${uncertified.name}" safely returns null passport without fabrication`)
    }

    // 6. Non-existent product passport returns 404
    const notFoundPassport = await request('/api/products/non-existent-item-999/passport')
    assert(notFoundPassport.status === 404, 'GET passport for non-existent product returns HTTP 404')

    // 7. Static Code Audits: Frontend components decouple from mock data
    const frontendDir = path.resolve(__dirname, '../../frontend/src')

    // 7A: ProductCard.tsx does not import getArtisanById
    const productCardCode = fs.readFileSync(path.join(frontendDir, 'components/shop/ProductCard.tsx'), 'utf-8')
    assert(!productCardCode.includes('getArtisanById'), 'ProductCard.tsx has zero imports or calls of getArtisanById')
    assert(!productCardCode.includes('shopData'), 'ProductCard.tsx has zero imports of shopData')
    assert(productCardCode.includes('artisanName'), 'ProductCard.tsx uses product.artisanName from backend')

    // 7B: QuickViewModal.tsx does not import getArtisanById
    const quickViewCode = fs.readFileSync(path.join(frontendDir, 'components/shop/QuickViewModal.tsx'), 'utf-8')
    assert(!quickViewCode.includes('getArtisanById'), 'QuickViewModal.tsx has zero imports or calls of getArtisanById')
    assert(!quickViewCode.includes('shopData'), 'QuickViewModal.tsx has zero imports of shopData')
    assert(quickViewCode.includes('artisanName'), 'QuickViewModal.tsx uses product.artisanName from backend')

    // 7C: ShopFilters.tsx does not import ALL_MATERIALS, ALL_REGIONS, or ALL_TECHNIQUES
    const shopFiltersCode = fs.readFileSync(path.join(frontendDir, 'components/shop/ShopFilters.tsx'), 'utf-8')
    assert(!shopFiltersCode.includes('ALL_MATERIALS'), 'ShopFilters.tsx has zero imports of ALL_MATERIALS')
    assert(!shopFiltersCode.includes('ALL_REGIONS'), 'ShopFilters.tsx has zero imports of ALL_REGIONS')
    assert(!shopFiltersCode.includes('ALL_TECHNIQUES'), 'ShopFilters.tsx has zero imports of ALL_TECHNIQUES')
    assert(shopFiltersCode.includes('facets?.materials'), 'ShopFilters.tsx renders dynamic materials from backend facets')
    assert(shopFiltersCode.includes('facets?.regions'), 'ShopFilters.tsx renders dynamic regions from backend facets')
    assert(shopFiltersCode.includes('facets?.techniques'), 'ShopFilters.tsx renders dynamic techniques from backend facets')

    // 7D: authenticityService.ts does not generate fake certificates or use Math.random
    const authServiceCode = fs.readFileSync(path.join(frontendDir, 'services/authenticityService.ts'), 'utf-8')
    assert(!authServiceCode.includes('Math.random'), 'authenticityService.ts contains zero Math.random() calls')
    assert(!authServiceCode.includes('GI-4482-TN-SILK'), 'authenticityService.ts contains zero hardcoded fake GI strings')
    assert(authServiceCode.includes('/products/${productIdOrSlug}/passport'),
      'authenticityService.ts calls authoritative /products/:idOrSlug/passport endpoint')

    // 7E: Zero Math.random in frontend/src
    function scanDirForPattern(dir, pattern, excludePatterns = []) {
      const files = fs.readdirSync(dir)
      const matches = []
      for (const file of files) {
        const fullPath = path.join(dir, file)
        const stat = fs.statSync(fullPath)
        if (stat.isDirectory()) {
          matches.push(...scanDirForPattern(fullPath, pattern, excludePatterns))
        } else if (stat.isFile() && (file.endsWith('.ts') || file.endsWith('.tsx') || file.endsWith('.js'))) {
          if (excludePatterns.some(ex => fullPath.includes(ex))) continue
          const content = fs.readFileSync(fullPath, 'utf-8')
          if (pattern.test(content)) {
            matches.push(fullPath)
          }
        }
      }
      return matches
    }

    const randomMatches = scanDirForPattern(frontendDir, /Math\.random\(\)/)
    assert(randomMatches.length === 0, `Zero Math.random() calls across frontend/src (found: ${randomMatches.length})`)

    // 7F: Active components importing getArtisanById
    const getArtisanMatches = scanDirForPattern(frontendDir, /import.*getArtisanById/)
    assert(getArtisanMatches.length === 0, `Zero active components import getArtisanById (found: ${getArtisanMatches.length})`)

    // 7G: Active components importing static facets
    const staticFacetMatches = scanDirForPattern(frontendDir, /import.*(ALL_MATERIALS|ALL_REGIONS|ALL_TECHNIQUES)/)
    assert(staticFacetMatches.length === 0, `Zero active components import static facet arrays (found: ${staticFacetMatches.length})`)

    // 7H: Handloom360ExplorerModal.tsx has no fake GI/Silk Mark fallbacks
    const explorerModalCode = fs.readFileSync(path.join(frontendDir, 'components/shop/Handloom360ExplorerModal.tsx'), 'utf-8')
    assert(!explorerModalCode.includes('GI-4482-REG'), 'Handloom360ExplorerModal.tsx has zero fabricated GI-4482-REG fallback')
    assert(!explorerModalCode.includes('SM-2026-CERT'), 'Handloom360ExplorerModal.tsx has zero fabricated SM-2026-CERT fallback')

    // 7I: ProductDetailPage.tsx handles missing passport truthfully
    const pdpCode = fs.readFileSync(path.join(frontendDir, 'pages/ProductDetailPage.tsx'), 'utf-8')
    assert(!pdpCode.includes('if (!product || !passport)'), 'ProductDetailPage.tsx does not hide products lacking passports')
    assert(pdpCode.includes('Verification Pending'), 'ProductDetailPage.tsx shows honest Verification Pending status when passport is null')

  } catch (err) {
    console.error('Test execution error:', err)
    failed++
  } finally {
    server.close()
  }

  console.log('\n--- Production Data Consistency Test Summary ---')
  console.log(`Passed: ${passed}`)
  console.log(`Failed: ${failed}`)

  if (failed > 0) {
    process.exit(1)
  }
  process.exit(0)
}

runTests()
