'use strict';

module.exports = (sequelize) => {
    return sequelize.define('cart');
};


// CREATE TABLE carts (
//     id integer NOT NULL,
//     "createdAt" timestamp with time zone NOT NULL,
//     "updatedAt" timestamp with time zone NOT NULL,
//     "userId" integer
// );
