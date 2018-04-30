'use strict';

module.exports = (sequelize, DataTypes) => {
    // Ваша модель страны
    return sequelize.define('country', {
        name: {
            type: DataTypes.TEXT
        }
    }, {
        indexes: [{
            fields: ['name']
        }]
    });
};
