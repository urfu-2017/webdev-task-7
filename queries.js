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

    async getDisscusedSouvenirs(n) {
        const souvenirs = this.Souvenir.findAll({
            attributes: ['name', 'image', 'price', 'rating'],
            include: { model: this.Review }
        });

        return souvenirs
            .filter(souvenir => souvenir.reviews.length >= n)
            .map(function (s) {
                return {
                    name: s.name,
                    image: s.image,
                    price: s.price,
                    rating: s.rating
                };
            });
    }

    deleteOutOfStockSouvenirs() {
        return this.Souvenir.destroy({ where: { amount: 0 } });
    }

    addReview(souvenirId, { login, text, rating }) {
        /* eslint-disable no-unused-vars */
        return this.sequelize.transaction(async t => {
            const author = await this.User.findOne({ where: { login } });
            const souvenir = await this.Souvenir.findById(souvenirId);

            const newReview = await this.Review.create({ text, rating });
            author.addReview(newReview);
            souvenir.addReview(newReview);
            await newReview.save();

            return await this._updateRating(souvenir, rating);
        });
    }

    async _updateRating(souvenir, addedRating) {
        const reviews = await souvenir.getReviews();
        const newRating = (souvenir.rating * reviews.length + addedRating) / (reviews.length + 1);

        return await souvenir.update({ rating: newRating });
    }

    async getCartSum(login) {
        const user = await this.User.findOne({ where: { login } });
        const cart = await user.getCart();
        const souvenirs = await cart.getSouvenirs();

        return souvenirs.reduce((sum, souvenir) =>sum + souvenir.price * souvenir.amount, 0);
    }
}

module.exports = Queries;
