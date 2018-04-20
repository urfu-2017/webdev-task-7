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

const Country = sequelize.import('models/countries');
const Tag = sequelize.import('models/tags');
const Review = sequelize.import('models/reviews');
const Souvenir = sequelize.import('models/souvenirs');
const Cart = sequelize.import('models/carts');
const CartSouvenirs = sequelize.import('models/cart_souvenirs');
const SouvenirTags = sequelize.import('models/souvenir_tags');
const User = sequelize.import('models/users');

// Ваши relations между моделями :)
Souvenir.belongsToMany(Tag, { through: SouvenirTags });
Souvenir.hasMany(Review);
Souvenir.belongsTo(Country);
Review.belongsTo(User);
Cart.belongsToMany(Souvenir, { through: CartSouvenirs });
Cart.belongsTo(User);

module.exports.sequelize = sequelize;

module.exports.Country = Country;
module.exports.Tag = Tag;
module.exports.Review = Review;
module.exports.Souvenir = Souvenir;
module.exports.Cart = Cart;
module.exports.User = User;
