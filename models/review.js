'use strict';

module.exports = (sequelize, DataTypes) => {
    return sequelize.define('review', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false
        },
        text: DataTypes.TEXT,
        rating: DataTypes.SMALLINT,
        isApproved: DataTypes.BOOLEAN,
        souvenirId: {
            type: DataTypes.INTEGER,
            foreignKey: true
        },
        userId: {
            type: DataTypes.INTEGER,
            foreignKey: true
        }
    },
    { timestamps: true });
};
