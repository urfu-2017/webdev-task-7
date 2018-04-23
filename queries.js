'use strict';

class Queries {
    constructor(models) {
        this.sequelize = models.sequelize;
        this.Cart = models.Cart;
        this.Country = models.Country;
        this.Review = models.Review;
        this.Souvenir = models.Souvenir;
        this.Tag = models.Tag;
        this.User = models.User;
    }

    getAllSouvenirs() {
        return this.Souvenir.findAll({});
    }

    getCheapSouvenirs(price) {
        return this.Souvenir.findAll({
            where: {
                price: {
                    $lte: price
                }
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
                rating: {
                    $gte: rating
                },
                price: {
                    $lte: price
                }
            },
            include: {
                model: this.Country,
                where: {
                    name: country
                }
            }
        });
    }

    searchSouvenirs(substring) {
        return this.Souvenir.findAll({
            where: {
                name: { $iRegexp: substring }
            }
        });
    }

    getDisscusedSouvenirs(n) {
        const { where, fn, col } = this.sequelize;

        return this.Souvenir.findAll({
            attributes: ['name', 'image', 'price', 'rating'],
            include: {
                model: this.Review,
                attributes: []
            },
            order: ['id'],
            group: 'souvenirs.id',
            having: where(fn('COUNT', col('reviews.id')), '>=', n
            )
        });
    }

    deleteOutOfStockSouvenirs() {
        return this.Souvenir.destroy({
            where: {
                amount: 0
            }
        });
    }

    async addReview(souvenirId, { login, text, rating }) {
        const user = await this.User.findOne({ where: { login } });
        const souvenir = await this.Souvenir.findById(souvenirId);

        return this.sequelize.transaction(async transaction => {
            await souvenir.createReview({ userId: user.id, text, rating }, { transaction });
            const reviews = await souvenir.getReviews({ transaction });
            rating = (souvenir.rating * (reviews.length - 1) + rating) / (reviews.length);
            await souvenir.update({ rating }, { transaction });
        });
    }

    getCartSum(login) {
        return this.Cart.sum('souvenirs.price', {
            group: 'carts.id',
            includeIgnoreAttributes: false,
            include: [
                {
                    model: this.Souvenir
                },
                {
                    model: this.User, where: { login }
                }
            ]
        });
    }
}

module.exports = Queries;
