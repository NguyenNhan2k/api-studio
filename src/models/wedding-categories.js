'use strict';
const { Model } = require('sequelize');
const { v4: uuid } = require('uuid');
module.exports = (sequelize, DataTypes) => {
    class WeddingCategories extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
            WeddingCategories.hasMany(models.Weddings, { foreignKey: 'id_categoriesWedding', as: 'weddings' });
        }
    }
    WeddingCategories.init(
        {
            value: {
                type: DataTypes.STRING,
            },
        },
        {
            sequelize,
            paranoid: true,
            deletedAt: 'destroyTime',
            modelName: 'WeddingCategories',
        },
    );
    WeddingCategories.beforeCreate((service, _) => {
        return (service.id = uuid());
    });
    return WeddingCategories;
};
