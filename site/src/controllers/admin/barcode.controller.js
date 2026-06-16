const db = require("../../db/models");

const buildBarcode = (product) => product.barcode || `PRD-${String(product.id).padStart(8, "0")}`;

module.exports = async (req, res) => {
  try {
    const product = await db.Product.findByPk(req.params.id, {
      paranoid: false,
      include: [{
        model: db.Category,
        as: "category"
      }]
    });

    if (!product) {
      return res.status(404).send("Producto no encontrado");
    }

    const barcode = buildBarcode(product);

    return res.render("admin/barcodeProduct", {
      product: product.get({ plain: true }),
      barcode
    });
  } catch (error) {
    console.error("Error al generar el código de barras:", error);
    return res.status(500).send(error.message || "Error interno del servidor");
  }
};
