'use strict';

class Queries {
    constructor(models) {
        this._sequelize = models.sequelize;
        this._op = models.sequelize.Op;
        this._Cart = models.Cart;
        this._Country = models.Country;
        this._Review = models.Review;
        this._Souvenir = models.Souvenir;
        this._Tag = models.Tag;
        this._User = models.User;
    }

    getAllSouvenirs() {
        return this._Souvenir.findAll();
    }

    getSouvenirByID(id) {
        return this._Souvenir.findAll({ where: id });
    }

    getCheapSouvenirs(price) {
        return this._Souvenir.findAll({
            where: { price: { [this._op.lte]: price } }
        });
    }

    getTopRatingSouvenirs(n) {
        return this._Souvenir.findAll({
            order: [['rating', 'DESC']],
            limit: n
        });
    }

    getSouvenirsByTag(tag) {
        return this._Souvenir.findAll({
            attributes: ['id', 'name', 'image', 'price', 'rating'],
            include: {
                model: this._Tag,
                where: { name: tag },
                attributes: []
            }
        });
    }

    getSouvenirsCount({ country, rating, price }) {
        return this._Souvenir.count({
            where: {
                rating: { [this._op.gte]: rating },
                price: { [this._op.lte]: price }
            },
            include: {
                model: this._Country,
                where: { name: country }
            }
        });
    }

    searchSouvenirs(substring) {
        return this._Souvenir.findAll({
            where: { name: { [this._op.iLike]: `%${substring}%` } }
        });
    }

    getDisscusedSouvenirs(n) {
        return this._Souvenir.findAll({
            attributes: ['name', 'image', 'price', 'rating'],
            include: {
                model: this._Review,
                attributes: []
            },
            order: ['id'],
            group: ['souvenirs.id'],
            having: this._sequelize.where(
                this._sequelize.fn('COUNT', this._sequelize.col('reviews.id')), '>=', n
            )
        });
    }

    deleteOutOfStockSouvenirs() {
        return this._Souvenir.destroy({ where: { amount: 0 } });
    }

    async addReview(souvenirId, { login, text, rating }) {
        const user = await this._User.findOne({ where: { login } });
        const souvenir = await this._Souvenir.findById(souvenirId);

        return this._sequelize.transaction(async t => {
            await souvenir.createReview({ userId: user.id, text, rating }, { transaction: t });
            const reviews = await souvenir.getReviews({ transaction: t });
            rating = (souvenir.rating * (reviews.length - 1) + rating) / reviews.length;
            await souvenir.update({ rating }, { transaction: t });
        });
    }

    async getCartSum(login) {
        return await this._Cart.sum('souvenirs.price', {
            group: ['carts.id'],
            includeIgnoreAttributes: false,
            include: [{
                model: this._Souvenir,
                attributes: []
            },
            {
                model: this._User, where: { login },
                attributes: []
            }]
        });
    }
}

module.exports = Queries;
