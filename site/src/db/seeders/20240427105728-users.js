'use strict';

const usersJSON = require('../../database/users.json');

const usersDBMapped = usersJSON.map(u => ({
  id: u.id,
  socialId: u.socialId ?? null,
  provider: u.provider ?? null,
  name: u.name,
  surname: u.surname,
  email: u.email,
  password: u.password,
  avatar: u.avatar || 'default-img.jpg',
  roleId: u.roleId,
  addressId: u.addressId ?? null,
  dni: u.dni,
  phoneNumber: u.phoneNumber,
  createdAt: new Date(),
  updatedAt: new Date()
}));

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('Users', usersDBMapped, {});
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Users', null, {});
  }
};
