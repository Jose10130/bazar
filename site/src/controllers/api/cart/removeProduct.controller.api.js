const db = require('../../../db/models');
const { getOrderPending } = require('../../utils');
const { getTotalOrder } = require('../../utils/getTotalOrder');

module.exports = async (req, res) => {
  try {
    const { id } = req.params;
    const [order] = await getOrderPending(req);

    const deleted = await db.Orderproduct.destroy({
      where: {
        orderId: order.id,
        productId: id
      }
    });

    if (!deleted) {
      return res.status(404).json({
        ok: false,
        msg: 'No se encontró el producto para eliminar'
      });
    }

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
      msg: 'Producto eliminado con éxito',
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
