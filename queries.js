'use strict';

class Queries {
    constructor(models) {
        this.sequelize = models.sequelize;
        this.op = models.sequelize.Op;
        this.cart = models.Cart;
        this.country = models.Country;
        this.review = models.Review;
        this.souvenir = models.Souvenir;
        this.tag = models.Tag;
        this.user = models.User;
    }

    // Далее идут методы, которые вам необходимо реализовать:

    getAllSouvenirs() {
        return this.souvenir.findAll();
    }

    getCheapSouvenirs(price) {
        return this.souvenir.findAll({
            where: { price: { [this.op.lte]: price } }
        });
    }

    getTopRatingSouvenirs(n) {
        return this.souvenir.findAll({
            order: [['rating', 'DESC']],
            limit: n
        });
    }

    getSouvenirsByTag(tag) {
        return this.souvenir.findAll({
            attributes: ['id', 'name', 'image', 'price', 'rating'],
            include: {
                model: this.tag,
                where: { name: tag },
                attributes: []
            }
        });
    }

    getSouvenirsCount({ country, rating, price }) {
        return this.souvenir.count({
            where: {
                price: { [this.op.lte]: price },
                rating: { [this.op.gte]: rating }
            },
            include: {
                model: this.country,
                where: { name: country },
                attributes: []
            }
        });
    }

    searchSouvenirs(substring) {
        return this.souvenir.findAll({
            where: { name: { [this.op.iLike]: `%${substring}%` } }
        });
    }

    getDisscusedSouvenirs(n) {
        return this.souvenir.findAll({
            attributes: ['name', 'image', 'price', 'rating'],
            include: {
                model: this.review,
                attributes: []
            },
            order: ['id'],
            group: 'souvenirs.id',
            having: this.sequelize.where(
                this.sequelize.fn('COUNT', this.sequelize.col('reviews.id')), '>=', n)
        });
    }

    deleteOutOfStockSouvenirs() {
        return this.souvenir.destroy({
            where: { amount: 0 }
        });
    }

    addReview(souvenirId, { login, text, rating }) {
        const user = this.user.findOne({ where: { login } });
        const souvenir = this.souvenir.findById(souvenirId);

        return this.sequelize.transaction(async transaction => {
            await souvenir.createReview({ userId: user.id, text, rating }, { transaction });
            const reviews = await souvenir.getReviews({ transaction });
            await souvenir.update({ rating: (souvenir.rating * (reviews.length - 1) + rating) /
            (reviews.length) }, { transaction });
        });
    }

    getCartSum(login) {
        return this.cart.sum('souvenirs.price', {
            includeIgnoreAttributes: false,
            include: [
                { model: this.souvenir },
                { model: this.user, where: { login } }
            ],
            group: 'carts.id'
        });
    }
}

module.exports = Queries;
