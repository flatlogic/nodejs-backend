'use strict';
const bcrypt = require("bcrypt");
const config = require("../../config");
const { v4: uuidv4 } = require('uuid');

module.exports = {
  up: (queryInterface, Sequelize) => {
    let hash = bcrypt.hashSync(config.admin_pass, config.bcrypt.saltRounds);

    return queryInterface.bulkInsert('users', [
      {
        id: '44cd4090-a641-443d-bdf5-51debfa10356',
        no_disable: true,
        firstName: 'Admin',
        email: config.admin_email,
        emailVerified: true,
        role: 'admin',
        provider: config.providers.LOCAL,
        password: hash,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: uuidv4(),
        no_disable: true,
        firstName: 'John',
        email: 'john@doe.com',
        emailVerified: true,
        role: 'user',
        provider: config.providers.LOCAL,
        password: hash,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: uuidv4(),
        no_disable: true,
        firstName: 'Client',
        email: 'client@hello.com',
        emailVerified: true,
        role: 'user',
        provider: config.providers.LOCAL,
        password: hash,
        createdAt: new Date(),
        updatedAt: new Date()
      },
    ]);
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('users', null, {});
  }
};
