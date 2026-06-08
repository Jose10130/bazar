'use strict';

const addressesJSON = require('../../database/addresses.json');

const addressesDBMapped = addressesJSON.map(a => ({
  id: a.id,
  active: a.active ?? false,
  street: a.street,
  streetNo: a.streetNo,
  city: a.city,
  province: a.province,
  zipCode: a.zipCode,
  country: a.country,
  createdAt: new Date(),
  updatedAt: new Date()
}));

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('Addresses', addressesDBMapped, {});
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Addresses', null, {});
  }
};
