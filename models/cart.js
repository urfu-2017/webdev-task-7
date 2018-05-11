'use strict';

module.exports = (sequelize, DataTypes) => {
    return sequelize.define('carts', {
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            autoIncrement: true,
            primaryKey: true
        },
        userId: {
            type: DataTypes.INTEGER,
            references: {
                model: 'users',
                key: 'id'
            }
        }
    },
    {
        timestamps: true
    });
};

