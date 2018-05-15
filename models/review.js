'use strict';

module.exports = (sequelize, DataTypes) => {
    return sequelize.define('review', {
        text: { type: DataTypes.STRING },
        rating: { type: DataTypes.INTEGER },
        isApproved: { type: DataTypes.BOOLEAN, defaultValue: false }
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
