'use strict';

const Sequelize = require('sequelize');
const Op = Sequelize.Op;

class Queries {
    constructor(models) {
        this._models = models;
    }

    getAllSouvenirs() {
        return this._models.Souvenir.findAll({});
    }

    getCheapSouvenirs(price) {
        return this._models.Souvenir.findAll({
            where: {
                price: {
                    [Op.lte]: price
                }
            }
        });
        // Данный метод должен возвращать все сувениры, цена которых меньше или равна price.
    }

    getTopRatingSouvenirs(n) {
        return this._models.Souvenir.findAll({
            order: [['rating', 'DESC']],
            limit: n
        });
        // Данный метод должен возвращать топ n сувениров с самым большим рейтингом.
    }

    getSouvenirsByTag(tag) {
        return this._models.Souvenir.findAll({
            include: {
                model: this._models.Tag,
                where: {
                    name: tag
                },
                attributes: []
            },
            attributes: ['id', 'name', 'image', 'price', 'rating']
        });
        // Данный метод должен возвращать все сувениры, в тегах которых есть tag.
        // Кроме того, в ответе должны быть только поля id, name, image, price и rating.
    }

    getSouvenirsCount({ country, rating, price }) {
        return this._models.Souvenir.count({
            include: {
                model: this._models.Country,
                where: {
                    name: country
                }
            },
            where: {
                rating: {
                    [Op.gte]: rating
                },
                price: {
                    [Op.lte]: price
                }
            }
        });
        // Данный метод должен возвращать количество сувениров,
        // из страны country, с рейтингом больше или равной rating,
        // и ценой меньше или равной price.

        // Важно, чтобы метод работал очень быстро,
        // поэтому учтите это при определении моделей (!).
    }

    searchSouvenirs(substring) {
        return this._models.Souvenir.findAll({
            where: {
                name: {
                    [Op.iLike]: `%${substring}%`
                }
            }
        });
        // Данный метод должен возвращать все сувениры, в название которых входит
        // подстрока substring. Поиск должен быть регистронезависимым.
    }

    async getDisscusedSouvenirs(n) {
        return this._models.Souvenir.findAll({
            attributes: ['name', 'image', 'price', 'rating'],
            include: {
                model: this._models.Review,
                attributes: []
            },
            order: ['id'],
            group: 'souvenir.id',
            having: this._models.sequelize.where(
                this._models.sequelize.fn('COUNT', 'reviews.id'), {
                    [Op.gte]: n
                }
            )
        });
        // Данный метод должен возвращать все сувениры, имеющих >= n отзывов.
        // Кроме того, в ответе должны быть только поля id, name, image, price и rating.
    }

    deleteOutOfStockSouvenirs() {
        // Данный метод должен удалять все сувениры, которых нет в наличии
        // (то есть amount = 0).
        return this._models.Souvenir.destroy({
            where: {
                amount: 0
            }
        });
        // Метод должен возвращать количество удаленных сувениров в случае успешного удаления.
    }

    addReview(souvenirId, { login, text, rating }) {
        return this._models.sequelize.transaction(async tr => {
            const user = await this._models.User.findOne({
                where: { login },
                transaction: tr
            });

            await this._models.Review.create({
                text,
                rating,
                souvenirId,
                userId: user.id
            });

            const reviews = await this._models.Review.findAll({
                where: { souvenirId },
                attributes: ['rating'],
                transaction: tr
            });

            const souvenir = await this._models.Souvenir.findById(souvenirId, { transaction: tr });

            souvenir.rating = reviews.map(review => review.rating)
                .reduce((sum, current) => sum + current, 0) / reviews.length;

            return souvenir.save({ transaction: tr });
        });
        // Данный метод должен добавлять отзыв к сувениру souvenirId
        // содержит login, text, rating - из аргументов.
        // Обратите внимание, что при добавлении отзыва рейтинг сувенира должен быть пересчитан,
        // и всё это должно происходить за одну транзакцию (!).
    }

    async getCartSum(login) {
        return this._models.Cart.sum('souvenirs.price', {
            includeIgnoreAttributes: false,
            include: [
                {
                    model: this._models.User,
                    where: { login },
                    attributes: []
                },
                {
                    model: this._models.Souvenir,
                    attributes: []
                }
            ]
        });
        // Данный метод должен считать общую стоимость корзины пользователя login
        // У пользователя может быть только одна корзина, поэтому это тоже можно отразить
        // в модели.
    }
}

module.exports = Queries;
