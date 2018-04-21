'use strict';

module.exports = (sequelize, DataTypes) => sequelize.define('souvenir', {
    id: DataTypes.INTEGER,
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE,
    name: DataTypes.TEXT,
    image: DataTypes.TEXT,
    amount: DataTypes.INTEGER,
    isRecent: DataTypes.BOOLEAN,
    price: DataTypes.DOUBLE,
    rating: DataTypes.DOUBLE
});
