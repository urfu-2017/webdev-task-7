'use strict';

module.exports = (sequelize, DataTypes) => {
    return sequelize.define('carts', {
        userId: {
            type: DataTypes.INTEGER,
            references: {
                model: 'users',
                key: 'id'
            }
        }
    });
};
