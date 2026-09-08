import app from './app.js'
import { checkConnection } from './config/db.js'
import { validateJwtConfig } from './config/jwt.js'

const PORT = parseInt(process.env.PORT || '5000', 10)

async function startServer() {
  // Validate critical security environment configuration
  validateJwtConfig()

  // Check MySQL database connection
  await checkConnection()

  const server = app.listen(PORT, () => {
    console.log('====================================================')
    console.log(`🚀 Handloom Connect Backend Server Running!`)
    console.log(`🌐 Local URL: http://localhost:${PORT}`)
    console.log(`🩺 Health check: http://localhost:${PORT}/api/health`)
    console.log(`📦 Environment: ${process.env.NODE_ENV || 'development'}`)
    console.log('====================================================')
  })

  // Graceful shutdown
  const gracefulShutdown = (signal) => {
    console.log(`\nReceived ${signal}. Shutting down gracefully...`)
    server.close(() => {
      console.log('HTTP server closed.')
      process.exit(0)
    })
  }

  process.on('SIGTERM', () => gracefulShutdown('SIGTERM'))
  process.on('SIGINT', () => gracefulShutdown('SIGINT'))
}

startServer().catch(err => {
  console.error('Failed to start server:', err)
  process.exit(1)
})
