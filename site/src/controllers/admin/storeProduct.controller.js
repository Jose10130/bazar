const db = require("../../db/models");
const { validationResult } = require("express-validator");

const buildBarcode = (id) => `PRD-${String(id).padStart(8, "0")}`;

module.exports = async (req, res) => {
  const transaction = await db.sequelize.transaction();

  try {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      await transaction.rollback();
      const categories = await db.Category.findAll();

      return res.render("admin/createProduct", {
        old: req.body,
        errors: errors.mapped(),
        categories
      });
    }

    const { name, price, description, category, stock } = req.body;
    const image = req.file?.filename || "product-default.jpg";

    const product = await db.Product.create({
      name: name.trim(),
      price: Number(price),
      categoryId: Number(category),
      quantity: Number(stock),
      image,
      description: description.trim()
    }, { transaction });

    await product.update({
      barcode: buildBarcode(product.id)
    }, { transaction });

    await transaction.commit();
    return res.redirect("/admin/dashboard/productos");
  } catch (error) {
    await transaction.rollback();
    console.error("error al intentar crear", error);
    return res.status(500).send(error.message || "Error interno del servidor");
  }
};
