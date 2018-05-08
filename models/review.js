'use strict';

module.exports = (sequelize, DataTypes) => {
    return sequelize.define('reviews', {
        text: DataTypes.TEXT,
        rating: {
            type: DataTypes.INTEGER,
            validate: { min: 0, max: 5 }
        },
        isApproved: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        },
        souvenirId: {
            type: DataTypes.INTEGER,
            references: {
                model: 'souvenirs',
                key: 'id'
            }
        },
        userId: {
            type: DataTypes.INTEGER,
            references: {
                model: 'users',
                key: 'id'
            }
        }
    });
};
