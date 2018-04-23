'use strict';

module.exports = (sequelize, DataTypes) => sequelize.define('reviews', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    text: DataTypes.TEXT,
    rating: DataTypes.DOUBLE,
    isApproved: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
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
    }
});
