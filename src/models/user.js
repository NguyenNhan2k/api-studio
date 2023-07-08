'use strict';
const { Model } = require('sequelize');
const { v4: uuid } = require('uuid');
module.exports = (sequelize, DataTypes) => {
    class User extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
            User.belongsTo(models.Roles, { foreignKey: 'id_role', as: 'role' });
            User.belongsTo(models.Positions, { foreignKey: 'id_position', as: 'position' });
        }
    }
    User.init(
        {
            lastName: DataTypes.STRING,
            firstName: DataTypes.STRING,
            email: {
                type: DataTypes.STRING,
                validate: {
                    isEmail: true,
                },
                unique: {
                    msg: 'Email address already in use!',
                },
            },
            password: DataTypes.STRING,
            address: DataTypes.STRING,
            phone: DataTypes.STRING,
            wage: DataTypes.INTEGER,
            avatar: DataTypes.STRING,
            refresh_token: DataTypes.STRING,
            id_role: DataTypes.STRING,
            id_position: DataTypes.STRING,
        },
        {
            sequelize,
            paranoid: true,
            deletedAt: 'destroyTime',
            modelName: 'Users',
        },
    );
    User.beforeCreate((user, _) => {
        return (user.id = uuid());
    });
    return User;
};
