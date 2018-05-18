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
        return this.Souvenir.findAll();
    }

    getCheapSouvenirs(price) {
        return this.Souvenir.findAll({
            where: {
                price: { [this.sequelize.Op.lte]: price }
            }
        });
    }

    getTopRatingSouvenirs(n) {
        return this.Souvenir.findAll({
            limit: n,
            order: [['rating', 'DESC']]
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
                rating: { [this.sequelize.Op.gte]: rating },
                price: { [this.sequelize.Op.lte]: price }
            },
            include: {
                model: this.Country,
                where: { name: country },
                attributes: []
            }
        });
    }

    searchSouvenirs(substring) {
        return this.Souvenir.findAll({
            where: { name: { [this.sequelize.Op.iLike]: `%${substring}%` } }
        });
    }

    getDisscusedSouvenirs(n) {
        return this.Souvenir.findAll({
            attributes: ['name', 'image', 'price', 'rating'],
            group: 'souvenirs.id',
            order: ['id'],
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
        return this.Souvenir.destroy({ where: { amount: 0 } });
    }

    async addReview(souvenirId, { login, text, rating }) {
        const souvenir = await this.Souvenir.findById(souvenirId);
        const reviewAuthor = await this.User.findOne({ where: { login } });

        return this.sequelize.transaction(async transaction => {
            await souvenir.createReview({ userId: reviewAuthor.id, text, rating }, { transaction });
            const reviews = await souvenir.getReviews({ transaction });
            rating = (souvenir.rating * (reviews.length - 1) + rating) / reviews.length;

            return souvenir.update({ rating }, { transaction });
        });
    }

    getCartSum(login) {
        return this.Cart.sum('souvenirs.price', {
            includeIgnoreAttributes: false,
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
