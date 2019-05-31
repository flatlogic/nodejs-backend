'use strict';
module.exports = {
    up: (queryInterface, Sequelize) => {
        return queryInterface.createTable('Products', {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER
            },
            img: {
                type: Sequelize.STRING
            },
            title: {
                type: Sequelize.STRING
            },
            subtitle: {
                type: Sequelize.STRING
            },
            price: {
                type: Sequelize.DECIMAL
            },
            rating: {
                type: Sequelize.DECIMAL
            },
            description_1: {
                type: Sequelize.STRING
            },
            description_2: {
                type: Sequelize.STRING
            },
            code: {
                type: Sequelize.DECIMAL
            },
            hashtag: {
                type: Sequelize.STRING
            },
            technology: {
                type: Sequelize.ARRAY(Sequelize.STRING)
            },
            discount: {
                type: Sequelize.DECIMAL
            },
            createdAt: {
                allowNull: false,
                type: Sequelize.DATE
            },
            updatedAt: {
                allowNull: false,
                type: Sequelize.DATE
            }
        });
    },
    down: (queryInterface, Sequelize) => {
        return queryInterface.dropTable('Products');
    }
};