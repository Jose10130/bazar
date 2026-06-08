'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class payment_method extends Model {
    static associate(models) {}
  }

  payment_method.init({
    name: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'payment_method',
    tableName: 'payment_method',
    paranoid: true
  });

  return payment_method;
};
