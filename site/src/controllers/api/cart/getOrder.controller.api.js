const db = require('../../../db/models');
const { getOrderPending } = require('../../utils');

const getTotalOrder = (products = []) => {
  return products.reduce((acc, product) => {
    const price = Number(product && product.price ? product.price : 0);
    const quantity = Number(
      (product && product.Orderproducts && product.Orderproducts.quantity) ||
      (product && product.Orderproduct && product.Orderproduct.quantity) ||
      (product && product.orderProducts && product.orderProducts.quantity) ||
      0
    );
    return acc + (price * quantity);
  }, 0);
};

module.exports = async (req, res) => {
  try {
    const [order, isCreate] = await getOrderPending(req);

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

    const statusCode = isCreate ? 201 : 200;

    return res.status(statusCode).json({
      ok: true,
      isCreate,
      data: orderWithProducts
    });
  } catch (error) {
    return res.status(error.status || 500).json({
      ok: false,
      msg: error.message
    });
  }
};
