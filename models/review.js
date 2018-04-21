'use strict';

module.exports = (sequelize, DataTypes) => {
    return sequelize.define('review', {
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true
        },
        text: DataTypes.TEXT,
        rating: DataTypes.INTEGER,
        isApproved: DataTypes.BOOLEAN,
        souvenirId: DataTypes.INTEGER,
        userId: DataTypes.INTEGER
    });
};
