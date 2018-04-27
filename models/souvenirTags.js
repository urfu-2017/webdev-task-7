'use strict';

module.exports = (sequelize, DataTypes) => {
    // Ваша модель сувенира
    return sequelize.define('souvenir_tags', {
        tagId: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            allowNull: false
        },
        souvenirId: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            allowNull: false
        }
    },
    {
        timestamp: true
    });
};
