'use strict';

module.exports = (sequelize, DataTypes) => {
    return sequelize.define('carts',
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
