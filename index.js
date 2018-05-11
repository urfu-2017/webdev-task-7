'use strict';

require('dotenv').config({ path: `${__dirname}/.env` });
const Sequelize = require('sequelize');

const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, {
    host: process.env.DB_HOST,
    dialect: 'postgres',
    operatorsAliases: false,
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

Country.hasMany(Souvenir);

User.hasOne(Cart);
User.hasMany(Review);

Review.belongsTo(User);
Review.belongsTo(Souvenir);

Cart.belongsTo(User);
Cart.belongsToMany(Souvenir, { through: 'cart_souvenirs' });

module.exports.sequelize = sequelize;

module.exports.Country = Country;
module.exports.Tag = Tag;
module.exports.Review = Review;
module.exports.Souvenir = Souvenir;
module.exports.Cart = Cart;
module.exports.User = User;
