'use strict';

module.exports = (sequelize, DataTypes) => {
    return sequelize.define('cart', {
        id: { type: DataTypes.INTEGER, allowNull: false, unique: true, primaryKey: true },
        userId: { type: DataTypes.INTEGER },
        createdAt: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW },
        updatedAt: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW }
    });
};


// CREATE TABLE carts (
//     id integer NOT NULL,
//     "createdAt" timestamp with time zone NOT NULL,
//     "updatedAt" timestamp with time zone NOT NULL,
//     "userId" integer
// );
