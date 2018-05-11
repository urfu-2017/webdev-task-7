'use strict';

module.exports = (sequelize, DataTypes) => sequelize.define('souvenirs', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    name: DataTypes.STRING,
    image: DataTypes.STRING,
    amount: {
        type: DataTypes.INTEGER,
        defaultValue: 0
    },
    isRecent: DataTypes.BOOLEAN,
    price: DataTypes.FLOAT,
    rating: DataTypes.FLOAT
}, {
    indexes: [{ fields: ['price', 'rating'] }]
});
