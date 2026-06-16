const { Op } = require("sequelize");
const db = require("../../db/models");

const currencyFormat = (value) =>
  Number(value || 0).toLocaleString("es-AR", {
    style: "currency",
    currency: "ARS"
  });

const buildBarcode = (product) => product.barcode || `PRD-${String(product.id).padStart(8, "0")}`;

const getQuantity = (product) => Number(
  product?.Orderproduct?.quantity ??
  product?.Orderproducts?.quantity ??
  product?.orderProducts?.quantity ??
  product?.orderproduct?.quantity ??
  1
) || 1;

module.exports = async (req, res) => {
  try {
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999);

    const orders = await db.Order.findAll({
      where: {
        state: "completed",
        updatedAt: {
          [Op.between]: [startOfDay, endOfDay]
        }
      },
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
      order: [["updatedAt", "DESC"]]
    });

    const normalizedOrders = orders.map((order) => {
      const plain = order.get({ plain: true });
      const products = Array.isArray(plain.products) ? plain.products : [];

      const items = products.map((product) => {
        const quantity = getQuantity(product);
        const price = Number(product.price || 0);
        const subtotal = price * quantity;

        return {
          ...product,
          quantity,
          price,
          subtotal,
          barcode: buildBarcode(product)
        };
      });

      const subtotal = items.reduce((acc, item) => acc + item.subtotal, 0);

      return {
        ...plain,
        products: items,
        subtotal,
        subtotalFormatted: currencyFormat(subtotal),
        totalFormatted: currencyFormat(plain.total || subtotal),
        customerName: [plain.user?.name || "", plain.user?.surname || ""].join(" ").trim() || "Sin cliente"
      };
    });

    const totalOrders = normalizedOrders.length;
    const totalProductsSold = normalizedOrders.reduce(
      (acc, order) => acc + order.products.reduce((sum, product) => sum + Number(product.quantity || 0), 0),
      0
    );
    const totalBilled = normalizedOrders.reduce((acc, order) => acc + Number(order.total || 0), 0);

    return res.render("admin/salesDay", {
      orders: normalizedOrders,
      summary: {
        totalOrders,
        totalProductsSold,
        totalBilled,
        totalBilledFormatted: currencyFormat(totalBilled)
      },
      dateLabel: new Date().toLocaleDateString("es-AR", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric"
      })
    });
  } catch (error) {
    console.error("Error al obtener las ventas del día:", error);
    return res.status(500).send("Error interno del servidor.");
  }
};
