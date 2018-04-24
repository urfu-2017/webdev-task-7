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
        text: {
            type: DataTypes.TEXT,
            allowNull: false
        },
        rating: {
            type: DataTypes.INTEGER
        },
        isApproved: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        },
        souvenirId: {
            type: DataTypes.INTEGER,
            foreignKey: true,
            allowNull: false
        },
        userId: {
            type: DataTypes.INTEGER,
            foreignKey: true,
            allowNull: false
        }
    }, {
        timestamps: true,
        tableName: 'reviews'
    });
};
