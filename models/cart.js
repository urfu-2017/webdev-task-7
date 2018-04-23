'use strict';

module.exports = (sequelize, DataTypes) =>
    sequelize.define('carts', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        }
    });
