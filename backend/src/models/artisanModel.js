import { query } from '../config/db.js'

function formatArtisan(row) {
  if (!row) return null
  return {
    id: row.id,
    name: row.name,
    title: row.title,
    region: row.region,
    craft: row.craft,
    specialty: row.specialty,
    experience: row.experience,
    bio: row.bio,
    story: row.story,
    techniques: typeof row.techniques === 'string' ? JSON.parse(row.techniques) : (row.techniques || []),
    culturalBackground: row.cultural_background,
    communityImpact: typeof row.community_impact === 'string' ? JSON.parse(row.community_impact) : row.community_impact,
    image: row.image,
    isFeatured: Boolean(row.is_featured),
    isCollective: Boolean(row.is_collective),
    followerCount: row.follower_count || 0,
    supportCount: row.support_count || 0,
    createdAt: row.created_at
  }
}

export const artisanModel = {
  async getAll({ search = '', region = 'all', tab = 'all' } = {}) {
    let sql = 'SELECT * FROM artisans WHERE 1=1'
    const params = []

    if (tab === 'masters') {
      sql += ' AND is_collective = 0'
    } else if (tab === 'collectives') {
      sql += ' AND is_collective = 1'
    }

    if (region && region !== 'all') {
      sql += ' AND region LIKE ?'
      params.push(`%${region}%`)
    }

    if (search && search.trim()) {
      const term = `%${search.trim()}%`
      sql += ' AND (name LIKE ? OR craft LIKE ? OR region LIKE ? OR specialty LIKE ? OR bio LIKE ?)'
      params.push(term, term, term, term, term)
    }

    sql += ' ORDER BY is_featured DESC, name ASC'

    const rows = await query(sql, params)
    return rows.map(formatArtisan)
  },

  async getById(id) {
    const rows = await query('SELECT * FROM artisans WHERE id = ? LIMIT 1', [id])
    return formatArtisan(rows[0])
  },

  async isFollowing(userId, artisanId) {
    const rows = await query('SELECT id FROM artisan_follows WHERE user_id = ? AND artisan_id = ? LIMIT 1', [userId, artisanId])
    return rows.length > 0
  },

  async toggleFollow(userId, artisanId) {
    const exists = await this.isFollowing(userId, artisanId)
    if (exists) {
      await query('DELETE FROM artisan_follows WHERE user_id = ? AND artisan_id = ?', [userId, artisanId])
      await query('UPDATE artisans SET follower_count = GREATEST(0, follower_count - 1) WHERE id = ?', [artisanId])
      return { following: false }
    } else {
      await query('INSERT INTO artisan_follows (user_id, artisan_id) VALUES (?, ?)', [userId, artisanId])
      await query('UPDATE artisans SET follower_count = follower_count + 1 WHERE id = ?', [artisanId])
      return { following: true }
    }
  },

  async getFollowedArtisanIds(userId) {
    const rows = await query('SELECT artisan_id FROM artisan_follows WHERE user_id = ?', [userId])
    return rows.map(r => r.artisan_id)
  },

  async incrementSupport(artisanId, tier = 1200) {
    await query('UPDATE artisans SET support_count = support_count + 1 WHERE id = ?', [artisanId])
    const rows = await query('SELECT support_count FROM artisans WHERE id = ?', [artisanId])
    return { supportCount: rows[0]?.support_count || 0, tier }
  }
}
