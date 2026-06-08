'use strict';

const paymentMethodsJSON = require('../../database/payment_methods.json');

const paymentMethodsDBMapped = paymentMethodsJSON.map(p => ({
  id: p.id,
  name: p.name,
  createdAt: new Date(),
  updatedAt: new Date()
}));

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('payment_method', paymentMethodsDBMapped, {});
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('payment_method', null, {});
  }
};
