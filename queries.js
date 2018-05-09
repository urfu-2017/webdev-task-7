'use strict';
const Sequelize = require('sequelize');

class Queries {
    constructor({ sequelize, Country, Tag, Review, Souvenir, Cart, User }) {
        this.sequelize = sequelize;
        this.Country = Country;
        this.Tag = Tag;
        this.Review = Review;
        this.Souvenir = Souvenir;
        this.Cart = Cart;
        this.User = User;
    }

    // Далее идут методы, которые вам необходимо реализовать:

    getAllSouvenirs() {
        return this.Souvenir.findAll();
    }

    getCheapSouvenirs(price) {
        return this.Souvenir.findAll({
            where: {
                price: { [Sequelize.Op.lte]: price }
            }
        });
    }

    getTopRatingSouvenirs(n) {
        return this.Souvenir.findAll({
            order: [
                ['rating', 'DESC']
            ],
            limit: n
        });
    }

    getSouvenirsByTag(tag) {
        return this.Souvenir.findAll({
            attributes: ['id', 'name', 'image', 'price', 'rating'],
            include: {
                model: this.Tag,
                where: { name: tag },
                attributes: []
            }
        });
    }

    getSouvenirsCount({ country, rating, price }) {
        return this.Souvenir.count({
            where: {
                rating: {
                    [Sequelize.Op.gte]: rating
                },
                price: {
                    [Sequelize.Op.lte]: price
                }
            },
            include: {
                model: this.Country,
                where: { name: country }
            }
        });
    }

    searchSouvenirs(substring) {
        return this.Souvenir.findAll({
            where: {
                name: { [Sequelize.Op.contains]: substring }
            }
        });
    }

    getDisscusedSouvenirs(n) {
        return this.Review.findAll({
            attributes: ['souvenir.id'],
            group: ['souvenir.id'],
            include: {
                model: this.Souvenir,
                attributes: ['name', 'image', 'price', 'rating']
            },
            having: Sequelize.where(Sequelize.fn('COUNT', Sequelize.col('souvenir.id')), '>=', n)
        }).then(s => s.map(x => x.souvenir));
    }

    deleteOutOfStockSouvenirs() {
        return this.Souvenir.destroy({ where: { amount: 0 } });
    }

    async addReview(souvenirId, { login, text, rating }) {
        const user = await this.User.findOne({ where: { login } });
        await this.Review.create({ text, rating, souvenirId, userId: user.id });

        const souvenir = await this.Souvenir.findOne({ where: { souvenirId } });
        const ratings = await this.Review.findAll({ where: { souvenirId } }).then(r => r.rating);
        souvenir.rating = ratings.reduce((a, b) => a + b, 0) / ratings.length;

        await souvenir.save();
    }

    getCartSum(login) {
        return this.Cart.sum('souvenirs.price', {
            group: 'carts.id',
            include: [
                {
                    model: this.User,
                    where: { login }
                },
                { model: this.Souvenir }
            ]
        });
    }
}

module.exports = Queries;
