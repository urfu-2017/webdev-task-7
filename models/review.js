'use strict';

module.exports = (sequelize, DataTypes) => {
    return sequelize.define('reviews', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        text: { type: DataTypes.STRING },
        rating: { type: DataTypes.DOUBLE },
        isApproved: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        }
    },
    {
        timestamps: true
    });
};
