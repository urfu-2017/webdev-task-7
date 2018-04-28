'use strict';

module.exports = (sequelize, DataTypes) => {
    // Ваша модель отзыва
    return sequelize.define('reviews', {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            allowNull: false,
            primaryKey: true
        },
        rating: {
            type: DataTypes.DOUBLE,
            validate: { min: 0, max: 5 }
        },
        souvenirId: {
            type: DataTypes.INTEGER,
            references: {
                model: 'souvenirs',
                key: 'id'
            }
        },
        userId: {
            type: DataTypes.INTEGER,
            references: {
                model: 'users',
                key: 'id'
            }
        },
        isApproved: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        },
        text: DataTypes.TEXT
    });
};
