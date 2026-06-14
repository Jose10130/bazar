const db = require("../../db/models");

module.exports = async (req, res) => {
  try {
    const { eliminados, updated } = req.query;
    const paranoidOptions = eliminados === "true" ? false : true;

    const products = await db.Product.findAll({
      include: [{
        model: db.Category,
        as: "category",
      }],
      paranoid: paranoidOptions,
      order: [["createdAt", "DESC"]]
    });

    res.render("admin/listProduct", {
      products,
      eliminados,
      updated
    });
  } catch (error) {
    console.error("Error al obtener producto y categorías:", error);
    res.status(500).send("Error interno del servidor.");
  }
};
