'use strict';

module.exports = (sequelize, DataTypes) => {
    // Ваша модель 
    return sequelize.define('souvenirs', {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            allowNull: false,
            primaryKey: true
        },
        name: DataTypes.TEXT,
        image: DataTypes.TEXT,
        price: DataTypes.DOUBLE,
        rating: DataTypes.DOUBLE,
        amount: DataTypes.INTEGER,
        countryId: {
            type: DataTypes.INTEGER,
            references: {
                model: 'countries',
                key: 'id'
            }
        }
    },
    {
        indexes: [{
            fields: ['price', 'rating', 'country']
        }]
    });
};
