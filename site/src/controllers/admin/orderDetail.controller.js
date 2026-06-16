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

const getQuantity = (product) => Number(
  product?.Orderproduct?.quantity ??
  product?.Orderproducts?.quantity ??
  product?.orderProducts?.quantity ??
  product?.orderproduct?.quantity ??
  product?.Orderproduct?.dataValues?.quantity ??
  product?.Orderproducts?.dataValues?.quantity ??
  product?.orderProducts?.dataValues?.quantity ??
  product?.orderproduct?.dataValues?.quantity ??
  1
) || 1;


module.exports = async (req, res) => {
  try {
    const { id } = req.params;

    const order = await db.Order.findByPk(id, {
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
      ]
    });

    if (!order) {
      return res.status(404).send("Orden no encontrada");
    }

    const plain = order.get({ plain: true });

    const products = Array.isArray(plain.products) ? plain.products : [];

    const productsNormalized = products.map((product) => {
      const quantity = getQuantity(product);
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

    const subtotal = productsNormalized.reduce(
      (acc, product) => acc + Number(product.subtotal || 0),
      0
    );

    const discountAmount = Number(plain.discountAmount ?? Math.max(subtotal - Number(plain.total ?? subtotal), 0));
    const discountPercent = Number(
      plain.discountPercent ?? (subtotal > 0 ? (discountAmount / subtotal) * 100 : 0)
    );
    const grandTotal = Number(plain.total ?? subtotal);

    const renderOrder = {
      ...plain,
      products: productsNormalized,
      subtotal,
      subtotalFormatted: formatMoney(subtotal),
      discountAmount,
      discountAmountFormatted: formatMoney(discountAmount),
      discountPercent,
      grandTotal,
      grandTotalFormatted: formatMoney(grandTotal),
      stateLabel: stateLabels[plain.state] || plain.state
    };

    return res.render("admin/detailOrder", { order: renderOrder });
  } catch (error) {
    console.error("Error al obtener la órden:", error);
    return res.status(500).send("Error interno del servidor.");
  }
};
