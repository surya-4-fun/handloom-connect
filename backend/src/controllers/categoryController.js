import { categoryModel } from '../models/categoryModel.js'
import { sendSuccess } from '../utils/response.js'

export const categoryController = {
  async getCategories(req, res, next) {
    try {
      const categories = await categoryModel.getAllWithCounts()
      return sendSuccess(res, categories, 'Categories retrieved')
    } catch (err) {
      next(err)
    }
  }
}
