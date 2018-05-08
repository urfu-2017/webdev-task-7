'use strict';

class Queries {
    constructor(models) {
        Object.assign(this, models);
    }

    get op() {
        return this.sequelize.Op;
    }

    getAllSouvenirs() {
        return this.Souvenir.findAll();
    }

    getCheapSouvenirs(price) {
        return this.Souvenir.findAll({
            where: {
                price: { [this.op.lte]: price }
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
            include: {
                model: this.Tag,
                where: { name: tag },
                attributes: []
            },
            attributes: ['id', 'name', 'image', 'price', 'rating']
        });
    }

    getSouvenirsCount({ country, rating, price }) {
        return this.Souvenir.count({
            where: {
                rating: {
                    [this.op.gte]: rating
                },
                price: {
                    [this.op.lte]: price
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
                name: {
                    [this.op.iRegexp]: substring
                }
            }
        });
    }

    getDisscusedSouvenirs(n) {
        return this.Souvenir.findAll({
            include: {
                model: this.Review,
                attributes: []
            },
            order: ['id'],
            group: 'souvenirs.id',
            having: this.sequelize.where(
                this.sequelize.fn('COUNT', this.sequelize.col('reviews.id')), '>=', n
            ),
            attributes: ['name', 'image', 'price', 'rating']
        });
    }

    deleteOutOfStockSouvenirs() {
        return this.Souvenir.destroy({
            where: { amount: 0 }
        });
    }

    async addReview(souvenirId, { login, text, rating }) {
        const transactionClosure = async transaction => {
            const user = await this.User.findOne({
                where: { login },
                transaction
            });
            const souvenir = await this.Souvenir.findById(souvenirId, { transaction });

            const review = {
                userId: user.id,
                text,
                rating
            };

            await souvenir.createReview(review, { transaction });

            const reviews = await souvenir.getReviews({ transaction });
            const updatedRating = reviews
                .map(rev => rev.rating)
                .reduce((acc, cur) => acc + cur, 0) / reviews.length;

            return souvenir.update({ rating: updatedRating }, { transaction });
        };

        return this.sequelize.transaction(transactionClosure);
    }

    getCartSum(login) {
        return this.Cart.sum(
            'souvenirs.price',
            {
                include: [
                    {
                        model: this.User,
                        where: { login }
                    },
                    {
                        model: this.Souvenir
                    }
                ],
                includeIgnoreAttributes: false
            }
        );
    }
}

module.exports = Queries;
