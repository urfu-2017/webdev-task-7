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
                attributes: ['id', 'name', 'image', 'price', 'rating']
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
        return this.models.Souvenir.count({
            include: [
                {
                    model: this.models.Country,
                    where: {
                        name: country
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
    async getDisscusedSouvenirs(n) {
        const souvenirsWithReviews = await this.models.Souvenir.findAll(
            {
                include: [
                    { model: this.models.Review }
                ]
            }
        );

        return souvenirsWithReviews.filter(souvenir => souvenir.dataValues.reviews.length >= n);
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

    /**
     * Добавляет отзыв к сувениру souvenirId
     * При добавлении отзыва рейтинг сувенира пересчитывается
     * Всё это происходит за одну транзакцию
     * @param {Number} souvenirId
     * @param {String} login
     * @param {String} text
     * @param {Number} rating
     * @returns {Promise}
     */
    addReview(souvenirId, { login, text, rating }) {
        return this.sequelize.transaction(async t => {
            let user = await this.models.User.findOne({ where: { login } });
            user = user.dataValues;
            await this.models.Review.create(
                { text, rating, souvenirId, userId: user.id },
                { transaction: t }
            );
            let souvenir = await this.models.Souvenir.findById(
                souvenirId,
                {
                    include: [
                        { model: this.models.Review }
                    ]
                }
            );
            const newRating = souvenir.reviews.reduce((accumulator, review) => {
                return accumulator + review.dataValues.rating;
            }, 0) / souvenir.reviews.length;
            souvenir.update(
                { rating: newRating },
                {},
                { transaction: t }
            );
        });
    }

    /**
     * Считает общую стоимость корзины пользователя login
     * @param {String} login
     * @returns {Promise}
     */
    async getCartSum(login) {
        const user = await this.models.User.findOne({ where: { login } });
        const userId = user.dataValues.id;
        let souvenirs = await this.models.Cart.find({
            include: [{ model: this.models.Souvenir }],
            where: { userId }
        });
        souvenirs = souvenirs.dataValues.souvenirs;

        return souvenirs.reduce((accumulator, souvenir) => {
            return accumulator + souvenir.dataValues.price;
        }, 0);
    }
}

module.exports = Queries;
