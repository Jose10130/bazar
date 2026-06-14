const { Op } = require('sequelize');
const db = require('../../db/models');
const { getOrderPending } = require('./utility');

const getQuantity = (product) => Number(
  (product && product.Orderproducts && product.Orderproducts.quantity) ||
  (product && product.Orderproducts && product.Orderproducts.dataValues && product.Orderproducts.dataValues.quantity) ||
  (product && product.Orderproduct && product.Orderproduct.quantity) ||
  (product && product.Orderproduct && product.Orderproduct.dataValues && product.Orderproduct.dataValues.quantity) ||
  (product && product.orderProducts && product.orderProducts.quantity) ||
  (product && product.orderProducts && product.orderProducts.dataValues && product.orderProducts.dataValues.quantity) ||
  (product && product.dataValues && product.dataValues.Orderproducts && product.dataValues.Orderproducts.quantity) ||
  (product && product.dataValues && product.dataValues.Orderproducts && product.dataValues.Orderproducts.dataValues && product.dataValues.Orderproducts.dataValues.quantity) ||
  0
) || 0;

const getTotalOrder = (products = []) => {
  return products.reduce((acc, product) => {
    const price = Number(product && product.price ? product.price : 0);
    const quantity = getQuantity(product);
    return acc + (price * quantity);
  }, 0);
};

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
    return res.status(500).json({
      ok: false,
      msg: error.message
    });
  }
};
