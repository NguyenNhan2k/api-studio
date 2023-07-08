'use strict';
const { Model } = require('sequelize');
const { v4: uuid } = require('uuid');
module.exports = (sequelize, DataTypes) => {
    class CategoriesService extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
        }
    }
    CategoriesService.init(
        {
            value: {
                type: DataTypes.STRING,
            },
        },
        {
            sequelize,
            paranoid: true,
            deletedAt: 'destroyTime',
            modelName: 'CategoriesService',
        },
    );
    CategoriesService.beforeCreate((service, _) => {
        return (service.id = uuid());
    });
    return CategoriesService;
};
