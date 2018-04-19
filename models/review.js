'use strict';

module.exports = (sequelize, DataTypes) => {
    return sequelize.define('review', {
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true
        },
        text: {
            type: DataTypes.TEXT,
            allowNull: true
        },
        rating: {
            type: DataTypes.INTEGER,
            allowNull: true
        },
        isApproved: {
            type: DataTypes.BOOLEAN,
            allowNull: true,
            default: false
        },
        souvenirId: {
            type: DataTypes.INTEGER,
            allowNull: true
        },
        userId: {
            type: DataTypes.INTEGER,
            allowNull: true
        }
    }, {
        timestamps: true
    });
};
