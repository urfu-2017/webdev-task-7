'use strict';

module.exports = function (sequelize, DataTypes) {
    return sequelize.define('souvenir_tags', {
        souvenirId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'souvenirs',
                key: 'id'
            }
        },
        tagId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'tags',
                key: 'id'
            }
        }
    }, {
        tableName: 'souvenir_tags'
    });
};
