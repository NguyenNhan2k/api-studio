'use strict';
const { Model } = require('sequelize');
const { v4: uuid } = require('uuid');
var slug = require('slug');
module.exports = (sequelize, DataTypes) => {
    class Customer extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
        }
    }
    Customer.init(
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
            address: DataTypes.STRING,
            phone: DataTypes.STRING,
            slug: DataTypes.STRING,
        },
        {
            sequelize,
            paranoid: true,
            deletedAt: 'destroyTime',
            modelName: 'Customers',
        },
    );
    Customer.beforeCreate((user, _) => {
        user.id = uuid();
        user.slug = slug(user.firstName + user.lastName + ' ' + user.phone);
    });
    return Customer;
};
