'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('DetailReceipts', {
            id: {
                allowNull: false,
                primaryKey: true,
                type: Sequelize.UUID,
            },
            id_receipt: {
                type: Sequelize.STRING,
            },
            id_target: {
                type: Sequelize.STRING,
            },
            quanlity: {
                type: Sequelize.INTEGER,
                defaultValue: 0,
            },
            price: {
                type: Sequelize.INTEGER,
                defaultValue: 0,
            },
            total: {
                type: Sequelize.INTEGER,
                defaultValue: 0,
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
        await queryInterface.dropTable('DetailReceipts');
    },
};
