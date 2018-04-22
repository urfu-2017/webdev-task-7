'use strict';

module.exports = (sequelize, DataTypes) => {
    return sequelize.define('reviews', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        isApproved: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        },
        rating: DataTypes.DOUBLE,
        text: DataTypes.STRING,
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
        }
    });
};
