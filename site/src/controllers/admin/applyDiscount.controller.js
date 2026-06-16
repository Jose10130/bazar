const db = require("../../db/models");

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
    const percent = Number(req.body.discountPercent ?? 0);

    if (!Number.isFinite(percent) || percent < 0 || percent > 100) {
      return res.status(400).send("Descuento inválido");
    }

    const order = await db.Order.findByPk(id, {
      include: [
        {
          association: "products",
          through: {
            attributes: ["quantity"]
          }
        }
      ]
    });

    if (!order) {
      return res.status(404).send("Orden no encontrada");
    }

    const plain = order.get({ plain: true });

    const subtotal = (plain.products || []).reduce((acc, product) => {
      const quantity = getQuantity(product);
      const price = Number(product.price || 0);
      return acc + price * quantity;
    }, 0);

    const discountAmount = (subtotal * percent) / 100;
    const finalTotal = Math.max(subtotal - discountAmount, 0);

    await order.update({
      discountPercent: percent,
      discountAmount,
      total: finalTotal
    });

    return res.redirect(`/admin/dashboard/ordenes/${id}`);
  } catch (error) {
    console.error(error);
    return res.status(500).send("Error interno");
  }
};
