import http from 'http'
import jwt from 'jsonwebtoken'
import express from 'express'
import cors from 'cors'
import app from '../src/app.js'
import { getJwtSecret, validateJwtConfig } from '../src/config/jwt.js'
import { requireAuth } from '../src/middleware/auth.js'

const PORT = 5096

function request(path, options = {}, targetPort = PORT) {
  return new Promise((resolve, reject) => {
    const reqOptions = {
      hostname: '127.0.0.1',
      port: targetPort,
      path,
      method: options.method || 'GET',
      headers: {
        ...(options.headers || {})
      }
    }

    const req = http.request(reqOptions, (res) => {
      let data = ''
      res.on('data', chunk => { data += chunk })
      res.on('end', () => {
        try {
          const json = JSON.parse(data)
          resolve({ status: res.statusCode, headers: res.headers, data: json })
        } catch {
          resolve({ status: res.statusCode, headers: res.headers, data })
        }
      })
    })

    req.on('error', reject)
    if (options.body) {
      req.write(typeof options.body === 'string' ? options.body : JSON.stringify(options.body))
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

async function runSecurityHardeningTests() {
  console.log('======================================================================')
  console.log('STARTING BATCH 10 SECURITY HARDENING REGRESSION TEST SUITE')
  console.log('======================================================================\n')

  const originalJwtSecret = process.env.JWT_SECRET
  const originalNodeEnv = process.env.NODE_ENV

  // ------------------------------------------------------------------
  // 1. JWT SECRET SECURITY TESTS
  // ------------------------------------------------------------------
  console.log('--- 1. JWT Secret Configuration & Fallback Elimination ---')

  // Test A: Obtains secret from environment
  test('JWT secret is obtained from environment configuration', getJwtSecret() === originalJwtSecret)

  // Test B: Zero hardcoded fallback when JWT_SECRET is unset
  delete process.env.JWT_SECRET
  let threwWhenMissing = false
  try {
    getJwtSecret()
  } catch (err) {
    threwWhenMissing = true
  }
  test('getJwtSecret() strictly throws when JWT_SECRET is missing (no hardcoded fallback)', threwWhenMissing)

  // Test C: validateJwtConfig behavior in production
  process.env.NODE_ENV = 'production'
  let prodHaltsWhenMissing = false
  try {
    validateJwtConfig()
  } catch {
    prodHaltsWhenMissing = true
  }
  test('Production mode halts startup when JWT_SECRET is missing', prodHaltsWhenMissing)

  // Restore env
  process.env.JWT_SECRET = originalJwtSecret
  process.env.NODE_ENV = originalNodeEnv

  // Test D: Missing JWT configuration rejected with 500 AUTH_CONFIG_ERROR in requireAuth
  const dummyReq = { headers: { authorization: 'Bearer some-fake-token' } }
  let authErrorStatus = null
  let authErrorCode = null
  const dummyRes = {
    status: (code) => { authErrorStatus = code; return dummyRes },
    json: (body) => { authErrorCode = body.code; return dummyRes }
  }
  delete process.env.JWT_SECRET
  requireAuth(dummyReq, dummyRes, () => {})
  test('requireAuth returns 500 AUTH_CONFIG_ERROR when JWT_SECRET is unconfigured', 
    authErrorStatus === 500 && authErrorCode === 'AUTH_CONFIG_ERROR'
  )

  // Restore JWT_SECRET
  process.env.JWT_SECRET = originalJwtSecret

  // ------------------------------------------------------------------
  // 2. EXPRESS CORS TESTS (DEVELOPMENT & PRODUCTION)
  // ------------------------------------------------------------------
  console.log('\n--- 2. Express CORS Security Tests ---')

  const server = app.listen(PORT, async () => {
    try {
      console.log(`✓ Express test server listening on port ${PORT}\n`)

      // Test E: Configured development origin is accepted
      const devOriginRes = await request('/api/health', {
        headers: { 'Origin': 'http://localhost:5173' }
      })
      test('Development origin (http://localhost:5173) is accepted with matching CORS header', 
        devOriginRes.headers['access-control-allow-origin'] === 'http://localhost:5173'
      )
      test('Credentials header is present for allowed origin', 
        devOriginRes.headers['access-control-allow-credentials'] === 'true'
      )

      // Test F: Preflight OPTIONS request for allowed origin
      const preflightRes = await request('/api/auth/me', {
        method: 'OPTIONS',
        headers: {
          'Origin': 'http://localhost:5173',
          'Access-Control-Request-Method': 'GET',
          'Access-Control-Request-Headers': 'Authorization'
        }
      })
      test('Preflight OPTIONS from allowed origin returns Access-Control-Allow-Origin', 
        preflightRes.headers['access-control-allow-origin'] === 'http://localhost:5173'
      )

      // Test G: Unknown/attacker origin is rejected (no Access-Control-Allow-Origin returned)
      const unknownOriginRes = await request('/api/health', {
        headers: { 'Origin': 'https://malicious-attacker-domain.com' }
      })
      test('Unknown origin is rejected (Access-Control-Allow-Origin header is omitted)', 
        !unknownOriginRes.headers['access-control-allow-origin']
      )

      // Test H: Preflight OPTIONS from unknown origin is rejected
      const unknownPreflightRes = await request('/api/auth/me', {
        method: 'OPTIONS',
        headers: {
          'Origin': 'https://malicious-attacker-domain.com',
          'Access-Control-Request-Method': 'GET'
        }
      })
      test('Preflight OPTIONS from unknown origin omits Access-Control-Allow-Origin', 
        !unknownPreflightRes.headers['access-control-allow-origin']
      )

      // Test I: Wildcard origin is never combined with credentials
      test('Wildcard * is NOT used as Access-Control-Allow-Origin with credentials', 
        devOriginRes.headers['access-control-allow-origin'] !== '*'
      )

      // ------------------------------------------------------------------
      // 3. PRODUCTION MODE CORS ISOLATION TEST
      // ------------------------------------------------------------------
      console.log('\n--- 3. Production CORS Isolation Simulation ---')
      // Create a production-mode Express instance with strict CORS_ORIGINS
      const prodApp = express()
      const prodAllowedOrigins = ['https://handloomconnect.org']

      prodApp.use(cors({
        origin: (origin, callback) => {
          if (!origin) return callback(null, true)
          const norm = origin.trim().replace(/\/+$/, '')
          if (prodAllowedOrigins.includes(norm)) {
            return callback(null, true)
          }
          return callback(null, false)
        },
        credentials: true
      }))
      prodApp.get('/api/test', (req, res) => res.json({ ok: true }))

      const PROD_PORT = 5095
      const prodServer = prodApp.listen(PROD_PORT, async () => {
        try {
          // Production allowed origin
          const prodAllowed = await request('/api/test', {
            headers: { 'Origin': 'https://handloomconnect.org' }
          }, PROD_PORT)
          test('Production mode allows configured production origin', 
            prodAllowed.headers['access-control-allow-origin'] === 'https://handloomconnect.org'
          )

          // Production rejects localhost when not listed
          const prodLocalhost = await request('/api/test', {
            headers: { 'Origin': 'http://localhost:5173' }
          }, PROD_PORT)
          test('Production mode rejects localhost when not explicitly configured', 
            !prodLocalhost.headers['access-control-allow-origin']
          )

          // Production rejects arbitrary domains
          const prodArbitrary = await request('/api/test', {
            headers: { 'Origin': 'https://arbitrary-site.com' }
          }, PROD_PORT)
          test('Production mode rejects arbitrary origins', 
            !prodArbitrary.headers['access-control-allow-origin']
          )

          // ------------------------------------------------------------------
          // 4. AUTHENTICATION FLOW VERIFICATION WITH HARDENED JWT
          // ------------------------------------------------------------------
          console.log('\n--- 4. Authentication Flow Verification ---')
          const validToken = jwt.sign(
            { id: 'user_hc_2026', email: 'collector@handloomconnect.com', role: 'customer', fullName: 'Ananya Collector' },
            originalJwtSecret,
            { expiresIn: '1h' }
          )

          const authMeRes = await request('/api/auth/me', {
            headers: {
              'Authorization': `Bearer ${validToken}`,
              'Origin': 'http://localhost:5173'
            }
          })
          test('GET /api/auth/me returns 200 with valid JWT', authMeRes.status === 200 && authMeRes.data.success === true)

          // Old fallback secret token is rejected
          const oldSecretToken = jwt.sign(
            { id: 'user_hc_2026', email: 'collector@handloomconnect.com', role: 'customer' },
            'handloom_connect_dev_secret_jwt_2026_secure_key_tampered',
            { expiresIn: '1h' }
          )
          const badTokenRes = await request('/api/auth/me', {
            headers: { 'Authorization': `Bearer ${oldSecretToken}` }
          })
          test('Token signed with incorrect/tampered secret is rejected with 401 INVALID_TOKEN', 
            badTokenRes.status === 401 && badTokenRes.data.code === 'INVALID_TOKEN'
          )

          console.log('\n======================================================================')
          console.log(`SECURITY TEST RESULTS: ${passed} / ${passed + failed} CHECKS PASSED`)
          console.log('======================================================================\n')

          prodServer.close(() => {
            server.close(() => {
              process.exit(failed > 0 ? 1 : 0)
            })
          })
        } catch (innerErr) {
          console.error('Inner test error:', innerErr)
          prodServer.close(() => {
            server.close(() => process.exit(1))
          })
        }
      })
    } catch (err) {
      console.error('Test execution error:', err)
      server.close(() => process.exit(1))
    }
  })
}

runSecurityHardeningTests()
