'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class status extends Model {
    static associate(models) {}
  }

  status.init({
    name: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'status',
    paranoid: true
  });

  return status;
};
