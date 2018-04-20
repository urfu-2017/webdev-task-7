'use strict';

module.exports = (sequelize, DataTypes) => {
    return sequelize.define('review', {
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true
        },
        isApproved: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        },
        rating: {
            type: DataTypes.DOUBLE,
            validate: { min: 0, max: 5 }
        },
        text: DataTypes.TEXT,
        souvenirId: {
            type: DataTypes.INTEGER,
            references: {
                model: 'souvenir',
                key: 'id'
            }
        },
        userId: {
            type: DataTypes.INTEGER,
            references: {
                model: 'user',
                key: 'id'
            }
        }
    });
};
