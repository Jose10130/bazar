const db = require('../../../db/models');
const { getOrderPending } = require('../../utils');

module.exports = async (req, res) => {
  try {
    const [order] = await getOrderPending(req);

    await db.Orderproduct.destroy({
      where: {
        orderId: order.id
      }
    });

    order.total = 0;
    await order.save();

    return res.status(200).json({
      ok: true,
      msg: 'Productos eliminados con éxito'
    });
  } catch (error) {
    return res.status(error.status || 500).json({
      ok: false,
      msg: error.message
    });
  }
};
