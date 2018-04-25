'use strict';

module.exports = (sequelize, DataTypes) => {
    // Ваша модель сувенира
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
            allowNull: false
        },
        rating: {
            type: DataTypes.DOUBLE
        },
        amount: {
            type: DataTypes.INTEGER
        },
        isRecent: {
            type: DataTypes.BOOLEAN
        },
        countryId: {
            type: DataTypes.INTEGER,
            allowNull: true,
            references: {
                model: 'countries',
                key: 'id'
            }
        }
    }, {
        timestamps: true,
        tableName: 'souvenirs'
    });
};
