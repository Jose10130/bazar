'use strict';
const sequelizePaginate = require('sequelize-paginate');
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Product extends Model {
    static associate(models) {
      Product.belongsToMany(models.Order, {
        through: 'Orderproducts',
        foreignKey: 'productId',
        otherKey: 'orderId',
        as: 'orders'
      });

      Product.belongsTo(models.Category, {
        foreignKey: 'categoryId',
        as: 'category'
      });

      Product.belongsToMany(models.User, {
        through: 'userproducts',
        foreignKey: 'productId',
        otherKey: 'userId',
        as: 'favoritedBy'
      });
    }
  }

  Product.init({
    name: DataTypes.STRING,
    price: DataTypes.DOUBLE,
    categoryId: DataTypes.INTEGER,
    quantity: DataTypes.INTEGER,
    image: DataTypes.STRING,
    description: DataTypes.TEXT,
    barcode: {
      type: DataTypes.STRING(64),
      allowNull: true,
      defaultValue: null
    }
  }, {
    sequelize,
    modelName: 'Product',
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
    paranoid: true
  });

  sequelizePaginate.paginate(Product);

  return Product;
};
