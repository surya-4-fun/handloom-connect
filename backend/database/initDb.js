import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import mysql from 'mysql2/promise'
import dotenv from 'dotenv'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Load environment variables from backend/.env
dotenv.config({ path: path.join(__dirname, '../.env') })

const DB_HOST = process.env.DB_HOST || 'localhost'
const DB_PORT = parseInt(process.env.DB_PORT || '3306', 10)
const DB_USER = process.env.DB_USER || 'root'
const DB_PASSWORD = process.env.DB_PASSWORD || ''
const DB_NAME = process.env.DB_NAME || 'handloom_connect'

async function runSqlFile(connection, filePath) {
  console.log(`Executing SQL file: ${path.basename(filePath)}...`)
  const content = fs.readFileSync(filePath, 'utf8')
  
  // Split statements by semicolon while ignoring comments and empty lines
  // Note: mysql2 with multipleStatements: true can execute full script
  await connection.query(content)
  console.log(`✓ Finished executing ${path.basename(filePath)}`)
}

async function initDatabase() {
  console.log('====================================================')
  console.log(' Handloom Connect Database Initializer')
  console.log('====================================================')
  console.log(`Connecting to MySQL server at ${DB_HOST}:${DB_PORT} as ${DB_USER}...`)

  let rootConn
  try {
    // 1. Connect to MySQL without selecting database first (to create database if needed)
    rootConn = await mysql.createConnection({
      host: DB_HOST,
      port: DB_PORT,
      user: DB_USER,
      password: DB_PASSWORD,
      multipleStatements: true,
    })

    console.log('✓ Successfully connected to MySQL server.')

    // 2. Run schema.sql
    const schemaPath = path.join(__dirname, 'schema.sql')
    await runSqlFile(rootConn, schemaPath)

    // 3. Run seed.sql
    const seedPath = path.join(__dirname, 'seed.sql')
    await runSqlFile(rootConn, seedPath)

    console.log('====================================================')
    console.log(`🎉 Database "${DB_NAME}" successfully initialized and seeded!`)
    console.log('====================================================')
  } catch (err) {
    console.error('❌ Database initialization error:', err.message)
    console.error('Check your MySQL server status and credentials in backend/.env.')
    process.exit(1)
  } finally {
    if (rootConn) await rootConn.end()
  }
}

initDatabase()
