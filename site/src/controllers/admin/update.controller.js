const db = require("../../db/models");
const { validationResult } = require("express-validator");

const buildBarcode = (id) => `PRD-${String(id).padStart(8, "0")}`;

module.exports = async (req, res) => {
  try {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      const { id } = req.params;
      const product = await db.Product.findByPk(id, {
        include: [{
          model: db.Category,
          as: "category",
        }]
      });

      const categories = await db.Category.findAll();

      return res.render("admin/updateProduct", {
        old: req.body,
        errors: errors.mapped(),
        categories,
        product
      });
    }

    const { name, price, category, stock, description } = req.body;
    const { id } = req.params;

    const product = await db.Product.findByPk(id);

    if (!product) {
      return res.status(404).send("Producto no encontrado");
    }

    const image = req.file?.filename || product.image || "product-default.jpg";

    await product.update({
      name: name.trim(),
      price: Number(price),
      categoryId: Number(category),
      quantity: Number(stock),
      image,
      description: description.trim(),
      barcode: product.barcode || buildBarcode(product.id)
    });

    return res.redirect("/admin/dashboard/productos?updated=true");
  } catch (error) {
    console.error("Error al actualizar el producto:", error);
    return res.status(500).send(error.message || "Error interno del servidor");
  }
};
