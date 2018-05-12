'use strict';

const { Op, fn, where } = require('sequelize');

class Queries {
    constructor(models) {
        this.models = models;
    }

    getAllSouvenirs() {
        return this.models.Souvenir.findAll();
    }

    getCheapSouvenirs(price) {
        return this.models.Souvenir.findAll({
            where: {
                price: {
                    [Op.lte]: price
                }
            }
        });
    }

    getTopRatingSouvenirs(n) {
        return this.models.Souvenir.findAll({
            limit: n,
            order: [
                ['rating', 'DESC']
            ]
        });
    }

    getSouvenirsByTag(tag) {
        return this.models.Souvenir.findAll({
            attributes: ['id', 'name', 'image', 'price', 'rating'],
            include: {
                model: this.models.Tag,
                where: {
                    name: tag
                },
                attributes: []
            }
        });
    }

    getSouvenirsCount({ country, rating, price }) {
        return this.models.Souvenir.count({
            where: {
                rating: {
                    [Op.gte]: rating
                },
                price: {
                    [Op.lte]: price
                }
            },
            include: {
                model: this.models.Country,
                where: {
                    name: country
                }
            }
        });
    }

    searchSouvenirs(substring) {
        return this.models.Souvenir.findAll({
            where: {
                name: {
                    [Op.iRegexp]: substring
                }
            }
        });
    }

    getDisscusedSouvenirs(n) {
        return this.models.Souvenir.findAll({
            attributes: ['id', 'name', 'image', 'price', 'rating'],
            include: {
                model: this.models.Review,
                attributes: []
            },
            group: ['souvenir.id'],
            having: where(
                fn('COUNT', 'review.id'), '>=', n
            )
        });
    }

    deleteOutOfStockSouvenirs() {
        return this.models.Souvenir.destroy({
            where: {
                amount: 0
            }
        });
    }

    addReview(souvenirId, { login, text, rating }) {
        return this.models.sequelize.transaction(async trans => {
            const user = await this.models.User.findOne({
                where: {
                    login
                },
                transaction: trans
            });

            await this.models.Review.create(
                {
                    text, rating, souvenirId, userId: user.id
                },
                {
                    transaction: trans
                }
            );

            const reviews = await this.models.Review.findAll({
                where: { souvenirId },
                transaction: trans
            });

            const souvenir = await this.models.Souvenir.findOne({
                where: { id: souvenirId },
                transaction: trans
            });

            souvenir.rating = reviews.map(review => review.rating)
                .reduce((a, b) => a + b, 0) / reviews.length;
            await souvenir.save({ transaction: trans });
        });
    }

    getCartSum(login) {
        return this.models.Cart.sum('souvenirs.price', {
            group: 'cart.id',
            include: [
                {
                    model: this.models.Souvenir
                },
                {
                    model: this.models.User,
                    where: {
                        login
                    }
                }
            ],
            includeIgnoreAttributes: false
        });
    }
}

module.exports = Queries;
