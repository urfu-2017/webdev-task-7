'use strict';

module.exports = (sequelize, DataTypes) => sequelize.define('souvenirs', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    name: DataTypes.STRING,
    image: DataTypes.STRING,
    amount: DataTypes.INTEGER,
    isRecent: DataTypes.BOOLEAN,
    price: DataTypes.FLOAT,
    rating: DataTypes.FLOAT
}, {
    indexes: [{ fields: ['price', 'rating'] }]
});
