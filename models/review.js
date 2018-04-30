'use strict';

module.exports = (sequelize, DataTypes) => {
    // Ваша модель отзыва
    return sequelize.define('reviews', {
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true
        },
        isApproved: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        },
        rating: {
            type: DataTypes.INTEGER,
            validate: { min: 0, max: 5 }
        },
        text: DataTypes.TEXT,
        souvenirId: {
            type: DataTypes.INTEGER
        },
        userId: {
            type: DataTypes.INTEGER
        }
    });
};
