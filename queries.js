'use strict';

class Queries {
    constructor(models) {
        Object.assign(this, models);
    }

    get Op() {
        return this.sequelize.Op;
    }

    getAllSouvenirs() {
        return this.Souvenir.findAll();
    }

    getCheapSouvenirs(price) {
        return this.Souvenir.findAll({
            where: {
                price: { [this.Op.lte]: price }
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
                rating: { [this.Op.gte]: rating },
                price: { [this.Op.lte]: price }
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
                name: { [this.Op.iRegexp]: substring }
            }
        });
    }

    getDisscusedSouvenirs(n) {
        return this.Souvenir.findAll({
            attributes: ['name', 'image', 'price', 'rating'],
            order: ['id'],
            group: 'souvenirs.id',
            having: this.sequelize.where(
                this.sequelize.fn('COUNT', this.sequelize.col('reviews.id')), '>=', n
            ),
            include: {
                model: this.Review,
                attributes: []
            }
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
        const transaction = t =>
            Promise.all([
                this.Souvenir.findById(souvenirId, { transaction: t }),
                this.User.findOne({ where: { login } }, { transaction: t })
            ])
                .then(
                    ([souvenir, user]) => [souvenir, user, souvenir.getReviews({ transaction: t })]
                )
                .then(
                    ([souvenir, user, reviews]) => {
                        const review = {
                            text,
                            rating,
                            souvenirId,
                            userId: user.id
                        };
                        const reviewsCount = reviews.length;
                        const newRating = (souvenir.rating * reviewsCount + rating) /
                            (reviewsCount + 1);

                        return Promise.all([
                            souvenir.update({ rating: newRating }, { transaction: t }),
                            souvenir.createReview(review, { transaction: t })
                        ]);
                    });

        return this.sequelize.transaction(transaction);
    }

    getCartSum(login) {
        // Данный метод должен считать общую стоимость корзины пользователя login
        // У пользователя может быть только одна корзина, поэтому это тоже можно отразить
        // в модели.
        return this.Cart.sum('souvenirs.price', {
            includeIgnoreAttributes: false,
            include: [{
                model: this.User,
                where: { login },
                attributes: []
            },
            {
                model: this.Souvenir,
                attributes: []
            }]
        });
    }
}

module.exports = Queries;
