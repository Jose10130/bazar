const db = require("../../db/models");

module.exports = async (req, res) => {
  try {
    const orders = await db.Order.findAll({
      include: [
        {
          model: db.Product,
          as: "products",
          through: {
            attributes: ["quantity"]
          }
        },
        {
          model: db.User,
          as: "user"
        }
      ],
      order: [["createdAt", "DESC"]]
    });

    res.render("admin/listOrders", { orders });
  } catch (error) {
    console.error("Error al obtener las órdenes:", error);
    res.status(500).send("Error interno del servidor.");
  }
};
