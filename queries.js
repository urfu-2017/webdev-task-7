'use strict';

class Queries {
    constructor(models) {
        this.sequelize = models.sequelize;
        this.Op = models.sequelize.Op;
        this.Country = models.Country;
        this.Tag = models.Tag;
        this.Review = models.Review;
        this.Souvenir = models.Souvenir;
        this.Cart = models.Cart;
        this.User = models.User;
        this.SouvenirTag = models.SouvenirTag;
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
            where: { name: { [this.Op.iLike]: `%${substring}%` } }
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
            group: 'souvenirs.id',
            having: this.sequelize.where(
                this.sequelize.fn('COUNT', this.sequelize.col('reviews.id')), '>=', n
            )
        });
    }

    deleteOutOfStockSouvenirs() {
        return this.Souvenir.destroy({ where: { amount: 0 } });
    }

    addReview(souvenirId, { login, text, rating }) {
        return this.sequelize.transaction(async transaction => {
            const author = await this.User.findOne({ where: { login } });
            const souvenir = await this.Souvenir.findById(souvenirId);

            await this.Review.create({
                text,
                rating,
                souvenirId: souvenir.id,
                userId: author.id
            }, { transaction });

            return this._updateRating(souvenir, rating, transaction);
        });
    }

    async _updateRating(souvenir, addedRating, transaction) {
        const reviews = await souvenir.getReviews({ transaction });
        const newRating = (souvenir.rating * reviews.length + addedRating) / (reviews.length + 1);

        return souvenir.update({ rating: newRating }, { transaction });
    }

    async getCartSum(login) {
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
