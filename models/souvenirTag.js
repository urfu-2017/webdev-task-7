'use strict';

module.exports = (sequelize, DataTypes) => {
    return sequelize.define('souvenir_tags',
        {
            souvenirId: {
                type: DataTypes.INTEGER,
                allowNull: false,
                primaryKey: true
            },
            tagId: {
                type: DataTypes.INTEGER,
                allowNull: false,
                primaryKey: true
            }
        },
        {
            timestamps: true,
            indexes: [
                { fields: ['souvenirId', 'tagId'] }
            ]
        }
    );
};
