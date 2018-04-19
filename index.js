'use strict';

require('dotenv').config({ path: `${__dirname}/.env` });
const Sequalize = require('sequelize');
const cls = require('continuation-local-storage');

const namespace = cls.createNamespace('my-namespace');
Sequalize.useCLS(namespace);

const sequelize = new Sequalize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, {
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

Tag.belongsToMany(Souvenir, { through: 'souvenir_tags' });
Souvenir.belongsToMany(Tag, { through: 'souvenir_tags' });

User.hasMany(Review);
Review.belongsTo(User);

Souvenir.hasMany(Review);
Review.belongsTo(Souvenir);

User.hasOne(Cart);
Cart.belongsToMany(Souvenir, { through: 'cart_souvenirs' });

Country.hasMany(Souvenir);
Souvenir.belongsTo(Country);

module.exports.sequelize = sequelize;

module.exports.Country = Country;
module.exports.Tag = Tag;
module.exports.Review = Review;
module.exports.Souvenir = Souvenir;
module.exports.Cart = Cart;
module.exports.User = User;
