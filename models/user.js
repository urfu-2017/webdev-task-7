'use strict';

module.exports = (sequelize, DataTypes) => sequelize.define('users', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    login: DataTypes.STRING
});
