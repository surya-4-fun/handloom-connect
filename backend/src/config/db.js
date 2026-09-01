import mysql from 'mysql2/promise'
import dotenv from 'dotenv'

dotenv.config()

const poolConfig = {
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '3306', 10),
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'handloom_connect',
  waitForConnections: true,
  connectionLimit: parseInt(process.env.DB_CONNECTION_LIMIT || '10', 10),
  queueLimit: 0,
  enableKeepAlive: true,
  keepAliveInitialDelay: 0,
  multipleStatements: false,
}

export const pool = mysql.createPool(poolConfig)

/**
 * Execute a parameterized query using the pool.
 * @param {string} sql - SQL query with `?` placeholders
 * @param {Array} params - Array of parameters
 * @returns {Promise<any>}
 */
export async function query(sql, params = []) {
  const [results] = await pool.query(sql, params)
  return results
}

/**
 * Check database connection status.
 */
export async function checkConnection() {
  try {
    const connection = await pool.getConnection()
    console.log(`✓ Connected to MySQL database "${poolConfig.database}" on ${poolConfig.host}:${poolConfig.port}`)
    connection.release()
    return true
  } catch (err) {
    console.warn(`⚠️ MySQL Connection Warning: ${err.message}`)
    console.warn('Backend will start, but database operations require MySQL running.')
    return false
  }
}

export default pool
