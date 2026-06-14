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

const getCartCount = (products = []) => {
  return products.reduce((acc, product) => acc + getQuantity(product), 0);
};

module.exports = async (req, res) => {
  try {
    if (!req.session.userLogin) {
      return res.redirect('/authentication');
    }

    const { id } = req.session.userLogin;

    const user = await db.User.findByPk(id, {
      include: [
        {
          model: db.Address,
          as: 'address'
        },
        {
          model: db.Product,
          as: 'favorites',
          attributes: ['id', 'name', 'price', 'image']
        }
      ]
    });

    const [order] = await getOrderPending(req);

    const orderWithProducts = await order.reload({
      include: [
        {
          association: 'products',
          through: {
            attributes: ['quantity']
          }
        },
        {
          association: 'user'
        }
      ]
    });

    orderWithProducts.total = getTotalOrder(orderWithProducts.products || []);
    await orderWithProducts.save();

    const categories = await db.Category.findAll();

    return res.render('cart/productCart', {
      order: orderWithProducts,
      user,
      categories,
      cartCount: getCartCount(orderWithProducts.products || [])
    });
  } catch (error) {
    return res.status(500).json({
      ok: false,
      msg: 'Error al buscar las órdenes del usuario ' + error.message
    });
  }
};
