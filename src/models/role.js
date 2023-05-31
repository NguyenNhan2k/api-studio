'use strict';
const { Model } = require('sequelize');
const { v4: uuid } = require('uuid');
module.exports = (sequelize, DataTypes) => {
    class Role extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
            Role.hasMany(models.Users, { foreignKey: 'id_role', as: 'user' });
        }
    }
    Role.init(
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
            modelName: 'Roles',
        },
    );
    Role.beforeCreate((user, _) => {
        return (user.id = uuid());
    });
    return Role;
};
