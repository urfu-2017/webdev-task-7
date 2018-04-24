'use strict';

module.exports = function (sequelize, DataTypes) {
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
            type: DataTypes.TEXT,
            allowNull: true
        },
        price: {
            type: DataTypes.DOUBLE,
            allowNull: false
        },
        rating: {
            type: DataTypes.DOUBLE,
            allowNull: true
        },
        amount: {
            type: DataTypes.INTEGER,
            allowNull: true,
            defaultValue: '0'
        },
        isRecent: {
            type: DataTypes.BOOLEAN,
            allowNull: true
        },
        createdAt: {
            type: DataTypes.DATE,
            allowNull: false
        },
        updatedAt: {
            type: DataTypes.DATE,
            allowNull: false
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
        tableName: 'souvenirs',
        indexes: [{
            name: 'rating_price_index',
            method: 'BTREE',
            fields: [{
                attribute: 'price',
                order: 'ASC'
            }, {
                attribute: 'rating',
                order: 'DESC'
            }]
        }]
    });
};
