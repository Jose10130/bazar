const { Op } = require('sequelize');
const db = require('../../db/models');

module.exports = async (req) => {
  const userId =
    (req.session && req.session.userLogin && req.session.userLogin.id) ||
    (req.query && req.query.userId) ||
    (req.body && req.body.userId);

  if (!userId) {
    const error = new Error('Debes iniciar sesión para usar el carrito.');
    error.status = 401;
    throw error;
  }

  const [order, created] = await db.Order.findOrCreate({
    where: {
      userId,
      state: 'pending'
    },
    defaults: {
      userId,
      state: 'pending',
      total: 0
    },
    include: [
      {
        association: 'products',
        through: {
          attributes: ['quantity']
        }
      }
    ]
  });

  return [order, created];
};
