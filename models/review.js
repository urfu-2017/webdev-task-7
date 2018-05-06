'use strict';

module.exports = (sequelize, DataTypes) => {
    return sequelize.define('review', {
        text: {
            type: DataTypes.TEXT
        },
        rating: {
            type: DataTypes.INTEGER
        },
        isApproved: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        }
    });
};
