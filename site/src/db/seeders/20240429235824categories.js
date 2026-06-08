'use strict';

const categoriesJSON = require('../../database/categories.json');

const categoriesDBMapped = categoriesJSON.map(c => ({
  id: c.id,
  name: c.name,
  createdAt: new Date(),
  updatedAt: new Date()
}));

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('Categories', categoriesDBMapped, {});
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Categories', null, {});
  }
};
