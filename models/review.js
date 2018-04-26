'use strict';

module.exports = (sequelize, DataTypes) => sequelize.define('reviews', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    },
    text: DataTypes.TEXT,
    rating: {
        type: DataTypes.INTEGER,
        validate: { max: 5, min: 0 }
    },
    isApproved: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    },
    souvenirId: {
        type: DataTypes.INTEGER,
        references: { model: 'souvenirs', key: 'id' }
    },
    userId: {
        type: DataTypes.INTEGER,
        references: { model: 'users', key: 'id' }
    }
});
