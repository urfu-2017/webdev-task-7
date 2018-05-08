'use strict';

module.exports = (sequelize, DataTypes) => {
    return sequelize.define('carts', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false
        }
    },
    {
        timestamps: true,
        indexes: [
            {
                unique: true,
                fields: ['name']
            }
        ]
    });
};
