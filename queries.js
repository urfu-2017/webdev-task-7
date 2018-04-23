'use strict';

const Sequelize = require('sequelize');
const Op = Sequelize.Op;

class Queries {
    constructor(models) {
        this.sequelize = models.sequelize;
        this.souvenir = models.Souvenir;
        this.tag = models.Tag;
        this.country = models.Country;
        this.review = models.Review;
        this.cart = models.Cart;
        this.user = models.User;
    }

    getAllSouvenirs() {
        return this.souvenir.findAll({});
    }

    getCheapSouvenirs(price) {
        return this.souvenir.findAll({
            where: {
                price: {
                    [Op.lte]: price
                }
            }
        });
    }

    getTopRatingSouvenirs(n) {
        return this.souvenir.findAll({
            order: [
                ['rating', 'DESC']
            ],
            limit: n
        });
    }

    getSouvenirsByTag(tag) {
        return this.souvenir.findAll({
            include: [{
                model: this.tag,
                where: {
                    name: tag
                },
                attributes: []
            }],
            attributes: ['id', 'name', 'image', 'price', 'rating']
        });
    }

    getSouvenirsCount({ country, rating, price }) {
        return this.souvenir.count({
            where: {
                price: {
                    [Op.lte]: price
                },
                rating: {
                    [Op.gte]: rating
                }
            },
            include: [{
                model: this.country,
                where: {
                    name: country
                },
                attributes: []
            }]
        });
    }

    searchSouvenirs(substring) {
        return this.souvenir.findAll({
            where: {
                name: {
                    [Op.iRegexp]: substring
                }
            }
        });
    }

    getDisscusedSouvenirs(n) {
        return this.souvenir.findAll({
            attributes: ['name', 'image', 'price', 'rating'],
            include: {
                model: this.review,
                attributes: []
            },
            group: 'souvenirs.id',
            having: this.sequelize.where(
                this.sequelize.fn('COUNT', 'reviews.id'), '>=', n
            )
        });
    }

    deleteOutOfStockSouvenirs() {
        return this.souvenir.destroy({
            where: {
                amount: 0
            }
        }).then((result) => {
            return result;
        });
    }

    async addReview(souvenirId, { login, text, rating }) {
        return this.sequelize.transaction(async trans => {
            const user = await this.user.findOne({ where: { login: login } });
            const userId = user.id;
            const souvenir = await this.souvenir.findById(souvenirId);
            const reviewsCountOld = await this.review.count({ where: { souvenirId } });

            const ratingNew = (souvenir.rating * reviewsCountOld + rating) / (reviewsCountOld + 1);

            await this.souvenir.update({
                rating: ratingNew
            }, {
                where: { id: souvenirId },
                transaction: trans
            });

            await this.review.create({ souvenirId, userId, text, rating }, { transaction: trans });
        });
    }

    getCartSum(login) {
        return this.cart.sum('souvenirs.price', {
            group: 'carts.id',
            includeIgnoreAttributes: false,
            include: [
                {
                    model: this.souvenir
                },
                {
                    model: this.user,
                    where: {
                        login: login
                    }
                }
            ]
        });
    }
}

module.exports = Queries;
