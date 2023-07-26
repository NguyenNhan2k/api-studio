'use strict';
const { Model } = require('sequelize');
var slug = require('slug');
const { v4: uuid } = require('uuid');
const db = require('./index');
module.exports = (sequelize, DataTypes) => {
    class Contract extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
            Contract.belongsTo(models.Statuses, { foreignKey: 'id_status', as: 'status' });
        }
    }
    Contract.init(
        {
            code: DataTypes.STRING,
            id_staff: DataTypes.STRING,
            expireDate: DataTypes.DATE,
            id_status: DataTypes.STRING,
        },
        {
            sequelize,
            paranoid: true,
            deletedAt: 'destroyTime',
            modelName: 'Contracts',
        },
    );
    Contract.beforeCreate((contract, _) => {
        contract.id = uuid();
    });
    return Contract;
};
