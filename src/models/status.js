'use strict';
const { Model } = require('sequelize');
const { v4: uuid } = require('uuid');
module.exports = (sequelize, DataTypes) => {
    class Status extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
            Status.hasMany(models.Contracts, { foreignKey: 'id_status', as: 'contract' });
        }
    }
    Status.init(
        {
            value: {
                type: DataTypes.STRING,
            },
        },
        {
            sequelize,
            paranoid: true,
            deletedAt: 'destroyTime',
            modelName: 'Statuses',
        },
    );
    Status.beforeCreate((status, _) => {
        return (status.id = uuid());
    });
    return Status;
};
