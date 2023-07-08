'use strict';
const { Model } = require('sequelize');
const { v4: uuid } = require('uuid');
module.exports = (sequelize, DataTypes) => {
    class Images extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
            Images.belongsTo(models.Weddings, { foreignKey: 'id_target', as: 'wedding' });
        }
    }
    Images.init(
        {
            name: {
                type: DataTypes.STRING,
            },
            id_target: {
                type: DataTypes.STRING,
            },
        },
        {
            sequelize,
            paranoid: true,
            deletedAt: 'destroyTime',
            modelName: 'Images',
        },
    );
    Images.beforeCreate((user, _) => {
        return (user.id = uuid());
    });
    return Images;
};
