'use strict';

const productsJSON = require('../../database/products.json');

const productsDBMapped = productsJSON.map(p => ({
  id: p.id,
  name: p.name,
  description: p.description || '',
  price: p.price,
  quantity: p.quantity,
  image: p.image || '',
  categoryId: p.categoryId,
  createdAt: new Date(),
  updatedAt: new Date()
}));

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('Products', productsDBMapped, {});
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Products', null, {});
  }
};
