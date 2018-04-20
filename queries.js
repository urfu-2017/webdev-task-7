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
            order: ['rating', 'DESC'],
            limit: n
        });
    }

    getSouvenirsByTag(tag) {
        return this.souvenir.findAll({
            attributes: ['id', 'name', 'image', 'price', 'rating'],
            include: {
                model: this.tag,
                where: { name: tag }
            }
        });
    }

    getSouvenirsCount({ country, rating, price }) {
        return this.souvenir.count({
            where: {
                rating: { [this.op.gte]: rating },
                price: { [this.op.lte]: price }
            },
            include: {
                model: this.country,
                where: { name: country }
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
            include: { model: this.review },
            group: 'souvenirs.id',
            having: this.sequelize.where(
                this.sequelize.fn('COUNT', this.sequelize.col('reviews.id')), '>=', n
            )
        });
    }

    deleteOutOfStockSouvenirs() {
        return this.souvenir.destroy({
            where: { amount: 0 }
        });
    }

    async addReview(souvenirId, { login, text, rating }) {
        const user = await this.user.findOne({ where: { login } });
        const souvenir = await this.souvenir.findById(souvenirId);

        return this.sequelize.transaction(async transaction => {
            const review = await this.review.create({ text, rating }, { transaction });

            user.addReview(review, { transaction });
            souvenir.addReview(review, { transaction });

            await review.save({ transaction });

            const reviews = await souvenir.getReviews({}, { transaction });
            rating = (souvenir.rating * reviews.length + rating) / (reviews.length + 1);

            await souvenir.update({ rating }, { transaction });
        });
    }

    getCartSum(login) {
        return this.cart.sum('souvenirs.price', {
            group: 'carts.id',
            includeIgnoreAttributes: false,
            include: [
                { model: this.souvenir },
                { model: this.user, where: { login } }
            ]
        });
    }
}

module.exports = Queries;
