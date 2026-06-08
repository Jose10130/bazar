'use strict';

const orderItemsJSON = require('../../database/order_items.json');

const orderProductsDBMapped = orderItemsJSON.map(op => ({
  id: op.id,
  orderId: op.orderId,
  productId: op.productId,
  quantity: op.quantity,
  createdAt: new Date(),
  updatedAt: new Date()
}));

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('Orderproducts', orderProductsDBMapped, {});
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Orderproducts', null, {});
  }
};
