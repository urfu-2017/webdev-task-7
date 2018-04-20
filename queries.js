'use strict';

class Queries {
    constructor(models) {
        this.models = models;
        this.Op = models.sequelize.Op;
    }

    // Далее идут методы, которые вам необходимо реализовать:

    getAllSouvenirs() {
        // Данный метод должен возвращать все сувениры.
        return this.models.Souvenir.findAll();
    }

    getCheapSouvenirs(price) {
        // Данный метод должен возвращать все сувениры, цена которых меньше или равна price.
        return this.models.Souvenir.findAll({
            where: { price: { [this.Op.lt]: price } }
        });
    }

    getTopRatingSouvenirs(n) {
        return this.models.Souvenir.findAll({
            order: [['rating', 'DESC']],
            limit: n
        });
    }

    getSouvenirsByTag(tag) {
        // Данный метод должен возвращать все сувениры, в тегах которых есть tag.
        // Кроме того, в ответе должны быть только поля id, name, image, price и rating.
        return this.models.Souvenir.findAll({
            attributes: ['id', 'name', 'image', 'price', 'rating'],
            include: [{
                model: this.models.Tag,
                where: { name: tag },
                attributes: []
            }]
        });
    }

    getSouvenirsCount({ country, rating, price }) {
        // Данный метод должен возвращать количество сувениров,
        // из страны country, с рейтингом больше или равной rating,
        // и ценой меньше или равной price.

        // Важно, чтобы метод работал очень быстро,
        // поэтому учтите это при определении моделей (!).
        return this.models.Souvenir.count({
            include: [{
                model: this.models.Country,
                where: { name: country },
                attributes: []
            }],
            where: {
                rating: { [this.Op.gte]: rating },
                price: { [this.Op.lte]: price }
            }
        });
    }

    searchSouvenirs(substring) {
        // Данный метод должен возвращать все сувениры, в название которых входит
        // подстрока substring. Поиск должен быть регистронезависимым.
        return this.models.Souvenir.findAll({
            where: {
                name: { [this.Op.iLike]: `%${substring}%` }
            }
        });
    }

    getDisscusedSouvenirs(n) {
        // Данный метод должен возвращать все сувениры, имеющих >= n отзывов.
        // Кроме того, в ответе должны быть только поля name, image, price и rating.
        const { fn, where, col } = this.models.sequelize;

        return this.models.Souvenir.findAll({
            attributes: ['name', 'image', 'price', 'rating'],
            include: [{
                model: this.models.Review,
                attributes: []
            }],
            group: col('souvenir.id'),
            having: where(fn('COUNT', col('review.id')), '>=', n)
        });
    }

    deleteOutOfStockSouvenirs() {
        // Данный метод должен удалять все сувениры, которых нет в наличии
        // (то есть amount = 0).

        // Метод должен возвращать количество удаленных сувениров в случае успешного удаления.
        return this.models.Souvenir.destroy({
            where: { amount: 0 }
        });
    }

    async addReview(souvenirId, { login, text, rating }) {
        // Данный метод должен добавлять отзыв к сувениру souvenirId
        // содержит login, text, rating - из аргументов.
        // Обратите внимание, что при добавлении отзыва рейтинг сувенира должен быть пересчитан,
        // и всё это должно происходить за одну транзакцию (!).
        const { sequelize, User, Souvenir } = this.models;
        const user = await User.findOne({ where: { login } });
        const souvenir = await Souvenir.findById(souvenirId);
        const transaction = await sequelize.transaction();
        await souvenir.createReview({ userId: user.id, text, rating }, { transaction });

        const reviews = await souvenir.getReviews({ attributes: ['rating'] }, { transaction });
        const sum = reviews.map(x => x.rating).reduce((x, y) => x + y, 0);
        souvenir.rating = sum === 0 ? 0 : sum / reviews.length;
        await souvenir.save({ transaction });
    }

    async getCartSum(login) {
        // Данный метод должен считать общую стоимость корзины пользователя login
        // У пользователя может быть только одна корзина, поэтому это тоже можно отразить
        // в модели.
        const user = await this.models.User.findOne({ where: { login } });
        const cart = await user.getCart();
        const souvenirs = await cart.getSouvenirs({ attributes: ['price'] });

        return souvenirs.map(x => x.price).reduce((x, y) => x + y, 0);
    }
}

module.exports = Queries;
