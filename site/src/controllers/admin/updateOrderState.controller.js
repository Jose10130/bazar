const db = require("../../db/models");
const finalizeOrderStock = require("../utils/finalizeOrderStock");

const allowedStates = ["pending", "completed", "canceled"];

module.exports = async (req, res) => {
  const transaction = await db.sequelize.transaction();

  try {
    const { id } = req.params;
    const { state } = req.body;

    if (!allowedStates.includes(state)) {
      await transaction.rollback();
      return res.status(400).send("Estado inválido");
    }

    // 👉 Primero buscamos solo la orden SIN JOIN para evitar conflicto con el bloqueo
    const order = await db.Order.findByPk(id, {
      transaction,
      lock: transaction.LOCK.UPDATE
    });

    if (!order) {
      await transaction.rollback();
      return res.status(404).send("Orden no encontrada");
    }

    // 👉 Si se va a completar y aún no se descontó stock
    if (state === 'completed' && !order.stockDiscounted) {
      // 👉 Obtenemos los productos de forma segura sin romper la transacción
      const productsWithQty = await db.Orderproducts.findAll({
        where: { orderId: order.id },
        attributes: ['productId', 'quantity'],
        transaction
      });

      // 👉 Ejecutamos la función que ya tenés
      await finalizeOrderStock(order.id, transaction, productsWithQty);

      // Marcamos que ya se descontó para no repetir
      order.stockDiscounted = true;
    }

    // Actualizamos estado y bandera
    await order.update(
      { state, stockDiscounted: order.stockDiscounted || false },
      { transaction }
    );

    await transaction.commit();
    return res.redirect(`/admin/dashboard/ordenes/${id}`);

  } catch (error) {
    await transaction.rollback();
    console.error("Error al actualizar el estado de la orden:", error);
    return res.status(error.status || 500).send(error.message || "Error interno del servidor");
  }
};