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

    // ✅ Quitamos el include aquí para poder usar LOCK.UPDATE en Postgres
    const order = await db.Order.findByPk(id, {
      transaction,
      lock: transaction.LOCK.UPDATE
    });

    if (!order) {
      await transaction.rollback();
      return res.status(404).send("Orden no encontrada");
    }

    if (state === 'completed' && !order.stockDiscounted) {
      await finalizeOrderStock(order.id, transaction);
    }

    await order.update({ state }, { transaction });

    await transaction.commit();
    return res.redirect(`/admin/dashboard/ordenes/${id}`);
  } catch (error) {
    await transaction.rollback();
    console.error("Error al actualizar el estado de la orden:", error);
    return res.status(error.status || 500).send(error.message || "Error interno del servidor");
  }
};