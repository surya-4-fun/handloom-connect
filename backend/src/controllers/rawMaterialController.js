import { rawMaterialModel } from '../models/rawMaterialModel.js'
import { sendSuccess, sendError } from '../utils/response.js'

export const rawMaterialController = {
  async getRawMaterials(req, res, next) {
    try {
      const { category, origin, quality, inStockOnly, search, sort } = req.query
      const materials = await rawMaterialModel.getAll({
        category,
        origin,
        quality,
        inStockOnly: inStockOnly === 'true' || inStockOnly === true,
        search,
        sort
      })
      return sendSuccess(res, materials, 'Raw materials retrieved')
    } catch (err) {
      next(err)
    }
  },

  async getRawMaterialDetail(req, res, next) {
    try {
      const { id } = req.params
      const material = await rawMaterialModel.getById(id)

      if (!material) {
        return sendError(res, 'Raw material not found', 404, 'MATERIAL_NOT_FOUND')
      }

      return sendSuccess(res, material, 'Raw material retrieved')
    } catch (err) {
      next(err)
    }
  },

  async submitBulkQuote(req, res, next) {
    try {
      const { materialId, materialName, requestedQty, unit, artisanName, organizationName, email, phone, notes, colorShadeRef } = req.body

      const quote = await rawMaterialModel.createBulkRequest({
        materialId,
        materialName,
        requestedQty: Number(requestedQty),
        unit,
        artisanName,
        organizationName,
        email,
        phone,
        notes,
        colorShadeRef
      })

      return sendSuccess(res, quote, 'Bulk quote inquiry submitted successfully', 201)
    } catch (err) {
      next(err)
    }
  }
}
