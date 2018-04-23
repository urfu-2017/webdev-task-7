'use strict';

module.exports = (sequelize, DataTypes) => {
    return sequelize.define('reviews',
        {
            id: {
                type: DataTypes.INTEGER,
                allowNull: false,
                primaryKey: true,
                autoIncrement: true
            },
            text: {
                type: DataTypes.TEXT
            },
            rating: {
                type: DataTypes.INTEGER
            },
            isApproved: {
                type: DataTypes.BOOLEAN,
                defaultValue: false
            },
            souvenirId: {
                type: DataTypes.INTEGER
            },
            userId: {
                type: DataTypes.INTEGER
            }
        },
        {
            timestamps: true
        }
    );
};
