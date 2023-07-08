'use strict';
const { Model } = require('sequelize');
var slug = require('slug');
const { v4: uuid } = require('uuid');
const db = require('./index');
module.exports = (sequelize, DataTypes) => {
    class DetailReceipt extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
            DetailReceipt.belongsTo(models.Receipts, { foreignKey: 'id_receipt', as: 'receipt' });
            DetailReceipt.belongsTo(models.Weddings, { foreignKey: 'id_target', as: 'wedding' });
            DetailReceipt.belongsTo(models.Accessories, { foreignKey: 'id_target', as: 'accessory' });
        }
    }
    DetailReceipt.init(
        {
            id_receipt: DataTypes.STRING,
            id_target: DataTypes.STRING,
            quanlity: DataTypes.INTEGER,
            price: DataTypes.INTEGER,
            total: DataTypes.INTEGER,
        },
        {
            sequelize,
            paranoid: true,
            deletedAt: 'destroyTime',
            modelName: 'DetailReceipts',
        },
    );
    DetailReceipt.beforeCreate((receipt, _) => {
        receipt.id = uuid();
    });
    return DetailReceipt;
};
