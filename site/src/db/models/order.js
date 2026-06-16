'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Order extends Model {
    static associate(models) {
      Order.belongsToMany(models.Product, {
        through: 'Orderproducts',
        foreignKey: 'orderId',
        otherKey: 'productId',
        as: 'products'
      });

      Order.belongsTo(models.User, {
        foreignKey: 'userId',
        as: 'user'
      });
    }
  }

  Order.init({
    total: {
      type: DataTypes.DOUBLE,
      defaultValue: 0
    },
    discountAmount: {
      type: DataTypes.DOUBLE,
      allowNull: false,
      defaultValue: 0
    },
    discountPercent: {
      type: DataTypes.DOUBLE,
      allowNull: false,
      defaultValue: 0
    },

    userId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    state: {
      type: DataTypes.STRING,
      validate: {
        isIn: {
          args: [['completed', 'pending', 'canceled']],
          msg: "Los valores validos de estado son 'completed', 'pending' o 'canceled'"
        }
      },
      defaultValue: 'pending'
    },
    stockDiscounted: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    }
  }, {
    sequelize,
    modelName: 'Order',
    paranoid: true
  });

  return Order;
};
