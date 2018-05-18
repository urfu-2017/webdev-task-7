'use strict';
const { Op } = require('sequelize');

class Queries {
    constructor(models) {
        // Что-нибудь инициализируем в конструкторе
        this.sequelize = models.sequelize;
        this._countries = models.Country;
        this._tags = models.Tag;
        this._reviews = models.Review;
        this._souvenirs = models.Souvenir;
        this._carts = models.Cart;
        this._users = models.User;
    }

    // Далее идут методы, которые вам необходимо реализовать:

    getAllSouvenirs() {
        // Данный метод должен возвращать все сувениры.
        return this._souvenirs.findAll();
    }

    getCheapSouvenirs(price) {
        // Данный метод должен возвращать все сувениры, цена которых меньше или равна price.
        return this._souvenirs.findAll({
            where: {
                price: {
                    [Op.lte]: price
                }
            }
        });
    }

    getTopRatingSouvenirs(n) {
        // Данный метод должен возвращать топ n сувениров с самым большим рейтингом.
        return this._souvenirs.findAll({
            order: [
                ['rating', 'DESC']
            ],
            limit: n
        });
    }

    getSouvenirsByTag(tag) {
        // Данный метод должен возвращать все сувениры, в тегах которых есть tag.
        // Кроме того, в ответе должны быть только поля id, name, image, price и rating.
        return this._souvenirs.findAll({
            attributes: ['id', 'name', 'image', 'price', 'rating'],
            include: {
                model: this._tags,
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

        return this._souvenirs.count({
            where: {
                price: {
                    [Op.lte]: price
                },
                rating: {
                    [Op.gte]: rating
                }
            },
            include: {
                attributes: [],
                model: this._countries,
                where: {
                    name: country
                }
            }
        });
    }

    searchSouvenirs(substring) {
        // Данный метод должен возвращать все сувениры, в название которых входит
        // подстрока substring. Поиск должен быть регистронезависимым.
        return this._souvenirs.findAll({
            where: {
                name: {
                    [Op.iLike]: `%${substring}%`
                }
            }
        });
    }

    getDisscusedSouvenirs(n) {
        // Данный метод должен возвращать все сувениры, имеющих >= n отзывов.
        // Кроме того, в ответе должны быть только поля id, name, image, price и rating.
        return this._souvenirs.findAll({
            attributes: ['name', 'image', 'price', 'rating'],
            include: {
                model: this._reviews,
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
        // Данный метод должен удалять все сувениры, которых нет в наличии
        // (то есть amount = 0).

        // Метод должен возвращать количество удаленных сувениров в случае успешного удаления.
        return this._souvenirs.destroy({ where: { amount: 0 } });
    }

    async addReview(souvenirId, { login, text, rating }) {
        // Данный метод должен добавлять отзыв к сувениру souvenirId
        // содержит login, text, rating - из аргументов.
        // Обратите внимание, что при добавлении отзыва рейтинг сувенира должен быть пересчитан,
        // и всё это должно происходить за одну транзакцию (!).
        return this.sequelize.transaction(async transaction => {
            const { id: userId } = await this._users.findOne({ where: { login } });
            const souvenir = await this._souvenirs.findById(souvenirId);

            await souvenir.createReview({
                userId,
                text,
                rating
            },
            { transaction });

            const reviews = await souvenir.getReviews({ transaction });

            return souvenir.update({
                rating: (souvenir.rating * (reviews.length - 1) + rating) / reviews.length
            }, { transaction });
        });
    }

    async getCartSum(login) {
        // Данный метод должен считать общую стоимость корзины пользователя login
        // У пользователя может быть только одна корзина, поэтому это тоже можно отразить
        // в модели.
        return await this._carts.sum('souvenirs.price', {
            group: 'carts.id',
            includeIgnoreAttributes: false,
            include: [this._souvenirs, {
                model: this._users,
                where: { login }
            }]
        });
    }
}

module.exports = Queries;
