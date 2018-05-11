'use strict';
const { Op } = require('sequelize');

class Queries {
    constructor(models) {
        this.Souvenir = models.Souvenir;
        this.sequelize = models.sequelize;
        this.Tag = models.Tag;
        this.Review = models.Review;
        this.Country = models.Country;
        this.Cart = models.Cart;
        this.User = models.User;
    }

    getAllSouvenirs() {
        return this.Souvenir.findAll();
    }

    getCheapSouvenirs(price) {
        return this.Souvenir.findAll({
            where: {
                price: { [Op.lte]: price }
            }
        });
    }

    getTopRatingSouvenirs(n) {
        return this.Souvenir.findAll({
            order: [['rating', 'DESC']],
            limit: n
        });
    }

    getSouvenirsByTag(tag) {
        return this.Souvenir.findAll({
            attributes: ['id', 'name', 'image', 'price', 'rating'],
            include: {
                model: this.Tag,
                where: {
                    name: tag
                },
                attributes: []
            }
        });
    }

    getSouvenirsCount({ country, rating, price }) {
        return this.Souvenir.count({
            where: {
                price: { [Op.lte]: price },
                rating: { [Op.gte]: rating }
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
                name: { [Op.iRegexp]: substring }
            }
        });
    }

    getDisscusedSouvenirs(n) {
        return this.Souvenir.findAll({
            attributes: ['name', 'image', 'price', 'rating'],
            include: {
                model: this.Review,
                attributes: []
            },
            order: ['id'],
            group: ['souvenirs.id'],
            having: this.sequelize.where(this.sequelize.fn('COUNT', 'reviews.id'), '>=', n)
        });
    }

    deleteOutOfStockSouvenirs() {
        return this.Souvenir.destroy({
            where: {
                amount: 0
            }
        });
    }

    addReview(souvenirId, { login, text, rating }) {
        return this.sequelize.transaction(async transaction => {
            const user = await this.User.findOne({
                where: {
                    login
                },
                transaction
            });
            await this.Review.create(
                { text, rating, souvenirId, userId: user.id },
                { transaction }
            );
            const [ratings, souvenir] = await Promise.all([
                this.Review.findAll({
                    where: { souvenirId },
                    transaction
                }),
                this.Souvenir.findOne({
                    where: { id: souvenirId },
                    transaction
                })
            ]);

            souvenir.rating = ratings.map(review => review.rating)
                .reduce((a, b) => a + b, 0) / ratings.length;
            await souvenir.save({ transaction });
        });
    }

    async getCartSum(login) {
        const cart = await this.Cart.findOne({
            include: [
                { model: this.User, where: { login } },
                { model: this.Souvenir }
            ]
        });

        const totalSum = cart.souvenirs
            .reduce((value, souvenir) => value + souvenir.price, 0)
            .toFixed(10);

        return totalSum;
    }

}

module.exports = Queries;
