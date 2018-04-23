'use strict';

class Queries {
    constructor(models) {
        this.sequelize = models.sequelize;
        this.op = models.sequelize.Op;
        this.country = models.Country;
        this.tag = models.Tag;
        this.review = models.Review;
        this.souvenir = models.Souvenir;
        this.cart = models.Cart;
        this.user = models.User;
    }

    // Далее идут методы, которые вам необходимо реализовать:

    getAllSouvenirs() {
        // Данный метод должен возвращать все сувениры.
        return this.souvenir.findAll();
    }

    getCheapSouvenirs(price) {
        // Данный метод должен возвращать все сувениры, цена которых меньше или равна price.
        return this.souvenir.findAll({
            where: { price: { [this.op.lte]: price } }
        });
    }

    getTopRatingSouvenirs(n) {
        // Данный метод должен возвращать топ n сувениров с самым большим рейтингом.
        return this.souvenir.findAll(
            {
                order: [['rating', 'DESC']],
                limit: n
            }
        );
    }

    getSouvenirsByTag(tag) {
        // Данный метод должен возвращать все сувениры, в тегах которых есть tag.
        // Кроме того, в ответе должны быть только поля id, name, image, price и rating.
        return this.souvenir.findAll(
            {
                attributes: ['id', 'name', 'image', 'price', 'rating'],
                include: [{
                    model: this.tag,
                    where: { name: tag }
                }]
            }
        );
    }

    getSouvenirsCount({ country, rating, price }) {
        // Данный метод должен возвращать количество сувениров,
        // из страны country, с рейтингом больше или равной rating,
        // и ценой меньше или равной price.

        // Важно, чтобы метод работал очень быстро,
        // поэтому учтите это при определении моделей (!).
        return this.souvenir.count({
            include: {
                model: this.country,
                where: { name: country }
            },
            where: {
                rating: { [this.op.gte]: rating },
                price: { [this.op.lte]: price }
            }
        });
    }

    searchSouvenirs(substring) {
        // Данный метод должен возвращать все сувениры, в название которых входит
        // подстрока substring. Поиск должен быть регистронезависимым.
        return this.souvenir.findAll({
            where: { name: { [this.op.iLike]: `%${substring}%` } },
            attributes: ['id', 'name']
        });
    }

    getDisscusedSouvenirs(n) {
        // Данный метод должен возвращать все сувениры, имеющих >= n отзывов.
        // Кроме того, в ответе должны быть только поля id, name, image, price и rating.
        return this.souvenir.findAll({
            attributes: ['name', 'image', 'price', 'rating'],
            include: [{
                model: this.review
            }]
        }).then(souvenirs => souvenirs.filter(elem => elem.reviews.length >= n));
    }

    deleteOutOfStockSouvenirs() {
        // Данный метод должен удалять все сувениры, которых нет в наличии
        // (то есть amount = 0).

        // Метод должен возвращать количество удаленных сувениров в случае успешного удаления.
        return this.souvenir.destroy({
            where: {
                amount: 0
            }
        });
    }

    addReview(souvenirId, { login, text, rating }) {
        // Данный метод должен добавлять отзыв к сувениру souvenirId
        // содержит login, text, rating - из аргументов.
        // Обратите внимание, что при добавлении отзыва рейтинг сувенира должен быть пересчитан,
        // и всё это должно происходить за одну транзакцию (!).
        return { login, text, rating };
    }

    getCartSum(login) {
        // Данный метод должен считать общую стоимость корзины пользователя login
        // У пользователя может быть только одна корзина, поэтому это тоже можно отразить
        // в модели.
        return this.cart.findOne({
            include: [
                { model: this.souvenir },
                { model: this.user, where: { login } }
            ]
        }).then(cart => {
            let sum = 0;
            for (let i = 0; i < cart.souvenirs.length; i++) {
                sum += cart.souvenirs[i].price;
            }

            return sum;
        });
    }
}

module.exports = Queries;
