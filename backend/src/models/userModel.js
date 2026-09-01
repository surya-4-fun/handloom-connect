import { query } from '../config/db.js'

export const userModel = {
  async findByEmail(email) {
    const rows = await query('SELECT * FROM users WHERE email = ? LIMIT 1', [email])
    return rows[0] || null
  },

  async findById(id) {
    const rows = await query('SELECT id, email, full_name as fullName, avatar_url as avatarUrl, role, created_at as joinedAt FROM users WHERE id = ? LIMIT 1', [id])
    return rows[0] || null
  },

  async createUser({ id, email, passwordHash, fullName, avatarUrl = null, role = 'customer' }) {
    await query(
      'INSERT INTO users (id, email, password_hash, full_name, avatar_url, role) VALUES (?, ?, ?, ?, ?, ?)',
      [id, email, passwordHash, fullName, avatarUrl, role]
    )

    // Insert default preferences
    await query(
      'INSERT INTO user_preferences (user_id, newsletter, currency, theme) VALUES (?, TRUE, "INR", "dark")',
      [id]
    )

    return this.findById(id)
  },

  async updateProfile(userId, { fullName, avatarUrl }) {
    await query(
      'UPDATE users SET full_name = COALESCE(?, full_name), avatar_url = COALESCE(?, avatar_url) WHERE id = ?',
      [fullName, avatarUrl, userId]
    )
    return this.findById(userId)
  },

  async getAddresses(userId) {
    const rows = await query(
      'SELECT id, type, full_name as fullName, address_line1 as addressLine1, address_line2 as addressLine2, city, state, postal_code as postalCode, country, is_default as isDefault FROM user_addresses WHERE user_id = ? ORDER BY is_default DESC, created_at DESC',
      [userId]
    )
    return rows.map(r => ({ ...r, isDefault: Boolean(r.isDefault) }))
  },

  async addAddress(userId, addr) {
    if (addr.isDefault) {
      await query('UPDATE user_addresses SET is_default = FALSE WHERE user_id = ?', [userId])
    }

    await query(
      'INSERT INTO user_addresses (id, user_id, type, full_name, address_line1, address_line2, city, state, postal_code, country, is_default) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [
        addr.id,
        userId,
        addr.type || 'shipping',
        addr.fullName,
        addr.addressLine1,
        addr.addressLine2 || null,
        addr.city,
        addr.state,
        addr.postalCode,
        addr.country || 'India',
        addr.isDefault ? 1 : 0
      ]
    )

    const rows = await query('SELECT * FROM user_addresses WHERE id = ? LIMIT 1', [addr.id])
    return rows[0]
  },

  async updateAddress(userId, addressId, addr) {
    if (addr.isDefault) {
      await query('UPDATE user_addresses SET is_default = FALSE WHERE user_id = ?', [userId])
    }

    await query(
      'UPDATE user_addresses SET type = COALESCE(?, type), full_name = COALESCE(?, full_name), address_line1 = COALESCE(?, address_line1), address_line2 = COALESCE(?, address_line2), city = COALESCE(?, city), state = COALESCE(?, state), postal_code = COALESCE(?, postal_code), country = COALESCE(?, country), is_default = COALESCE(?, is_default) WHERE id = ? AND user_id = ?',
      [
        addr.type,
        addr.fullName,
        addr.addressLine1,
        addr.addressLine2,
        addr.city,
        addr.state,
        addr.postalCode,
        addr.country,
        addr.isDefault !== undefined ? (addr.isDefault ? 1 : 0) : null,
        addressId,
        userId
      ]
    )

    const rows = await query('SELECT * FROM user_addresses WHERE id = ? LIMIT 1', [addressId])
    return rows[0]
  },

  async deleteAddress(userId, addressId) {
    await query('DELETE FROM user_addresses WHERE id = ? AND user_id = ?', [addressId, userId])
    return true
  },

  async getPreferences(userId) {
    const rows = await query('SELECT newsletter, currency, theme FROM user_preferences WHERE user_id = ? LIMIT 1', [userId])
    if (!rows[0]) {
      return { newsletter: true, currency: 'INR', theme: 'dark' }
    }
    return {
      newsletter: Boolean(rows[0].newsletter),
      currency: rows[0].currency,
      theme: rows[0].theme
    }
  },

  async updatePreferences(userId, prefs) {
    await query(
      'INSERT INTO user_preferences (user_id, newsletter, currency, theme) VALUES (?, ?, ?, ?) ON DUPLICATE KEY UPDATE newsletter = COALESCE(VALUES(newsletter), newsletter), currency = COALESCE(VALUES(currency), currency), theme = COALESCE(VALUES(theme), theme)',
      [userId, prefs.newsletter !== undefined ? (prefs.newsletter ? 1 : 0) : 1, prefs.currency || 'INR', prefs.theme || 'dark']
    )
    return this.getPreferences(userId)
  }
}
