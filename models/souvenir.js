'use strict';

module.exports = (sequelize, DataTypes) => sequelize.define('souvenirs', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false,
        autoIncrement: true
    },
    name: DataTypes.TEXT,
    image: DataTypes.TEXT,
    price: DataTypes.DOUBLE,
    rating: DataTypes.DOUBLE,
    amount: DataTypes.INTEGER,
    isRecent: DataTypes.BOOLEAN,
    countryId: {
        type: DataTypes.INTEGER,
        references: {
            model: 'countries',
            key: 'id'
        }
    }
},
{
    timestamps: true,
    indexes: [{
        fields: ['countryId', 'price', 'rating']
    }]
});
