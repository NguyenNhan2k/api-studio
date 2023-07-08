'use strict';
const { Model } = require('sequelize');
var slug = require('slug');
const { v4: uuid } = require('uuid');
const db = require('./index');
module.exports = (sequelize, DataTypes) => {
    class Wedding extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
            Wedding.belongsTo(models.Categories, { foreignKey: 'id_categories', as: 'category' });
            Wedding.hasMany(models.Images, { foreignKey: 'id_target', as: 'images' });
            Wedding.belongsTo(models.WeddingCategories, { foreignKey: 'id_categoriesWedding', as: 'categoryWedding' });
        }
    }
    Wedding.init(
        {
            name: DataTypes.STRING,
            code: DataTypes.STRING,
            slug: DataTypes.STRING,
            detail: DataTypes.STRING,
            price: DataTypes.INTEGER,
            quanlity: DataTypes.INTEGER,
            id_categories: DataTypes.STRING,
            id_categoriesWedding: DataTypes.STRING,
        },
        {
            sequelize,
            paranoid: true,
            deletedAt: 'destroyTime',
            modelName: 'Weddings',
        },
    );
    Wedding.beforeCreate((wedding, _) => {
        wedding.id = uuid();
        wedding.slug = slug(wedding.name);
    });
    return Wedding;
};
