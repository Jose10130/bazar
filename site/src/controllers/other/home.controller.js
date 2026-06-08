const db = require("../../db/models");

module.exports = async (req, res) => {
  try {
    let user = null;

    if (req.session.userLogin) {
      const { id } = req.session.userLogin;

      user = await db.User.findByPk(id, {
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

    const currentPage = parseInt(req.query.page, 10) || 1;
    const limit = 12;
    const offset = (currentPage - 1) * limit;

    const { count, rows: products } = await db.Product.findAndCountAll({
      limit,
      offset,
      order: [["createdAt", "DESC"]],
    });

    const categories = await db.Category.findAll();

    const hasMore = currentPage * limit < count;
    const nextPage = currentPage + 1;

    res.render("other/home", {
      user,
      products,
      categories,
      currentPage,
      hasMore,
      nextPage,
    });
  } catch (error) {
    console.error("Error al cargar el home:", error);
    res.status(500).send("Error interno del servidor");
  }
};