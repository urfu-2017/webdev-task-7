'use strict';

require('dotenv').config({ path: `${__dirname}/.env` });
const Sequalize = require('sequelize');

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
const SouvenirTag = sequelize.import('models/souvenirTag');
const CartSouvenir = sequelize.import('models/cartSouvenir');

Cart.belongsTo(User, { foreignKey: 'userId' });
Cart.belongsToMany(Souvenir, { through: CartSouvenir });
Souvenir.belongsTo(Country, { foreignKey: 'countryId' });
Review.belongsTo(User, { foreignKey: 'userId' });
Souvenir.hasMany(Review, { foreignKey: 'souvenirId' });
Souvenir.belongsToMany(Tag, { through: SouvenirTag });

module.exports.sequelize = sequelize;

module.exports.Country = Country;
module.exports.Tag = Tag;
module.exports.Review = Review;
module.exports.Souvenir = Souvenir;
module.exports.Cart = Cart;
module.exports.User = User;
