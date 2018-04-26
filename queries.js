'use strict';

module.exports = class {
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
        return this.Souvenir.findAll({ where: { price: { [this.sequelize.Op.lte]: price } } });
    }

    getTopRatingSouvenirs(n) {
        return this.Souvenir.findAll({ order: [['rating', 'DESC']], limit: n });
    }

    getSouvenirsByTag(tag) {
        return this.Souvenir.findAll({
            include: {
                model: this.Tag,
                where: { name: tag }
            },
            attributes: ['id', 'name', 'image', 'price', 'rating'],
            includeIgnoreAttributes: false
        });
    }

    getSouvenirsCount({ country, rating, price }) {
        return this.Souvenir.count({
            include: [{
                model: this.Country,
                where: { name: country }
            }],
            where: {
                rating: { [this.sequelize.Op.gte]: rating },
                price: { [this.sequelize.Op.lte]: price }
            }
        });
    }

    searchSouvenirs(substring) {
        return this.Souvenir.findAll({ where: { name: {
            [this.sequelize.Op.iLike]: `%${substring}%`
        } } });
    }

    getDisscusedSouvenirs(n) {
        const count = field => this.sequelize.fn('COUNT', this.sequelize.col(field));

        return this.Souvenir.findAll({
            include: {
                model: this.Review,
                attributes: []
            },
            having: this.sequelize.where(count('reviews.id'), '>=', n),
            attributes: ['name', 'image', 'price', 'rating'],
            group: ['souvenirs.id'],
            order: 'id'
        });
    }

    deleteOutOfStockSouvenirs() {
        return this.Souvenir.destroy({ where: { amount: 0 } });
    }

    async addReview(souvenirId, { login, text, rating }) {
        return this.sequelize.transaction(async transaction => {
            const user = await this.User.findOne({ where: { login }, transaction });

            await this.Review.create({ userId: user.id, souvenirId, text, rating },
                { transaction });

            const souvenir = await this.Souvenir.findOne({
                where: { id: souvenirId },
                include: { model: this.Review },
                transaction
            });

            const sumRating = Math.round(souvenir.rating * (souvenir.reviews.length - 1));
            const newRating = (sumRating + rating) / (souvenir.reviews.length);

            return souvenir.update({ rating: newRating }, { transaction });
        });
    }

    getCartSum(login) {
        return this.Cart.sum('souvenirs.price', {
            includeIgnoreAttributes: false,
            include: [
                { model: this.Souvenir },
                { model: this.User, where: { login } }
            ]
        });
    }
};
