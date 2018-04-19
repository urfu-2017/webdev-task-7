'use strict';

module.exports = (sequelize, DataTypes) => {
    // Ваша модель отзыва
    return sequelize.define('reviews', {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
            allowNull: false
        },
        text: DataTypes.TEXT,
        rating: DataTypes.INTEGER,
        isApproved: {
            type: DataTypes.BOOLEAN,
            default: false
        },
        createdAt: {
            type: DataTypes.DATE,
            allowNull: false
        },
        updatedAt: {
            type: DataTypes.DATE,
            allowNull: false
        },
        souvenirId: DataTypes.INTEGER,
        userId: DataTypes.INTEGER
    });
};
