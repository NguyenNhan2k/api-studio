'use strict';
const { Model } = require('sequelize');
const { v4: uuid } = require('uuid');
module.exports = (sequelize, DataTypes) => {
    class Position extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
            Position.hasMany(models.Users, { foreignKey: 'id_position', as: 'users' });
        }
    }
    Position.init(
        {
            code: {
                type: DataTypes.STRING,
            },
            value: {
                type: DataTypes.STRING,
            },
        },
        {
            sequelize,
            paranoid: true,
            deletedAt: 'destroyTime',
            modelName: 'Positions',
        },
    );
    Position.beforeCreate((user, _) => {
        return (user.id = uuid());
    });
    return Position;
};
