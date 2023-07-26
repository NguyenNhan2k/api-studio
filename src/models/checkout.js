'use strict';
const { Model } = require('sequelize');
var slug = require('slug');
const { v4: uuid } = require('uuid');
const db = require('./index');
module.exports = (sequelize, DataTypes) => {
    class Checkout extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
        }
    }
    Checkout.init(
        {
            type: DataTypes.STRING,
            total: DataTypes.INTEGER,
            detail: DataTypes.STRING,
            image: DataTypes.STRING,
        },
        {
            sequelize,
            paranoid: true,
            deletedAt: 'destroyTime',
            modelName: 'Checkouts',
        },
    );
    Checkout.beforeCreate((checkout, _) => {
        checkout.id = uuid();
    });
    return Checkout;
};
