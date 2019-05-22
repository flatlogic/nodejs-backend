'use strict';

module.exports = {
    up: (queryInterface, Sequelize) => {
        return queryInterface.bulkInsert('Products', [
            {
                img: 'static/media/img1.jpg',
                title: 'trainers',
                description: 'Trainers In White',
                price: 76,
                rating: 4.6,
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                img: 'static/media/img2.jpg',
                title: 'boots',
                description: 'Trainers In Blue',
                price: 45,
                rating: 4.6,
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                img: 'static/media/img3.jpg',
                title: 'flat sandals',
                description: 'Trainers In White',
                price: 55,
                rating: 4.6,
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                img: 'static/media/img4.jpg',
                title: 'trainers',
                description: 'Trainers In White',
                price: 76,
                rating: 4.6,
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                img: 'static/media/img5.jpeg',
                title: 'boots',
                description: 'Trainers In Blue',
                price: 45,
                rating: 4.6,
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                img: 'static/media/img6.jpg',
                title: 'flat sandals',
                description: 'Trainers In White',
                price: 55,
                rating: 4.6,
                createdAt: new Date(),
                updatedAt: new Date()
            },
        ], {});
    },

    down: (queryInterface, Sequelize) => {
        return queryInterface.bulkDelete('Products', null, {});
    }
};
