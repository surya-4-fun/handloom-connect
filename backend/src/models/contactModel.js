import { query } from '../config/db.js'

export const contactModel = {
  async createInquiry({ name, email, message }) {
    const result = await query(
      'INSERT INTO contact_inquiries (name, email, message) VALUES (?, ?, ?)',
      [name, email, message]
    )
    return {
      id: result.insertId,
      name,
      email,
      message,
      createdAt: new Date().toISOString()
    }
  }
}
