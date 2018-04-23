'use strict';

module.exports = (sequelize, DataTypes) => {
    return sequelize.define('review', {
        id: { type: DataTypes.INTEGER, allowNull: false, primaryKey: true, autoIncrement: true },
        text: { type: DataTypes.STRING },
        rating: { type: DataTypes.INTEGER },
        isApproved: { type: DataTypes.BOOLEAN, defaultValue: false },
        createdAt: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW },
        updatedAt: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW },
        souvenirId: { type: DataTypes.INTEGER, foreignKey: true },
        userId: { type: DataTypes.INTEGER, foreignKey: true }
    });
};

// CREATE TABLE reviews (
//     id integer NOT NULL,
//     text text,
//     rating integer,
//     "isApproved" boolean DEFAULT false,
//     "createdAt" timestamp with time zone NOT NULL,
//     "updatedAt" timestamp with time zone NOT NULL,
//     "souvenirId" integer,
//     "userId" integer
// );
