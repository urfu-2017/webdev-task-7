'use strict';

module.exports = (sequelize, DataTypes) => {
    return sequelize.define('cart', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            notNull: true
        },
        userId: {
            type: DataTypes.INTEGER
        }
    });
};
