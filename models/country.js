'use strict';

module.exports = (sequelize, DataTypes) => {
    return sequelize.define('country', {
        name: {
            type: DataTypes.TEXT
        }
    }, {
        indexes: [
            {
                fields: ['name']
            }
        ]
    });
};
