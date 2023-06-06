'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('Users', {
            id: {
                allowNull: false,
                primaryKey: true,
                type: Sequelize.UUID,
            },
            firstName: {
                type: Sequelize.STRING,
            },
            lastName: {
                type: Sequelize.STRING,
            },
            email: {
                type: Sequelize.STRING,
                require: true,
                unique: true,
            },
            password: {
                type: Sequelize.STRING,
                require: true,
            },
            address: {
                type: Sequelize.STRING,
            },
            phone: {
                type: Sequelize.STRING,
            },
            type_login: {
                type: Sequelize.STRING,
            },
            id_login: {
                type: Sequelize.STRING,
            },
            avatar: {
                type: Sequelize.STRING,
            },
            refresh_token: {
                type: Sequelize.STRING,
            },
            id_role: {
                type: Sequelize.STRING,
            },
            createdAt: {
                allowNull: false,
                type: Sequelize.DATE,
            },
            updatedAt: {
                allowNull: false,
                type: Sequelize.DATE,
            },
            destroyTime: {
                type: Sequelize.DATE,
            },
        });
    },
    async down(queryInterface, Sequelize) {
        await queryInterface.dropTable('Users');
    },
};
