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
        amount: {
            type: DataTypes.INTEGER,
            defaultValue: 0
        },
        image: DataTypes.TEXT,
        isRecent: DataTypes.BOOLEAN,
        name: DataTypes.TEXT,
        price: {
            type: DataTypes.DOUBLE
        },
        rating: {
            type: DataTypes.DOUBLE
        }
    }, {
        indexes: [{
            fields: ['rating', 'price']
        }]
    });
};
