'use strict';

/**
 * @property {Sequelize} sequelize
 * @property {Model} Country
 * @property {Model} Tag
 * @property {Model} Review
 * @property {Model} Souvenir
 * @property {Model} Cart
 * @property {Model} User
 */
class Queries {
    constructor(models) {
        this.sequelize = models.sequelize;
        this.Country = models.Country;
        this.Tag = models.Tag;
        this.Review = models.Review;
        this.Souvenir = models.Souvenir;
        this.Cart = models.Cart;
        this.User = models.User;
    }

    // Далее идут методы, которые вам необходимо реализовать:

    // Данный метод должен возвращать все сувениры.
    getAllSouvenirs() {
        return this.Souvenir.findAll();
    }

    // Данный метод должен возвращать все сувениры, цена которых меньше или равна price.
    getCheapSouvenirs(price) {
        return this.Souvenir.findAll({
            where: {
                price: { [this.sequelize.Op.lt]: price }
            }
        });
    }

    // Данный метод должен возвращать топ n сувениров с самым большим рейтингом.
    getTopRatingSouvenirs(n) {
        return this.Souvenir.findAll({
            order: [['rating', 'DESC']],
            limit: n
        });
    }

    // Данный метод должен возвращать все сувениры, в тегах которых есть tag.
    // Кроме того, в ответе должны быть только поля id, name, image, price и rating.
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

    // Данный метод должен возвращать количество сувениров,
    // из страны country, с рейтингом больше или равной rating,
    // и ценой меньше или равной price.

    // Важно, чтобы метод работал очень быстро,
    // поэтому учтите это при определении моделей (!).
    getSouvenirsCount({ country, rating, price }) {
        return this.Souvenir.count({
            where: {
                rating: { [this.sequelize.Op.gte]: rating },
                price: { [this.sequelize.Op.lte]: price }
            },

            include: [{
                model: this.Country,
                where: { name: country },
                attributes: []
            }]
        });
    }

    // Данный метод должен возвращать все сувениры, в название которых входит
    // подстрока substring. Поиск должен быть регистронезависимым.
    searchSouvenirs(substring) {
        return this.Souvenir.findAll({
            where: {
                name: { [this.sequelize.Op.iLike]: `%${substring}%` }
            }
        });
    }

    // Данный метод должен возвращать все сувениры, имеющих >= n отзывов.
    // Кроме того, в ответе должны быть только поля id, name, image, price и rating.
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

    // Данный метод должен удалять все сувениры, которых нет в наличии
    // (то есть amount = 0).

    // Метод должен возвращать количество удаленных сувениров в случае успешного удаления.
    deleteOutOfStockSouvenirs() {
        return this.Souvenir.destroy({
            where: {
                amount: 0
            }
        });
    }

    // Данный метод должен добавлять отзыв к сувениру souvenirId
    // содержит login, text, rating - из аргументов.
    // Обратите внимание, что при добавлении отзыва рейтинг сувенира должен быть пересчитан,
    // и всё это должно происходить за одну транзакцию (!).
    async addReview(souvenirId, { login, text, rating }) {
        const user = await this.User.findOne({ where: { login } });
        const souvenir = await this.Souvenir.findById(souvenirId);

        if (!user || !souvenir) {
            throw new Error('You cannot add review to not exists souvenir or from not exists user');
        }

        return this.sequelize.transaction(async transaction => {
            const review = { userId: user.id, text, rating };
            await souvenir.createReview(review, { transaction });

            const reviews = await souvenir.getReviews({ transaction });
            rating = reviews.reduce((total, r) => total + r.rating, 0) / reviews.length;

            await souvenir.update({ rating }, { transaction });
        });
    }

    // Данный метод должен считать общую стоимость корзины пользователя login
    // У пользователя может быть только одна корзина, поэтому это тоже можно отразить
    // в модели.
    async getCartSum(login) {
        return this.Cart.sum('souvenirs.price', {
            includeIgnoreAttributes: false,
            group: 'carts.id',
            include: [
                {
                    model: this.User,
                    where: { login }
                },
                {
                    model: this.Souvenir
                }
            ]
        });
    }
}

module.exports = Queries;
