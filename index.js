'use strict';

require('dotenv').config({ path: `${__dirname}/.env` });
const Sequelize = require('sequelize');

const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, {
    host: process.env.DB_HOST,
    dialect: 'postgres',
    logging: false,
    define: {
        underscored: false
    }
});

const Country = sequelize.import('models/country');
const Tag = sequelize.import('models/tag');
const Review = sequelize.import('models/review');
const Souvenir = sequelize.import('models/souvenir');
const Cart = sequelize.import('models/cart');
const User = sequelize.import('models/user');

Souvenir.hasMany(Review);
Souvenir.belongsTo(Country);
Souvenir.belongsToMany(Tag, { through: 'souvenir_tags' });

Review.belongsTo(Souvenir);
Review.belongsTo(User);

User.hasOne(Cart);
User.hasMany(Review);

Cart.belongsTo(User);
Cart.belongsToMany(Souvenir, { through: 'cart_souvenirs' });

Country.hasMany(Souvenir);

module.exports = {
    sequelize,
    Country,
    Tag,
    Review,
    Souvenir,
    Cart,
    User
};
