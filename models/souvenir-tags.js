'use strict';

module.exports = function (sequelize, DataTypes) {
    return sequelize.define('souvenir_tags', {
        createdAt: {
            type: DataTypes.DATE,
            allowNull: false
        },
        updatedAt: {
            type: DataTypes.DATE,
            allowNull: false
        },
        souvenirId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            references: {
                model: 'souvenir',
                key: 'id'
            }
        },
        tagId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'tag',
                key: 'id'
            }
        }
    }, {
        tableName: 'souvenir_tags'
    });
};
