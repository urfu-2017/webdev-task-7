'use strict';

class Queries {
    constructor(models) {
        // Что-нибудь инициализируем в конструкторе
        this.sequelize = models.sequelize;
        this.Op = models.sequelize.Op;
        this.Cart = models.Cart;
        this.Country = models.Country;
        this.Review = models.Review;
        this.Souvenir = models.Souvenir;
        this.Tag = models.Tag;
        this.User = models.User;
    }

    // Далее идут методы, которые вам необходимо реализовать:

    async getAllSouvenirs() {
        // Данный метод должен возвращать все сувениры.
        return this.Souvenir.findAll();
    }

    getCheapSouvenirs(price) {
        // Данный метод должен возвращать все сувениры, цена которых меньше или равна price.
        return this.Souvenir.findAll({
            where: { price: { [this.Op.lte]: price } }
        });
    }

    getTopRatingSouvenirs(n) {
        // Данный метод должен возвращать топ n сувениров с самым большим рейтингом.
        return this.Souvenir.findAll({
            order: [['rating', 'DESC']],
            limit: n
        });
    }

    getSouvenirsByTag(tag) {
        // Данный метод должен возвращать все сувениры, в тегах которых есть tag.
        // Кроме того, в ответе должны быть только поля id, name, image, price и rating.
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
        // Данный метод должен возвращать количество сувениров,
        // из страны country, с рейтингом больше или равной rating,
        // и ценой меньше или равной price.

        // Важно, чтобы метод работал очень быстро,
        // поэтому учтите это при определении моделей (!).
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
        // Данный метод должен возвращать все сувениры, в название которых входит
        // подстрока substring. Поиск должен быть регистронезависимым.
        return this.Souvenir.findAll({
            where: { name: { [this.Op.iLike]: `%${substring}%` } }
        });
    }

    getDisscusedSouvenirs(n) {
        // Данный метод должен возвращать все сувениры, имеющих >= n отзывов.
        // Кроме того, в ответе должны быть только поля name, image, price и rating.
        return this.Souvenir.findAll({
            attributes: ['name', 'image', 'price', 'rating'],
            include: {
                model: this.Review,
                attributes: []
            },
            order: ['id'],
            group: 'souvenir.id',
            having: this.sequelize.where(
                this.sequelize.fn('COUNT', this.sequelize.col('review.id')), '>=', n
            )
        });
    }

    deleteOutOfStockSouvenirs() {
        // Данный метод должен удалять все сувениры, которых нет в наличии
        // (то есть amount = 0).

        // Метод должен возвращать количество удаленных сувениров в случае успешного удаления.
        return this.Souvenir.destroy({
            where: { amount: 0 }
        });
    }

    async addReview(souvenirId, { login, text, rating }) {
        // Данный метод должен добавлять отзыв к сувениру souvenirId
        // содержит login, text, rating - из аргументов.
        // Обратите внимание, что при добавлении отзыва рейтинг сувенира должен быть пересчитан,
        // и всё это должно происходить за одну транзакцию (!).
        const user = await this.User.findOne({ where: { login } });
        const souvenir = await this.Souvenir.findById(souvenirId);

        return this.sequelize.transaction(async transaction => {
            await souvenir.createReview({ userId: user.id, text, rating }, { transaction });

            const reviews = await souvenir.getReviews({ transaction });
            rating = (souvenir.rating * (reviews.length - 1) + rating) / (reviews.length);

            await souvenir.update({ rating }, { transaction });
        });
    }

    getCartSum(login) {
        // Данный метод должен считать общую стоимость корзины пользователя login
        // У пользователя может быть только одна корзина, поэтому это тоже можно отразить
        // в модели.
        return this.Cart.sum('souvenir.price', {
            group: 'cart.id',
            includeIgnoreAttributes: false,
            include: [
                { model: this.Souvenir },
                { model: this.User, where: { login } }
            ]
        });
    }
}

module.exports = Queries;
