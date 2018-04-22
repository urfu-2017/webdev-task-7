'use strict';

class Queries {
    constructor(models) {
        const { Country, Tag, Review, Souvenir, Cart, User } = models;

        this.Country = Country;
        this.Tag = Tag;
        this.Review = Review;
        this.Souvenir = Souvenir;
        this.Cart = Cart;
        this.User = User;
        this.sequelize = models.sequelize;
    }

    // Далее идут методы, которые вам необходимо реализовать:

    getAllSouvenirs() {
        return this.Souvenir.findAll();
    }

    getCheapSouvenirs(price) {
        // Данный метод должен возвращать все сувениры, цена которых меньше или равна price.
        const Op = this.sequelize.Op;

        return this.Souvenir.findAll({
            where: {
                price: { [Op.lte]: price }
            }
        });
    }

    getTopRatingSouvenirs(n) {
        // Данный метод должен возвращать топ n сувениров с самым большим рейтингом.

        return this.Souvenir.findAll({ order: [['rating', 'DESC']], limit: n });
    }

    getSouvenirsByTag(tag) {
        // Данный метод должен возвращать все сувениры, в тегах которых есть tag.
        // Кроме того, в ответе должны быть только поля id, name, image, price и rating.

        return this.sequelize.query(`
            SELECT souvenirs.id, souvenirs.name, souvenirs.image, souvenirs.price, souvenirs.rating
            FROM souvenir_tags
            JOIN souvenirs on souvenirs.id=souvenir_tags."souvenirId"
            JOIN tags on tags.id=souvenir_tags."tagId"
            WHERE tags.name = '${tag}'
            `).then(result => result[0]);
    }

    getSouvenirsCount({ country, rating, price }) {
        // Данный метод должен возвращать количество сувениров,
        // из страны country, с рейтингом больше или равной rating,
        // и ценой меньше или равной price.

        // Важно, чтобы метод работал очень быстро,
        // поэтому учтите это при определении моделей (!).
        const Op = this.sequelize.Op;

        return this.Souvenir.findAll({
            where: {
                rating: {
                    [Op.gte]: rating
                },
                price: {
                    [Op.lte]: price
                }
            },
            include: [{
                model: this.Country,
                where: {
                    name: { [Op.eq]: country }
                }
            }]
        });
    }

    searchSouvenirs(substring) {
        // Данный метод должен возвращать все сувениры, в название которых входит
        // подстрока substring. Поиск должен быть регистронезависимым.
        const Op = this.sequelize.Op;

        return this.Souvenir.findAll({
            where: {
                name: {
                    [Op.iLike]: `%${substring}%`
                }
            }
        });
    }

    getDisscusedSouvenirs(n) {
        // Данный метод должен возвращать все сувениры, имеющих >= n отзывов.
        // Кроме того, в ответе должны быть только поля name, image, price и rating.

        return this.sequelize.query(`
            SELECT name, image, price, rating FROM
            (SELECT souvenirs.name, souvenirs.image, souvenirs.price, souvenirs.rating, count(*)
            FROM souvenirs
            JOIN reviews ON souvenirs.id=reviews."souvenirId"
            GROUP BY souvenirs.name, souvenirs.image, souvenirs.price, souvenirs.rating) as result
            WHERE count >= ${n}
            `).then(result => result[0]);
    }

    deleteOutOfStockSouvenirs() {
        // Данный метод должен удалять все сувениры, которых нет в наличии
        // (то есть amount = 0).

        // Метод должен возвращать количество удаленных сувениров в случае успешного удаления.
    }

    addReview(souvenirId, { login, text, rating }) {
        // Данный метод должен добавлять отзыв к сувениру souvenirId
        // содержит login, text, rating - из аргументов.
        // Обратите внимание, что при добавлении отзыва рейтинг сувенира должен быть пересчитан,
        // и всё это должно происходить за одну транзакцию (!).
    }

    getCartSum(login) {
        // Данный метод должен считать общую стоимость корзины пользователя login
        // У пользователя может быть только одна корзина, поэтому это тоже можно отразить
        // в модели.
    }
}

module.exports = Queries;
