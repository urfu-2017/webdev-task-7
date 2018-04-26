'use strict';

const User = require('./user');

module.exports = (sequelize, DataTypes) => sequelize.define('carts', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    },
    userId: {
        type: DataTypes.INTEGER,
        references: { model: User, key: 'id' }
    }
});
