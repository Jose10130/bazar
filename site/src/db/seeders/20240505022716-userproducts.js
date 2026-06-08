'use strict';

const usersJSON = require('../../database/users.json');

const userProductsMapped = usersJSON.flatMap(user => {
  const favourites = Array.isArray(user.favourites) ? user.favourites : [];
  return favourites.map(productId => {
    const normalizedProductId = typeof productId === 'object'
      ? productId.id ?? productId.productId
      : productId;

    return {
      userId: user.id,
      productId: normalizedProductId,
      createdAt: new Date(),
      updatedAt: new Date()
    };
  });
});

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('userproducts', userProductsMapped, {});
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('userproducts', null, {});
  }
};
