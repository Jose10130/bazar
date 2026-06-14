const db = require('../../../db/models');
const { getOrderPending } = require('../../utils');
const { getTotalOrder } = require('../../utils/getTotalOrder');

const getCartCount = (products = []) => {
  return products.reduce((acc, product) => {
    const quantity = Number(
      (product && product.Orderproducts && product.Orderproducts.quantity) ||
      (product && product.Orderproduct && product.Orderproduct.quantity) ||
      (product && product.orderProducts && product.orderProducts.quantity) ||
      0
    );
    return acc + quantity;
  }, 0);
};

module.exports = async (req, res) => {
  try {
    const { id } = req.params;
    const quantityToAdd = Math.max(Number(req.body && req.body.quantity ? req.body.quantity : (req.query && req.query.quantity ? req.query.quantity : 1)) || 1, 1);

    const [order] = await getOrderPending(req);

    const existingProduct = await db.Orderproduct.findOne({
      where: {
        orderId: order.id,
        productId: id
      }
    });

    if (existingProduct) {
      existingProduct.quantity = Number(existingProduct.quantity || 0) + quantityToAdd;
      await existingProduct.save();
    } else {
      await db.Orderproduct.create({
        orderId: order.id,
        productId: id,
        quantity: quantityToAdd
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

    return res.status(201).json({
      ok: true,
      msg: 'Producto agregado al carrito',
      data: {
        orderId: orderWithProducts.id,
        total: orderWithProducts.total,
        cartCount: getCartCount(orderWithProducts.products || [])
      }
    });
  } catch (error) {
    return res.status(error.status || 500).json({
      ok: false,
      msg: error.message
    });
  }
};
