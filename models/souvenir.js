'use strict';

module.exports = (sequelize, DataTypes) => sequelize.define('souvenirs', {
    // Ваша модель сувенира
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE,
    name: DataTypes.TEXT,
    image: DataTypes.TEXT,
    amount: DataTypes.INTEGER,
    isRecent: DataTypes.BOOLEAN,
    price: DataTypes.DOUBLE,
    rating: DataTypes.DOUBLE
}, { indexes: [{ fields: ['rating', 'price'] }] });
