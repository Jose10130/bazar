'use strict';

/**
 * Deprecated duplicate migration.
 * The real join table is created by 20240715062316-create-userproducts.js.
 * Keep this file as a no-op so sequelize-cli does not try to create the table twice.
 */
module.exports = {
  async up() {},
  async down() {}
};
