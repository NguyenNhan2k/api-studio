'use strict';
const { Model } = require('sequelize');
const { v4: uuid } = require('uuid');
module.exports = (sequelize, DataTypes) => {
    class Categories extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
            Categories.hasMany(models.Weddings, { foreignKey: 'id_categories', as: 'weddings' });
        }
    }
    Categories.init(
        {
            value: {
                type: DataTypes.STRING,
            },
        },
        {
            sequelize,
            paranoid: true,
            deletedAt: 'destroyTime',
            modelName: 'Categories',
        },
    );
    Categories.beforeCreate((service, _) => {
        return (service.id = uuid());
    });
    return Categories;
};
