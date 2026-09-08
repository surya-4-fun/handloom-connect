import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import morgan from 'morgan'
import dotenv from 'dotenv'

import authRoutes from './routes/authRoutes.js'
import userRoutes from './routes/userRoutes.js'
import categoryRoutes from './routes/categoryRoutes.js'
import productRoutes from './routes/productRoutes.js'
import artisanRoutes from './routes/artisanRoutes.js'
import rawMaterialRoutes from './routes/rawMaterialRoutes.js'
import cartRoutes from './routes/cartRoutes.js'
import wishlistRoutes from './routes/wishlistRoutes.js'
import orderRoutes from './routes/orderRoutes.js'
import contactRoutes from './routes/contactRoutes.js'
import aiPreviewRoutes from './routes/aiPreviewRoutes.js'
import aiChatRoutes from './routes/aiChatRoutes.js'
import { errorHandler, notFoundHandler } from './middleware/errorHandler.js'
import { sendSuccess } from './utils/response.js'

dotenv.config()

const app = express()

// 1. Security Headers
app.use(helmet({
  crossOriginResourcePolicy: { policy: 'cross-origin' }
}))

// 2. CORS Configuration
const isProduction = process.env.NODE_ENV === 'production'

// Support origins configured via CORS_ORIGINS or FRONTEND_URL (comma-separated)
const envOriginsRaw = process.env.CORS_ORIGINS || process.env.FRONTEND_URL || ''
const configuredOrigins = envOriginsRaw
  .split(',')
  .map(o => o.trim().replace(/\/+$/, ''))
  .filter(Boolean)

// Safe local development origins required by the project
const defaultDevOrigins = [
  'http://localhost:5173',
  'http://localhost:4173',
  'http://localhost:3000',
  'http://127.0.0.1:5173',
  'http://127.0.0.1:4173',
  'http://127.0.0.1:3000'
]

// In production: strictly adhere to explicitly configured origins.
// In development: merge configured origins with default development ports.
const allowedOrigins = isProduction
  ? configuredOrigins
  : Array.from(new Set([...configuredOrigins, ...defaultDevOrigins]))

app.use(cors({
  origin: (origin, callback) => {
    // Allow non-browser requests with no origin (e.g. mobile apps, curl, server-to-server, test scripts)
    if (!origin) return callback(null, true)

    const normalizedOrigin = origin.trim().replace(/\/+$/, '')

    if (allowedOrigins.includes(normalizedOrigin)) {
      return callback(null, true)
    }

    // In both production and development, reject unknown origins (do not allow arbitrary origins)
    return callback(null, false)
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}))

// 3. Request Parsing & Logging
app.use(express.json({ limit: '5mb' }))
app.use(express.urlencoded({ extended: true, limit: '5mb' }))

if (process.env.NODE_ENV !== 'test') {
  app.use(morgan('dev'))
}

// 4. API Health Check & Info
app.get('/api/health', (req, res) => {
  return sendSuccess(res, {
    status: 'online',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    version: '1.0.0',
    service: 'Handloom Connect REST API'
  }, 'API is healthy and running')
})

// 5. Mount API Routes
app.use('/api/auth', authRoutes)
app.use('/api/users', userRoutes)
app.use('/api/categories', categoryRoutes)
app.use('/api/products', productRoutes)
app.use('/api/artisans', artisanRoutes)
app.use('/api/raw-materials', rawMaterialRoutes)
app.use('/api/cart', cartRoutes)
app.use('/api/wishlist', wishlistRoutes)
app.use('/api/orders', orderRoutes)
app.use('/api/contact', contactRoutes)
app.use('/api/ai', aiPreviewRoutes)
app.use('/api/ai', aiChatRoutes)


// 6. Error & Not Found Handling
app.use(notFoundHandler)
app.use(errorHandler)

export default app
