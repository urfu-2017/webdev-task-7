'use strict';

module.exports = (sequelize, DataTypes) => {
    // Ваша модель отзываreturn sequelize.define('cart', {
    return sequelize.define('review', {
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true
        },
        text: DataTypes.TEXT,
        rating: {
            type: DataTypes.INTEGER,
            max: 5
        },
        isApproved: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false
        }
    });

};
