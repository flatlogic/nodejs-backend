'use strict';
const bcrypt = require("bcrypt");
const config = require("../../config");

module.exports = {
    up: (queryInterface, Sequelize) => {
        let hash = bcrypt.hashSync(config.admin_pass, config.bcrypt.saltRounds);

        return queryInterface.bulkInsert('Users', [{
            email: 'admin@flatlogic.com',
            password: hash,
            createdAt: new Date(),
            updatedAt: new Date()
        }], {});
    },

    down: (queryInterface, Sequelize) => {
        return queryInterface.bulkDelete('Users', null, {});
    }
};
