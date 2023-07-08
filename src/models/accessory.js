'use strict';
const { Model } = require('sequelize');
var slug = require('slug');
const { v4: uuid } = require('uuid');
const db = require('./index');
module.exports = (sequelize, DataTypes) => {
    class Accessory extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
            Accessory.belongsTo(models.Categories, { foreignKey: 'id_categories', as: 'category' });
        }
    }
    Accessory.init(
        {
            name: DataTypes.STRING,
            code: DataTypes.STRING,
            price: DataTypes.INTEGER,
            quanlity: DataTypes.INTEGER,
            id_categories: DataTypes.STRING,
        },
        {
            sequelize,
            paranoid: true,
            deletedAt: 'destroyTime',
            modelName: 'Accessories',
        },
    );
    Accessory.beforeCreate((accessory, _) => {
        return (accessory.id = uuid());
    });
    return Accessory;
};
