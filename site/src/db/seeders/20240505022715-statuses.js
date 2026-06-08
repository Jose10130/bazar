'use strict';

const statusesJSON = require('../../database/statuses.json');

const statusesDBMapped = statusesJSON.map(s => ({
  id: s.id,
  name: s.name,
  createdAt: new Date(),
  updatedAt: new Date()
}));

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('statuses', statusesDBMapped, {});
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('statuses', null, {});
  }
};
