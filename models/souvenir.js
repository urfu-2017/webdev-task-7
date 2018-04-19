'use strict';

module.exports = (sequelize, DataTypes) => {
    return sequelize.define('souvenir', {
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true
        },
        name: {
            type: DataTypes.TEXT,
            allowNull: false
        },
        image: DataTypes.TEXT,
        price: {
            type: DataTypes.DOUBLE,
            allowNull: false,
            validate: { min: 0 }
        },
        amount: {
            type: DataTypes.INTEGER,
            defaultValue: 0,
            validate: { min: 0 }
        },
        rating: {
            type: DataTypes.DOUBLE,
            validate: { min: 0, max: 5 }
        },
        isRecent: DataTypes.BOOLEAN,
        createdAt: {
            type: DataTypes.DATE,
            allowNull: false
        },
        updatedAt: {
            type: DataTypes.DATE,
            allowNull: false
        }
    },
    {
        indexes: [{ unique: true, fields: ['rating', 'price'] }]
    });
};
