const { Op } = require('sequelize');
const db = require('../../../db/models');
const { getOrderPending } = require('../../utils');
const { getTotalOrder } = require('../../utils/getTotalOrder');

module.exports = async (req, res) => {
  try {
    const { id } = req.params;
    const [order] = await getOrderPending(req);

    const record = await db.Orderproduct.findOne({
      where: {
        [Op.and]: [
          { orderId: order.id },
          { productId: id }
        ]
      }
    });

    if (!record) {
      return res.status(404).json({
        ok: false,
        msg: 'No se encontró el producto en el carrito'
      });
    }

    if (Number(record.quantity || 0) <= 1) {
      return res.status(200).json({
        ok: true,
        msg: 'La cantidad mínima es 1, no se puede reducir'
      });
    }

    record.quantity = Number(record.quantity || 0) - 1;
    await record.save();

    const orderWithProducts = await order.reload({
      include: [
        {
          association: 'products',
          through: {
            attributes: ['quantity']
          }
        }
      ]
    });

    orderWithProducts.total = getTotalOrder(orderWithProducts.products || []);
    await orderWithProducts.save();

    return res.status(200).json({
      ok: true,
      msg: 'Cantidad reducida con éxito',
      data: {
        total: orderWithProducts.total
      }
    });
  } catch (error) {
    return res.status(error.status || 500).json({
      ok: false,
      msg: error.message
    });
  }
};
