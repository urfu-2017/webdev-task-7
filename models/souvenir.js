'use strict';

module.exports = (sequelize, DataTypes) => {
    return sequelize.define('souvenir', {
        id: { type: DataTypes.INTEGER, allowNull: false, unique: true, primaryKey: true },
        name: { type: DataTypes.STRING, allowNull: false },
        image: { type: DataTypes.STRING },
        price: { type: DataTypes.DOUBLE, allowNull: false },
        rating: { type: DataTypes.DOUBLE },
        amount: { type: DataTypes.INTEGER, defaultValue: 0 },
        isRecent: { type: DataTypes.BOOLEAN },
        createdAt: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW },
        updatedAt: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW },
        countryId: { type: DataTypes.INTEGER }
    });
};

// CREATE TABLE souvenirs (
//     id integer NOT NULL,
//     name text NOT NULL,
//     image text,
//     price double precision NOT NULL,
//     rating double precision,
//     amount integer DEFAULT 0,
//     "isRecent" boolean,
//     "createdAt" timestamp with time zone NOT NULL,
//     "updatedAt" timestamp with time zone NOT NULL,
//     "countryId" integer
// );
