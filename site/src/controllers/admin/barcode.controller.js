const db = require("../../db/models")

module.exports = async (req, res) => {
  try {
    const product = await db.Product.findByPk(req.params.id, {
      include: [{
        model: db.Category,
        as: "category"
      }]
    })

    if (!product) {
      return res.status(404).send("Producto no encontrado")
    }

    const barcode = product.barcode || `PRD-${String(product.id).padStart(8, '0')}`

    return res.render("admin/barcodeProduct", { product, barcode })
  } catch (error) {
    return res.status(500).send(error.message)
  }
}
