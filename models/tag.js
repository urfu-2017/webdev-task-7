'use strict';

module.exports = (sequelize, DataTypes) => {
    // Ваша модель тэга
    return sequelize.define('tag', {
        name: {
            type: DataTypes.TEXT,
            field: 'name'
        }
    }, {
        timestamps: true
    });
};
