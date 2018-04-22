'use strict';

require('dotenv').config({ path: `${__dirname}/.env` });
const Sequelize = require('sequelize');

const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, {
    host: process.env.DB_HOST,
    dialect: 'postgres',
    operatorsAliases: false, // если вы будете делать запросы без deprecated алиасов
    logging: false,
    define: {
        underscored: false
    }
});

// sequelize
//     .authenticate()
//     .then(() => {
//         console.info('Connection has been established successfully.');
//     })
//     .catch(err => {
//         console.error('Unable to connect to the database:', err);
//     });

const Country = sequelize.import('models/country');
const Tag = sequelize.import('models/tag');
const Review = sequelize.import('models/review');
const Souvenir = sequelize.import('models/souvenir');
const Cart = sequelize.import('models/cart');
const User = sequelize.import('models/user');

// Ваши relations между моделями :)
User.hasMany(Review);
Review.belongsTo(User);
User.hasOne(Cart);
Review.belongsTo(Souvenir);
Souvenir.belongsTo(Country);
Country.hasMany(Souvenir);

module.exports.sequelize = sequelize;

module.exports.Country = Country;
module.exports.Tag = Tag;
module.exports.Review = Review;
module.exports.Souvenir = Souvenir;
module.exports.Cart = Cart;
module.exports.User = User;
