'use strict';

module.exports = (sequelize, DataTypes) => {
    return sequelize.define('carts', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false
        },
        userId: {
            type: DataTypes.INTEGER,
            unique: true,
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
