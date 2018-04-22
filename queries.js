'use strict';

class Queries {
    constructor(models) {
        this.models = models;
        this.Op = models.sequelize.Op;
    }

    /**
     * Возвращает все сувениры.
     * @returns {Promise}
     */
    getAllSouvenirs() {
        return makePlain(this.models.Souvenir.findAll());
    }

    /**
     * Возвращает все сувениры, цена которых меньше или равна price.
     * @param {Number} price
     * @returns {Promise}
     */
    getCheapSouvenirs(price) {
        return makePlain(this.models.SouvenirTag.findAll(
            {
                include: [
                    {
                        model: this.models.Souvenir,
                        where: {
                            price: {
                                [this.Op.lte]: price
                            }
                        }
                    },
                    { model: this.models.Tag }
                ],
                attributes: { exclude: ['souvenirId', 'tagId'] }
            }
        ));
    }

    /**
     * Возвращает топ n сувениров с самым большим рейтингом.
     * @param {Number} n
     * @returns {Promise}
     */
    getTopRatingSouvenirs(n) {
        return makePlain(this.models.SouvenirTag.findAll(
            {
                include: [
                    { model: this.models.Souvenir },
                    { model: this.models.Tag }
                ],
                attributes: { exclude: ['souvenirId', 'tagId'] },
                order: [[this.models.Souvenir, 'rating', 'DESC']],
                limit: n
            }
        ));
    }

    // /**
    //  * Возвращает все сувениры, в тегах которых есть tag.
    //  * В ответе только поля id, name, image, price и rating.
    //  * @param {String} tag
    //  * @returns {Promise}
    //  */
    getSouvenirsByTag(tag) {
        return tag;
        // return makePlain(this.models.SouvenirTag.findAll(
        //     {
        //         include: [
        //             { model: this.models.Souvenir },
        //             {
        //                 model: this.models.Tag,
        //                 where: {
        //
        //                 }
        //             }
        //         ],
        //         attributes: { exclude: ['souvenirId', 'tagId'] }
        //     }
        // ));
    }

    getSouvenirsCount({ country, rating, price }) {
        return { country, rating, price };
        // Данный метод должен возвращать количество сувениров,
        // из страны country, с рейтингом больше или равной rating,
        // и ценой меньше или равной price.

        // Важно, чтобы метод работал очень быстро,
        // поэтому учтите это при определении моделей (!).
    }

    searchSouvenirs(substring) {
        return substring;
        // Данный метод должен возвращать все сувениры, в название которых входит
        // подстрока substring. Поиск должен быть регистронезависимым.
    }

    getDisscusedSouvenirs(n) {
        return n;
        // Данный метод должен возвращать все сувениры, имеющих >= n отзывов.
        // Кроме того, в ответе должны быть только поля name, image, price и rating.
    }

    deleteOutOfStockSouvenirs() {
        // Данный метод должен удалять все сувениры, которых нет в наличии
        // (то есть amount = 0).

        // Метод должен возвращать количество удаленных сувениров в случае успешного удаления.
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

/**
 * @param {Promise} response
 * @returns {Promise}
 */
async function makePlain(response) {
    return (await response).map(el => el.get({ plain: true }));
}

module.exports = Queries;
