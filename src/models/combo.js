'use strict';
const { Model } = require('sequelize');
var slug = require('slug');
const { v4: uuid } = require('uuid');
const db = require('./index');
module.exports = (sequelize, DataTypes) => {
    class Combo extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
        }
    }
    Combo.init(
        {
            name: DataTypes.STRING,
            code: DataTypes.STRING,
            price: DataTypes.INTEGER,
            slug: DataTypes.STRING,
            detail: DataTypes.STRING,
        },
        {
            sequelize,
            paranoid: true,
            deletedAt: 'destroyTime',
            modelName: 'Combos',
        },
    );
    Combo.beforeCreate((wedding, _) => {
        wedding.id = uuid();
        wedding.slug = slug(wedding.name);
    });
    return Combo;
};
