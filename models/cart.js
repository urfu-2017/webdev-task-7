'use strict';

module.exports = (sequelize, DataTypes) => {
    return sequelize.define('cart',
        {
            id: {
                type: DataTypes.INTEGER,
                allowNull: false,
                primaryKey: true,
                autoIncrement: true
            },
            userId: {
                type: DataTypes.INTEGER
            }
        },
        {
            timestamps: true
        });
};
