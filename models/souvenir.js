'use strict';

module.exports = (sequelize, DataTypes) => {
    return sequelize.define('souvenir', {
        name: { type: DataTypes.STRING, allowNull: false },
        image: { type: DataTypes.STRING },
        price: { type: DataTypes.DOUBLE, allowNull: false },
        rating: { type: DataTypes.DOUBLE },
        amount: { type: DataTypes.INTEGER, defaultValue: 0 },
        isRecent: { type: DataTypes.BOOLEAN }
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
