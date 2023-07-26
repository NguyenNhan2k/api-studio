'use strict';
const { Model } = require('sequelize');
var slug = require('slug');
const { v4: uuid } = require('uuid');
const db = require('./index');
module.exports = (sequelize, DataTypes) => {
    class DetailContract extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
        }
    }
    DetailContract.init(
        {
            id_contract: DataTypes.STRING,
            id_target: DataTypes.STRING,
            quanlity: DataTypes.INTEGER,
            price: DataTypes.INTEGER,
            total: DataTypes.INTEGER,
        },
        {
            sequelize,
            paranoid: true,
            deletedAt: 'destroyTime',
            modelName: 'DetailContracts',
        },
    );
    DetailContract.beforeCreate((contract, _) => {
        contract.id = uuid();
    });
    return DetailContract;
};
