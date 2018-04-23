'use strict';

require('dotenv').config({ path: `${__dirname}/.env` });
const Sequalize = require('sequelize');

const sequelize = new Sequalize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, {
    host: process.env.DB_HOST,
    dialect: 'postgres',
    operatorsAliases: false, // если вы будете делать запросы без deprecated алиасов
    logging: false,
    define: {
        underscored: false
    }
});

const Cart = sequelize.import('models/cart');
const Country = sequelize.import('models/country');
const Review = sequelize.import('models/review');
const Souvenir = sequelize.import('models/souvenir');
const Tag = sequelize.import('models/tag');
const User = sequelize.import('models/user');

// Ваши relations между моделями :)
Cart.belongsTo(User);
Cart.belongsToMany(Souvenir, { through: 'CartSouvenirs' });
Review.belongsTo(User);
Souvenir.belongsTo(Country);
Souvenir.belongsToMany(Tag, { through: 'SouvenirTags' });
Souvenir.hasMany(Review);

module.exports.sequelize = sequelize;

module.exports.Cart = Cart;
module.exports.Country = Country;
module.exports.Review = Review;
module.exports.Souvenir = Souvenir;
module.exports.Tag = Tag;
module.exports.User = User;
