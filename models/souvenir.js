'use strict';

module.exports = (sequelize, DataTypes) => {
    return sequelize.define('souvenirs', {
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true
        },
        name: {
            type: DataTypes.STRING,
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
        isRecent: DataTypes.BOOLEAN
    },
    {
        timestamps: true,
        indexes: [{ unique: true, fields: ['rating', 'price'] }]
    });
};
