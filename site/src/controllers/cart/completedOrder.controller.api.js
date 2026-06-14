const db = require('../../db/models');
const finalizeOrderStock = require('../utils/finalizeOrderStock');
const { getOrderPending } = require('./utility');

module.exports = async (req, res) => {
  const transaction = await db.sequelize.transaction();

  try {
    const [pendingOrder] = await getOrderPending(req);
    const order = await db.Order.findByPk(pendingOrder.id, {
      transaction,
      lock: transaction.LOCK.UPDATE,
      include: [
        {
          association: 'products',
          through: {
            attributes: ['quantity']
          }
        }
      ]
    });

    const productsCount = Array.isArray(order?.products) ? order.products.length : 0;

    if (productsCount === 0) {
      await transaction.rollback();
      return res.status(400).json({
        ok: false,
        msg: 'No se puede completar una orden vacía'
      });
    }

    if (!order.stockDiscounted) {
      await finalizeOrderStock(order.id, transaction);
    }

    await order.update({ state: 'completed' }, { transaction });
    await transaction.commit();

    return res.status(200).json({
      ok: true,
      msg: 'Orden completada con éxito'
    });
  } catch (error) {
    await transaction.rollback();
    return res.status(error.status || 500).json({
      ok: false,
      msg: error.message
    });
  }
};
