'use strict';

module.exports = (sequelize, DataTypes) => sequelize.define('souvenir_tags',
    {
        souvenirId: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        tagId: {
            type: DataTypes.INTEGER,
            allowNull: false
        }
    },
    {
        timestamps: true,
        indexes: [{ fields: ['souvenirId', 'tagId'] }]
    }
);
