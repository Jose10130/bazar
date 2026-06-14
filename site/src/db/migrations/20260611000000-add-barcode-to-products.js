'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('Products', 'barcode', {
      type: Sequelize.STRING(64),
      allowNull: true,
      defaultValue: null
    });

    await queryInterface.sequelize.query(
      `UPDATE "Products" SET barcode = CONCAT('PRD-', LPAD(CAST(id AS VARCHAR), 8, '0')) WHERE barcode IS NULL OR barcode = ''`
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('Products', 'barcode');
  }
};