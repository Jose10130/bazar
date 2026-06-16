'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('Orders', 'discountAmount', {
      type: Sequelize.DOUBLE,
      allowNull: false,
      defaultValue: 0
    });

    await queryInterface.addColumn('Orders', 'discountPercent', {
      type: Sequelize.DOUBLE,
      allowNull: false,
      defaultValue: 0
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('Orders', 'discountPercent');
    await queryInterface.removeColumn('Orders', 'discountAmount');
  }
};
