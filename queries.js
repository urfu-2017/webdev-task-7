'use strict';

class Queries {
    constructor(models) {
        this.models = models;
        this.sequelize = models.sequelize;
        this.Op = models.sequelize.Op;
    }

    /**
     * Возвращает все сувениры.
     * @returns {Promise}
     */
    getAllSouvenirs() {
        return this.models.Souvenir.findAll();
    }

    /**
     * Возвращает все сувениры, цена которых меньше или равна price.
     * @param {Number} price
     * @returns {Promise}
     */
    getCheapSouvenirs(price) {
        return this.models.Souvenir.findAll(
            {
                where: {
                    price: {
                        [this.Op.lte]: price
                    }
                }
            }
        );
    }

    /**
     * Возвращает топ n сувениров с самым большим рейтингом.
     * @param {Number} n
     * @returns {Promise}
     */
    getTopRatingSouvenirs(n) {
        return this.models.Souvenir.findAll(
            {
                order: [['rating', 'DESC']],
                limit: n
            }
        );
    }

    /**
     * Возвращает все сувениры, в тегах которых есть tag.
     * В ответе только поля id, name, image, price и rating.
     * @param {String} tag
     * @returns {Promise}
     */
    getSouvenirsByTag(tag) {
        return this.models.Souvenir.findAll(
            {
                include: [
                    {
                        model: this.models.Tag,
                        where: {
                            name: {
                                [this.Op.eq]: tag
                            }
                        },
                        attributes: []
                    }
                ],
                attributes: {
                    include: ['id', 'name', 'image', 'price', 'rating'],
                    exclude: ['amount', 'isRecent', 'countryId', 'createdAt', 'updatedAt', 'tags']
                }
            }
        );
    }

    /**
     * Возвращает количество сувениров, из страны country, с рейтингом больше или равной rating,
     * и ценой меньше или равной price.
     * @param {String} country
     * @param {Number} rating
     * @param {Number} price
     * @returns {Promise}
     */
    getSouvenirsCount({ country, rating, price }) {
        return this.models.Souvenir.findAndCountAll({
            include: [
                {
                    model: this.models.Country,
                    where: {
                        name: {
                            [this.Op.eq]: country
                        }
                    }
                }
            ],
            where: {
                rating: {
                    [this.Op.gte]: rating
                },
                price: {
                    [this.Op.lte]: price
                }
            }
        });
    }

    /**
     * Возвращает все сувениры, в название которых входит подстрока substring.
     * Поиск регистронезависимый.
     * @param {String} substring
     * @returns {Promise}
     */
    searchSouvenirs(substring) {
        return this.models.Souvenir.findAll(
            {
                where: {
                    name: {
                        [this.Op.iRegexp]: `${substring}`
                    }
                }
            }
        );
    }

    /**
     * Возвращает все сувениры, имеющих >= n отзывов.
     * В ответе только поля name, image, price и rating.
     * @param {Number} n
     * @returns {Promise}
     */
    getDisscusedSouvenirs(n) {
        return this.models.Souvenir.findAll(
            {
                include: [
                    {
                        model: this.models.Review,
                        attributes: {
                            all: true
                        }
                    }
                ],
                where: {
                    [this.sequelize.fn('array_length', this.sequelize.col('reviews'), 1)]: {
                        [this.Op.gte]: n
                    }
                }
            }
        );
    }

    /**
     * Удаляет все сувениры, которых нет в наличии (то есть amount = 0).
     * Возвращать количество удаленных сувениров в случае успешного удаления.
     * @returns {Promise}
     */
    deleteOutOfStockSouvenirs() {
        return this.models.Souvenir.destroy({
            where: {
                amount: 0
            }
        });
    }

    addReview(souvenirId, { login, text, rating }) {
        return [souvenirId, { login, text, rating }];
        // Данный метод должен добавлять отзыв к сувениру souvenirId
        // содержит login, text, rating - из аргументов.
        // Обратите внимание, что при добавлении отзыва рейтинг сувенира должен быть пересчитан,
        // и всё это должно происходить за одну транзакцию (!).
    }

    getCartSum(login) {
        return login;
        // Данный метод должен считать общую стоимость корзины пользователя login
        // У пользователя может быть только одна корзина, поэтому это тоже можно отразить
        // в модели.
    }
}

module.exports = Queries;
