'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('Orders', 'stockDiscounted', {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: false
    });

    await queryInterface.bulkUpdate(
      'Orders',
      { stockDiscounted: true },
      { state: 'completed' }
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('Orders', 'stockDiscounted');
  }
};
