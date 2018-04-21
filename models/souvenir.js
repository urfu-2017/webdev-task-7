'use strict';

module.exports = (sequelize, DataTypes) => {
    return sequelize.define('souvenir', {
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true
        },
        name: DataTypes.TEXT,
        image: DataTypes.TEXT,
        price: DataTypes.DOUBLE,
        rating: DataTypes.DOUBLE,
        amount: DataTypes.INTEGER,
        isRecent: DataTypes.BOOLEAN,
        createdAt: DataTypes.DATE,
        updatedAt: DataTypes.DATE,
        countryId: DataTypes.INTEGER
    });
};
