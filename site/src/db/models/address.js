'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Address extends Model {
    static associate(models) {}
  }

  Address.init({
    active: DataTypes.BOOLEAN,
    street: DataTypes.STRING,
    streetNo: DataTypes.INTEGER,
    city: DataTypes.STRING,
    province: DataTypes.STRING,
    zipCode: DataTypes.INTEGER,
    country: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Address',
    paranoid: true
  });

  return Address;
};
