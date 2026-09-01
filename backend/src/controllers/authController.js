import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { userModel } from '../models/userModel.js'
import { sendSuccess, sendError } from '../utils/response.js'

const JWT_SECRET = process.env.JWT_SECRET || 'handloom_connect_dev_secret_jwt_2026_secure_key'
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d'

function generateToken(user) {
  return jwt.sign(
    { id: user.id, email: user.email, role: user.role, fullName: user.fullName },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRES_IN }
  )
}

export const authController = {
  async register(req, res, next) {
    try {
      const { fullName, email, password, acceptTerms } = req.body

      if (!acceptTerms) {
        return sendError(res, 'You must accept the Terms and Conditions.', 400, 'TERMS_NOT_ACCEPTED')
      }

      const existingUser = await userModel.findByEmail(email.toLowerCase().trim())
      if (existingUser) {
        return sendError(res, 'An account with this email already exists.', 409, 'EMAIL_EXISTS')
      }

      const passwordHash = await bcrypt.hash(password, 10)
      const userId = `user_hc_${Date.now()}`

      const newUser = await userModel.createUser({
        id: userId,
        email: email.toLowerCase().trim(),
        passwordHash,
        fullName: fullName.trim(),
        avatarUrl: null,
        role: 'customer'
      })

      const token = generateToken(newUser)

      return sendSuccess(res, {
        user: {
          id: newUser.id,
          fullName: newUser.fullName,
          email: newUser.email,
          avatarUrl: newUser.avatarUrl,
          joinedAt: newUser.joinedAt
        },
        token
      }, 'Registration successful', 201)
    } catch (err) {
      next(err)
    }
  },

  async login(req, res, next) {
    try {
      const { email, password } = req.body

      const userRecord = await userModel.findByEmail(email.toLowerCase().trim())
      if (!userRecord) {
        return sendError(res, 'Invalid email or password.', 401, 'INVALID_CREDENTIALS')
      }

      const isMatch = await bcrypt.compare(password, userRecord.password_hash)
      if (!isMatch) {
        return sendError(res, 'Invalid email or password.', 401, 'INVALID_CREDENTIALS')
      }

      const user = {
        id: userRecord.id,
        fullName: userRecord.full_name,
        email: userRecord.email,
        avatarUrl: userRecord.avatar_url,
        role: userRecord.role,
        joinedAt: userRecord.created_at
      }

      const token = generateToken(user)

      return sendSuccess(res, { user, token }, 'Login successful')
    } catch (err) {
      next(err)
    }
  },

  async getMe(req, res, next) {
    try {
      const user = await userModel.findById(req.user.id)
      if (!user) {
        return sendError(res, 'User session not found.', 404, 'USER_NOT_FOUND')
      }

      return sendSuccess(res, user, 'Profile retrieved')
    } catch (err) {
      next(err)
    }
  },

  async logout(req, res) {
    return sendSuccess(res, null, 'Logged out successfully')
  }
}
