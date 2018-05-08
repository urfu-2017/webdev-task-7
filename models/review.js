'use strict';

module.exports = (sequelize, DataTypes) => {
    return sequelize.define('carts', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false
        },
        text: DataTypes.STRING,
        rating: DataTypes.INTEGER,
        isApproved: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        },
        souvenirId: {
            type: DataTypes.INTEGER,
            references: {
                model: 'souvenirs',
                key: 'id'
            },
            allowNull: false
        },
        userId: {
            type: DataTypes.INTEGER,
            references: {
                model: 'users',
                key: 'id'
            },
            allowNull: false
        }
    },
    {
        timestamps: true
    });
};
