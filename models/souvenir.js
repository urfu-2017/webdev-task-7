'use strict';

module.exports = (sequelize, DataTypes) => {
    return sequelize.define('souvenir', {
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true
        },
        amount: {
            type: DataTypes.INTEGER,
            defaultValue: 0,
            validate: { min: 0 }
        },
        image: DataTypes.STRING,
        isRecent: DataTypes.BOOLEAN,
        name: DataTypes.STRING,
        price: {
            type: DataTypes.INTEGER,
            validate: { min: 0 }
        },
        rating: {
            type: DataTypes.DOUBLE,
            validate: { min: 0, max: 5 }
        }
    }, {
        indexes: [{
            fields: ['rating', 'price']
        }]
    });
};
