'use strict';

module.exports = (sequelize, DataTypes) => {
    // Ваша модель отзыва
    return sequelize.define('review', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false,
            field: 'id'
        },
        text: {
            type: DataTypes.TEXT,
            field: 'text'
        },
        rating: {
            type: DataTypes.INTEGER,
            field: 'rating'
        },
        isApproved: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
            field: 'isApproved'
        },
        souvenirId: {
            type: DataTypes.INTEGER,
            foreignKey: true,
            field: 'souvenirId'
        },
        userId: {
            type: DataTypes.INTEGER,
            foreignKey: true,
            field: 'userId'
        }
    }, {
        timestamps: true
    });
};
