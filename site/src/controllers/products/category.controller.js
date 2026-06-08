const db = require("../../db/models");

async function getLoggedUser(req) {
  if (!req.session.userLogin) return null;

  const { id } = req.session.userLogin;

  return db.User.findByPk(id, {
    include: [
      {
        model: db.Address,
        as: "address",
      },
      {
        model: db.Product,
        as: "favorites",
        attributes: ["id", "name", "price", "image"],
      },
    ],
  });
}

module.exports = async (req, res) => {
  try {
    const categoryId = Number(req.params.id);

    if (!categoryId) {
      return res.status(400).send("Categoría inválida");
    }

    const currentPage = Math.max(parseInt(req.query.page, 10) || 1, 1);
    const limit = 12;
    const offset = (currentPage - 1) * limit;

    const [user, category, categories, productsData] = await Promise.all([
      getLoggedUser(req),
      db.Category.findByPk(categoryId),
      db.Category.findAll({ order: [["name", "ASC"]] }),
      db.Product.findAndCountAll({
        where: { categoryId },
        limit,
        offset,
        order: [["createdAt", "DESC"]],
      }),
    ]);

    if (!category) {
      return res.status(404).send("Categoría no encontrada");
    }

    const products = productsData.rows;
    const count = productsData.count;
    const hasMore = currentPage * limit < count;
    const nextPage = currentPage + 1;

    return res.render("products/productsByCategory", {
      user,
      products,
      categories,
      category,
      currentPage,
      hasMore,
      nextPage,
      count,
    });
  } catch (error) {
    console.error("Error al cargar productos por categoría:", error);
    res.status(500).send("Error interno del servidor");
  }
};