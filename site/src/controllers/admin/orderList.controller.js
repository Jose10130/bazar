const db = require("../../db/models");

module.exports = async (req, res) => {
  try {
    const orders = await db.Order.findAll({
      include: [
        {
          association: "products",
          through: {
            attributes: ["quantity"]
          }
        },
        {
          association: "user"
        }
      ],
      order: [["createdAt", "DESC"]]
    });

    const normalizedOrders = orders.map((order) => order.get({ plain: true }));

    return res.render("admin/listOrders", { orders: normalizedOrders });
  } catch (error) {
    console.error("Error al obtener las órdenes:", error);
    return res.status(500).send("Error interno del servidor.");
  }
};
