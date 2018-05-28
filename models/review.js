'use strict';

module.exports = (sequelize, DataTypes) => {
    return sequelize.define('review', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            notNull: true
        },
        text: {
            type: DataTypes.TEXT
        },
        rating: {
            type: DataTypes.INTEGER
        },
        isApproved: {
            type: DataTypes.BOOLEAN,
            default: false
        },
        souvenirId: {
            type: DataTypes.INTEGER
        },
        userId: {
            type: DataTypes.INTEGER
        }
    });
};
