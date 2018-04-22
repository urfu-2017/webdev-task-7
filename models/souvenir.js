'use strict';

module.exports = (sequelize, DataTypes) => {
    return sequelize.define('souvenirs', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        name: DataTypes.STRING,
        image: DataTypes.STRING,
        amount: DataTypes.INTEGER,
        isRecent: DataTypes.BOOLEAN,
        price: DataTypes.DOUBLE,
        rating: DataTypes.DOUBLE,
        countryId: {
            type: DataTypes.INTEGER,
            references: {
                model: 'countries',
                key: 'id'
            }
        }
    });
};
