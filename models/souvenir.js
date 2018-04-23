'use strict';

module.exports = (sequelize, DataTypes) => {
    return sequelize.define('souvenirs', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        amount: DataTypes.INTEGER,
        image: DataTypes.STRING,
        isRecent: DataTypes.BOOLEAN,
        name: DataTypes.STRING,
        price: DataTypes.DOUBLE,
        rating: DataTypes.DOUBLE
    }, {
        indexes: [
            {
                fields: ['rating', 'price']
            }
        ]
    });
};
