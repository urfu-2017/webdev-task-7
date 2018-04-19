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

const Country = sequelize.import('models/country');
const Tag = sequelize.import('models/tag');
const Review = sequelize.import('models/review');
const SouvenirTags = sequelize.import('models/souvenirTags');
const Souvenir = sequelize.import('models/souvenir');
const CartSouvenirs = sequelize.import('models/cartSouvenirs');
const Cart = sequelize.import('models/cart');
const User = sequelize.import('models/user');

// Ваши relations между моделями :)
Souvenir.belongsToMany(Tag, { through: SouvenirTags });
Souvenir.belongsTo(Country);
Souvenir.hasMany(Review);
User.hasOne(Cart);
Cart.belongsToMany(Souvenir, { through: CartSouvenirs });

module.exports.sequelize = sequelize;

module.exports.Country = Country;
module.exports.Tag = Tag;
module.exports.Review = Review;
module.exports.Souvenir = Souvenir;
module.exports.Cart = Cart;
module.exports.User = User;
