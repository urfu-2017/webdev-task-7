'use strict';


class Queries {
    constructor(models) {
        this.Cart = models.Cart;
        this.Tag = models.Tag;
        this.User = models.User;
        this.Country = models.Country;
        this.Review = models.Review;
        this.sequelize = models.sequelize;
        this.Op = this.sequelize.Op;
        this.Souvenir = models.Souvenir;
    }

    // Далее идут методы, которые вам необходимо реализовать:

    getAllSouvenirs() {
        return this.Souvenir.findAll();
    }

    getCheapSouvenirs(price) {
        return this.Souvenir.findAll({
            where: {
                price: {
                    [this.Op.lte]: price
                }
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
                    [this.Op.gte]: rating
                },
                price: {
                    [this.Op.lte]: price
                }
            },
            include: {
                model: this.Country,
                where: {
                    name: country
                },
                attributes: ['name']
            }
        });
    }

    searchSouvenirs(substring) {
        return this.Souvenir.findAll({
            where: {
                name: {
                    [this.Op.iLike]: `%${substring}%`
                }
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
            group: 'souvenirs.id',
            having: this.sequelize.where(
                this.sequelize.fn('COUNT', this.sequelize.col('reviews.id')), '>=', n
            ),
            order: ['id']
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
            const souvenir = await this.Souvenir.findById(souvenirId);
            const user = await this.User.findOne({
                where: { login }
            });
            await souvenir.createReview({
                text,
                rating,
                souvenirId,
                userId: user.id
            }, { transaction });

            const reviews = await souvenir.getReviews({ transaction });
            const newRating = reviews
                .reduce((prev, current) => prev + current.rating, 0) / reviews.length;
            await souvenir.update({ rating: newRating }, { transaction });
        });
    }

    async getCartSum(login) {
        return await this.Cart.sum(
            'souvenirs.price',
            {
                group: ['carts.id'],
                includeIgnoreAttributes: false,
                include: [
                    { model: this.User, where: { login } },
                    { model: this.Souvenir }
                ]
            }
        );
    }
}

module.exports = Queries;
