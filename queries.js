'use strict';

const Sequelize = require('sequelize');
const Op = Sequelize.Op;


class Queries {
    constructor(models) {
        this.models = models;
    }

    getAllSouvenirs() {
        // Данный метод должен возвращать все сувениры.
        return this.models.Souvenir.findAll();
    }

    getCheapSouvenirs(price) {
        // Данный метод должен возвращать все сувениры, цена которых меньше или равна price.
        return this.models.Souvenir.findAll({
            where: {
                price: {
                    [Op.lte]: price
                }
            }
        });
    }

    getTopRatingSouvenirs(n) {
        // Данный метод должен возвращать топ n сувениров с самым большим рейтингом.
        return this.models.Souvenir.findAll({
            order: [['rating', 'DESC']],
            limit: n
        });
    }

    getSouvenirsByTag(tag) {
        // Данный метод должен возвращать все сувениры, в тегах которых есть tag.
        // Кроме того, в ответе должны быть только поля id, name, image, price и rating.
        return this.models.Souvenir.findAll({
            attributes: ['id', 'name', 'image', 'price', 'rating'],
            include: [{
                model: this.models.Tag,
                where: {
                    name: tag
                },
                attributes: []
            }]
        });
    }

    getSouvenirsCount({ country, rating, price }) {
        // Данный метод должен возвращать количество сувениров,
        // из страны country, с рейтингом больше или равной rating,
        // и ценой меньше или равной price.

        // Важно, чтобы метод работал очень быстро,
        // поэтому учтите это при определении моделей (!).
        return this.models.Souvenir.count({
            include: [{
                model: this.models.Country,
                where: {
                    name: country
                }
            }],
            where: {
                rating: {
                    [Op.gte]: rating
                },
                price: {
                    [Op.lte]: price
                }
            }
        });
    }

    searchSouvenirs(substring) {
        // Данный метод должен возвращать все сувениры, в название которых входит
        // подстрока substring. Поиск должен быть регистронезависимым.
        return this.models.Souvenir.findAll({
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
        return this.models.Souvenir.findAll({
            attributes: ['name', 'image', 'price', 'rating'],
            include: {
                model: this.models.Review,
                attributes: []
            },
            order: ['id'],
            group: 'souvenirs.id',
            having: Sequelize.where(Sequelize.fn('COUNT', 'reviews.id'), '>=', n)
        });
    }

    deleteOutOfStockSouvenirs() {
        // Данный метод должен удалять все сувениры, которых нет в наличии
        // (то есть amount = 0).
        // Метод должен возвращать количество удаленных сувениров в случае успешного удаления.
        return this.models.Souvenir.destroy({
            where: {
                amount: 0
            }
        });
    }

    async addReview(souvenirId, { login, text, rating }) {
        // Данный метод должен добавлять отзыв к сувениру souvenirId
        // содержит login, text, rating - из аргументов.
        // Обратите внимание, что при добавлении отзыва рейтинг сувенира должен быть пересчитан,
        // и всё это должно происходить за одну транзакцию (!).

        const user = await this.models.User.findOne({ where: { login } });
        const souvenir = await this.models.Souvenir.findById(souvenirId);

        await this.models.sequelize.transaction(async transaction => {
            await souvenir.createReview({
                text, rating, souvenirId, userId: user.id
            }, { transaction });

            const reviewsCount = (await souvenir.getReviews()).length;
            const newRating = (souvenir.rating * reviewsCount + rating) / (reviewsCount + 1);
            souvenir.rating = newRating;

            return souvenir.save({ transaction });
        });
    }

    async getCartSum(login) {
        // Данный метод должен считать общую стоимость корзины пользователя login
        // У пользователя может быть только одна корзина, поэтому это тоже можно отразить
        // в модели.
        return this.models.Cart.sum('souvenirs.price', {
            includeIgnoreAttributes: false,
            include: [
                { model: this.models.Souvenir },
                { model: this.models.User, where: { login } }
            ],
            group: 'carts.id'
        });
    }
}

module.exports = Queries;
