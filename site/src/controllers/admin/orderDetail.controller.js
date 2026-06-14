const db = require("../../db/models");

const stateLabels = {
  pending: "Pendiente",
  completed: "Finalizado",
  canceled: "Cancelado"
};

const formatMoney = (value) =>
  Number(value || 0).toLocaleString("es-AR", {
    style: "currency",
    currency: "ARS"
  });

module.exports = async (req, res) => {
  try {
    const { id } = req.params;

    const order = await db.Order.findByPk(id, {
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
      ]
    });

    if (!order) {
      return res.status(404).send("Orden no encontrada");
    }

    const plain = order.get({ plain: true });

    const products = (plain.products || []).map((product) => {
      const quantity = Number(
        product?.Orderproduct?.quantity ??
        product?.Orderproducts?.quantity ??
        product?.orderProducts?.quantity ??
        product?.orderproduct?.quantity ??
        1
      ) || 1;

      const price = Number(product.price || 0);
      const subtotal = price * quantity;

      return {
        ...product,
        quantity,
        priceFormatted: formatMoney(price),
        subtotalFormatted: formatMoney(subtotal),
        subtotal
      };
    });

    const subtotal = products.reduce((acc, product) => acc + Number(product.subtotal || 0), 0);
    const total = Number(plain.total || subtotal);

    const renderOrder = {
      ...plain,
      products,
      subtotal,
      subtotalFormatted: formatMoney(subtotal),
      grandTotalFormatted: formatMoney(total),
      stateLabel: stateLabels[plain.state] || plain.state
    };

    return res.render("admin/detailOrder", { order: renderOrder });
  } catch (error) {
    console.error("Error al obtener la órden:", error);
    return res.status(500).send("Error interno del servidor.");
  }
};
