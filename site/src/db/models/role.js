'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Role extends Model {
    static associate(models) {
      Role.hasMany(models.User, {
        foreignKey: 'roleId',
        as: 'users'
      });
    }
  }

  Role.init({
    name: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Role',
    paranoid: true
  });

  return Role;
};
