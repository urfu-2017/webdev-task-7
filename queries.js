'use strict';

class Queries {
    constructor(models) {
        this.sequelize = models.sequelize;
        this.op = models.sequelize.Op;
        this.cart = models.Cart;
        this.country = models.Country;
        this.review = models.Review;
        this.souvenir = models.Souvenir;
        this.tag = models.Tag;
        this.user = models.User;
    }

    // Далее идут методы, которые вам необходимо реализовать:

    getAllSouvenirs() {
        return this.souvenir.findAll();
    }

    getCheapSouvenirs(price) {
        return this.souvenir.findAll({
            where: { price: { [this.op.lte]: price } }
        });
    }

    getTopRatingSouvenirs(n) {
        return this.souvenir.findAll({
            order: [['rating', 'DESC']],
            limit: n
        });
    }

    getSouvenirsByTag(tag) {
        return this.souvenir.findAll({
            attributes: ['id', 'name', 'image', 'price', 'rating'],
            include: {
                model: this.tag,
                where: { name: tag },
                attributes: []
            }
        });
    }

    // getSouvenirsCount({ country, rating, price }) {
    //     // Данный метод должен возвращать количество сувениров,
    //     // из страны country, с рейтингом больше или равной rating,
    //     // и ценой меньше или равной price.
    //
    //     // Важно, чтобы метод работал очень быстро,
    //     // поэтому учтите это при определении моделей (!).
    // }

    searchSouvenirs(substring) {
        return this.souvenir.findAll({
            where: { name: { [this.op.iLike]: `%${substring}%` } }
        });
    }

    // getDisscusedSouvenirs(n) {
    //     // Данный метод должен возвращать все сувениры, имеющих >= n отзывов.
    //     // Кроме того, в ответе должны быть только поля id, name, image, price и rating.
    // }
    //
    // deleteOutOfStockSouvenirs() {
    //     // Данный метод должен удалять все сувениры, которых нет в наличии
    //     // (то есть amount = 0).
    //
    //     // Метод должен возвращать количество удаленных сувениров в случае успешного удаления.
    // }
    //
    // addReview(souvenirId, { login, text, rating }) {
    //     // Данный метод должен добавлять отзыв к сувениру souvenirId
    //     // содержит login, text, rating - из аргументов.
    //     // Обратите внимание, что при добавлении отзыва рейтинг сувенира должен быть пересчитан,
    //     // и всё это должно происходить за одну транзакцию (!).
    // }
    //
    // getCartSum(login) {
    //     // Данный метод должен считать общую стоимость корзины пользователя login
    //     // У пользователя может быть только одна корзина, поэтому это тоже можно отразить
    //     // в модели.
    // }
}

module.exports = Queries;
