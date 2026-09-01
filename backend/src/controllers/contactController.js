import { contactModel } from '../models/contactModel.js'
import { sendSuccess } from '../utils/response.js'

export const contactController = {
  async submitContact(req, res, next) {
    try {
      const { name, email, message } = req.body
      const inquiry = await contactModel.createInquiry({ name, email, message })
      return sendSuccess(res, inquiry, 'Message received successfully. We will get back within 24 hours.', 201)
    } catch (err) {
      next(err)
    }
  }
}
