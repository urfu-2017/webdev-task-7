'use strict';

const Sequelize = require('sequelize');
const Op = Sequelize.Op;

class Queries {
    constructor(models) {
        // Что-нибудь инициализируем в конструкторе
        this.sequelize = models.sequelize;
        this.souvenir = models.Souvenir;
        this.tag = models.Tag;
        this.country = models.Country;
        this.review = models.Review;
        this.cart = models.Cart;
        this.user = models.User;
    }

    // Далее идут методы, которые вам необходимо реализовать:

    getAllSouvenirs() {
        // Данный метод должен возвращать все сувениры.
        return this.souvenir.findAll({});
    }

    getCheapSouvenirs(price) {
        // Данный метод должен возвращать все сувениры, цена которых меньше или равна price.
        return this.souvenir.findAll({
            where: {
                price: {
                    [Op.lte]: price
                }
            }
        });
    }

    getTopRatingSouvenirs(n) {
        // Данный метод должен возвращать топ n сувениров с самым большим рейтингом.
        return this.souvenir.findAll({
            order: [
                ['rating', 'DESC']
            ],
            limit: n
        });
    }

    getSouvenirsByTag(tag) {
        // Данный метод должен возвращать все сувениры, в тегах которых есть tag.
        // Кроме того, в ответе должны быть только поля id, name, image, price и rating.
        return this.souvenir.findAll({
            include: [{
                model: this.tag,
                where: {
                    name: tag
                },
                attributes: []
            }],
            attributes: ['id', 'name', 'image', 'price', 'rating']
        });
    }

    getSouvenirsCount({ country, rating, price }) {
        // Данный метод должен возвращать количество сувениров,
        // из страны country, с рейтингом больше или равной rating,
        // и ценой меньше или равной price.
        return this.souvenir.count({
            where: {
                price: {
                    [Op.lte]: price
                },
                rating: {
                    [Op.gte]: rating
                }
            },
            include: [{
                model: this.country,
                where: {
                    name: country
                },
                attributes: []
            }]
        });
        // Важно, чтобы метод работал очень быстро,
        // поэтому учтите это при определении моделей (!).
    }

    searchSouvenirs(substring) {
        // Данный метод должен возвращать все сувениры, в название которых входит
        // подстрока substring. Поиск должен быть регистронезависимым.
        return this.souvenir.findAll({
            where: {
                name: {
                    [Op.iRegexp]: substring
                }
            }
        });
    }

    getDisscusedSouvenirs(n) {
        // Данный метод должен возвращать все сувениры, имеющих >= n отзывов.
        // Кроме того, в ответе должны быть только поля name, image, price и rating.
        return this.souvenir.findAll({
            attributes: ['name', 'image', 'price', 'rating'],
            include: {
                model: this.review,
                attributes: []
            },
            group: 'souvenirs.id',
            having: this.sequelize.where(
                this.sequelize.fn('COUNT', 'reviews.id'), '>=', n
            )
        });
    }

    deleteOutOfStockSouvenirs() {
        // Данный метод должен удалять все сувениры, которых нет в наличии
        // (то есть amount = 0).
        return this.souvenir.destroy({
            where: {
                amount: 0
            }
        }).then((result) => {
            return result;
        });
        // Метод должен возвращать количество удаленных сувениров в случае успешного удаления.
    }

    async addReview(souvenirId, { login, text, rating }) {
        // Данный метод должен добавлять отзыв к сувениру souvenirId
        // содержит login, text, rating - из аргументов.
        // Обратите внимание, что при добавлении отзыва рейтинг сувенира должен быть пересчитан,
        // и всё это должно происходить за одну транзакцию (!).
        return this.sequelize.transaction(async trans => {
            const user = await this.user.findOne({ where: { login: login } });
            const userId = user.id;
            const souvenir = await this.souvenir.findById(souvenirId);
            const reviewsCountOld = await this.review.count({ where: { souvenirId } });

            const ratingNew = (souvenir.rating * reviewsCountOld + rating) / (reviewsCountOld + 1);

            await this.souvenir.update({
                rating: ratingNew
            }, {
                where: { id: souvenirId },
                transaction: trans
            });

            await this.review.create({ souvenirId, userId, text, rating }, { transaction: trans });
        });

        // return this.sequelize.transaction(async trans => {
        //     const review = { userId: user.id, text, rating };
        //     await souvenir.createReview(review, { transaction: trans });
        //     const reviews = await souvenir.getReviews({ transaction: trans });
        //     rating = (souvenir.rating * (reviews.length - 1) + rating) / (reviews.length);
        //     await souvenir.update({ rating }, { transaction: trans });
        // });
    }

    getCartSum(login) {
        // Данный метод должен считать общую стоимость корзины пользователя login
        // У пользователя может быть только одна корзина, поэтому это тоже можно отразить
        // в модели.
        return this.cart.sum('souvenirs.price', {
            group: 'carts.id',
            includeIgnoreAttributes: false,
            include: [
                {
                    model: this.souvenir
                },
                {
                    model: this.user,
                    where: {
                        login: login
                    }
                }
            ]
        });
    }
}

module.exports = Queries;
