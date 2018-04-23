'use strict';

module.exports = (sequelize, DataTypes) => sequelize.define('souvenirs', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    name: {
        type: DataTypes.STRING
    },
    image: {
        type: DataTypes.STRING
    },
    amount: {
        type: DataTypes.INTEGER
    },
    isRecent: {
        type: DataTypes.BOOLEAN
    },
    price: {
        type: DataTypes.DOUBLE
    },
    rating: {
        type: DataTypes.DOUBLE
    }
}, {
    timestamps: true,
    indexes: [{
        fields: ['rating', 'price']
    }]
});
