'use strict';

module.exports = (sequelize, DataTypes) => sequelize.define('countries', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    name: DataTypes.STRING
}, {
    indexes: [{ fields: ['name'] }]
});
