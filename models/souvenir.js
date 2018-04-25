'use strict';

module.exports = (sequelize, DataTypes) => {
    return sequelize.define('souvenir', {
        id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
        name: DataTypes.STRING,
        image: DataTypes.STRING,
        price: DataTypes.DOUBLE,
        rating: DataTypes.FLOAT,
        amount: DataTypes.INTEGER,
        isRecent: DataTypes.BOOLEAN,
        countryId: {
            type: DataTypes.SMALLINT,
            foreignKey: true
        }
    },
    { timestamps: true });
};
