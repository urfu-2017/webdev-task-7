'use strict';
const Op = require('sequelize').Op;

class Queries {
    constructor(models) {
        // Что-нибудь инициализируем в конструкторе
        this._models = models;
        this._sequelize = models.sequelize;
    }

    // Далее идут методы, которые вам необходимо реализовать:

    getAllSouvenirs() {
        // Данный метод должен возвращать все сувениры.
        return this._models.Souvenir.findAll();
    }

    getCheapSouvenirs(price) {
        // Данный метод должен возвращать все сувениры, цена которых меньше или равна price.
        return this._models.Souvenir.findAll({
            where: {
                price: {
                    [Op.lte]: price
                }
            }
        });
    }

    getTopRatingSouvenirs(n) {
        // Данный метод должен возвращать топ n сувениров с самым большим рейтингом.
        return this._models.Souvenir.findAll({
            order: [
                ['rating', 'DESC']
            ],
            limit: n
        });
    }

    getSouvenirsByTag(tag) {
        // Данный метод должен возвращать все сувениры, в тегах которых есть tag.
        // Кроме того, в ответе должны быть только поля id, name, image, price и rating.
        return this._models.Souvenir.findAll({
            attributes: ['id', 'name', 'image', 'price', 'rating'],
            include: {
                model: this._models.Tag,
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
        return this._models.Souvenir.count({
            where: {
                rating: {
                    [Op.gte]: rating
                },
                price: {
                    [Op.lte]: price
                }
            },
            include: {
                model: this._models.Country,
                where: { name: country }
            }
        });
    }

    searchSouvenirs(substring) {
        // Данный метод должен возвращать все сувениры, в название которых входит
        // подстрока substring. Поиск должен быть регистронезависимым.
        return this._models.Souvenir.findAll({
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
        return this._models.Souvenir.findAll({
            attributes: ['name', 'image', 'price', 'rating'],
            include: {
                model: this._models.Review,
                attributes: []
            },
            order: ['id'],
            group: ['souvenir.id'],
            having: this._sequelize.where(
                this._sequelize.fn('COUNT', this._sequelize.col('reviews.id')), '>=', n
            )
        });
    }

    deleteOutOfStockSouvenirs() {
        // Данный метод должен удалять все сувениры, которых нет в наличии
        // (то есть amount = 0).

        // Метод должен возвращать количество удаленных сувениров в случае успешного удаления.
        return this._models.Souvenir.destroy({ where: { amount: 0 } });
    }

    async addReview(souvenirId, { login, text, rating }) {
        // Данный метод должен добавлять отзыв к сувениру souvenirId
        // содержит login, text, rating - из аргументов.
        // Обратите внимание, что при добавлении отзыва рейтинг сувенира должен быть пересчитан,
        // и всё это должно происходить за одну транзакцию (!).
        const user = await this._models.User.findOne({
            where: { login }
        });
        const souvenir = await this._models.Souvenir.findOne({
            where: {
                id: souvenirId
            },
            include: {
                model: this._models.Review
            }
        });

        return this._sequelize.transaction(async (t) => {
            await souvenir.createReview({
                userId: user.id,
                isApproved: false,
                text,
                rating
            }, {
                transaction: t
            });
            const reviews = await souvenir.getReviews({
                transaction: t
            });
            rating = (souvenir.rating * (reviews.length - 1) + rating) / reviews.length;
            await souvenir.update({
                rating
            }, {
                transaction: t
            });
        });
    }

    getCartSum(login) {
        // Данный метод должен считать общую стоимость корзины пользователя login
        // У пользователя может быть только одна корзина, поэтому это тоже можно отразить
        // в модели.
        return this._models.Cart.sum('souvenirs.price', {
            group: ['cart.id'],
            includeIgnoreAttributes: false,
            include: [{
                model: this._models.Souvenir,
                attributes: []
            },
            {
                model: this._models.User,
                where: {
                    login
                },
                attributes: []
            }]
        });
    }
}

module.exports = Queries;
