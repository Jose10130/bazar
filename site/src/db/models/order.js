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
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    total: {
      type: DataTypes.DOUBLE,
      allowNull: true
    },
    state: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: 'pending',
      validate: {
        isIn: [['pending', 'completed', 'canceled']]
      
      }
    },
    stockDiscounted: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    }
  }, {
    sequelize,
    modelName: 'Order',
  });

  return Order;
};