'use strict';

const rolesJSON = require('../../database/roles.json');

const rolesDBMapped = rolesJSON.map(r => ({
  id: r.id,
  name: r.name,
  createdAt: new Date(),
  updatedAt: new Date()
}));

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('Roles', rolesDBMapped, {});
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Roles', null, {});
  }
};
