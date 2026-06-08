'use strict';

const ordersJSON = require('../../database/orders.json');

const ordersDBMapped = ordersJSON.map(o => ({
  id: o.id,
  userId: o.userId,
  total: o.total,
  state: o.state,
  createdAt: new Date(),
  updatedAt: new Date()
}));

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('Orders', ordersDBMapped, {});
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Orders', null, {});
  }
};
