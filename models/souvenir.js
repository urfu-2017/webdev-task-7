'use strict';

module.exports = (sequelize, DataTypes) => sequelize.define('souvenirs', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    },
    name: DataTypes.TEXT,
    price: DataTypes.DOUBLE,
    image: DataTypes.TEXT,
    rating: DataTypes.DOUBLE,
    amount: DataTypes.INTEGER,
    isRecent: DataTypes.BOOLEAN,
    countryId: {
        type: DataTypes.INTEGER,
        references: { model: 'countries', key: 'id' }
    }
});
