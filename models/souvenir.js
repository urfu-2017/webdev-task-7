'use strict';

module.exports = (sequelize, DataTypes) => {
    return sequelize.define('souvenir', {
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true
        },
        name: {
            type: DataTypes.TEXT,
            allowNull: false
        },
        image: {
            type: DataTypes.TEXT
        },
        price: {
            type: DataTypes.DOUBLE,
            allowNull: false,
            validate: { min: 0 }
        },
        rating: {
            type: DataTypes.DOUBLE,
            allowNull: false,
            validate: { min: 0, max: 5 }
        },
        amount: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0,
            validate: { min: 0 }
        },
        isRecent: {
            type: DataTypes.BOOLEAN
        },
        countryId: {
            type: DataTypes.INTEGER,
            references: {
                model: 'countries',
                key: 'id'
            }
        }
    }, {
        indexes: [
            {
                fields: ['rating', 'price']
            }
        ]
    });
};
