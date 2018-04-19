'use strict';

const { Op } = require('sequelize');

class Queries {
    constructor(models) {
        // Что-нибудь инициализируем в конструкторе
        this.sequelize = models.sequelize;
        this.Souvenir = models.Souvenir;
        this.Tag = models.Tag;
        this.Country = models.Country;
        this.Review = models.Review;
        this.Cart = models.Cart;
        this.User = models.User;
    }

    // Далее идут методы, которые вам необходимо реализовать:

    getAllSouvenirs() {
        // Данный метод должен возвращать все сувениры.
        return this.Souvenir.findAll({});
    }

    getCheapSouvenirs(price) {
        // Данный метод должен возвращать все сувениры, цена которых меньше или равна price.
        return this.Souvenir.findAll({
            where: {
                price: {
                    [Op.lte]: price
                }
            }
        });
    }

    getTopRatingSouvenirs(n) {
        // Данный метод должен возвращать топ n сувениров с самым большим рейтингом.
        return this.Souvenir.findAll({
            order: [
                ['rating', 'DESC']
            ],
            limit: n
        });
    }

    getSouvenirsByTag(tag) {
        // Данный метод должен возвращать все сувениры, в тегах которых есть tag.
        // Кроме того, в ответе должны быть только поля id, name, image, price и rating.
        return this.Souvenir.findAll({
            attributes: ['id', 'name', 'image', 'price', 'rating'],
            include: [
                {
                    attributes: [],
                    model: this.Tag,
                    where: {
                        name: tag
                    }
                }
            ]
        });
    }

    getSouvenirsCount({ country, rating, price }) {
        // Данный метод должен возвращать количество сувениров,
        // из страны country, с рейтингом больше или равной rating,
        // и ценой меньше или равной price.
        return this.Souvenir.count({
            where: {
                rating: {
                    [Op.gte]: rating
                },
                price: {
                    [Op.lte]: price
                }
            },
            include: [
                {
                    model: this.Country,
                    where: {
                        name: country
                    }
                }
            ]
        });
        // Важно, чтобы метод работал очень быстро,
        // поэтому учтите это при определении моделей (!).
    }

    searchSouvenirs(substring) {
        // Данный метод должен возвращать все сувениры, в название которых входит
        // подстрока substring. Поиск должен быть регистронезависимым.
        return this.Souvenir.findAll({
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
        return this.Souvenir.findAll({
            attributes: ['name', 'image', 'price', 'rating'],
            include: [{
                model: this.Review
            }]
        }).then(souvenirs => {
            return souvenirs.filter(souvenir => souvenir.reviews.length === n);
        });
    }

    deleteOutOfStockSouvenirs() {
        // Данный метод должен удалять все сувениры, которых нет в наличии
        // (то есть amount = 0).
        return this.Souvenir.destroy({
            where: {
                amount: 0
            }
        });
        // Метод должен возвращать количество удаленных сувениров в случае успешного удаления.
    }

    addReview(souvenirId, { login, text, rating }) {
        // Данный метод должен добавлять отзыв к сувениру souvenirId
        // содержит login, text, rating - из аргументов.
        // Обратите внимание, что при добавлении отзыва рейтинг сувенира должен быть пересчитан,
        // и всё это должно происходить за одну транзакцию (!).
        return this.sequelize.transaction((t) => {
            return this.Review.create(
                {
                    text,
                    rating,
                    userId: login,
                    souvenirId
                },
                {
                    transaction: t
                })
                .then(() => this.Review.findAndCountAll(
                    {
                        where: {
                            souvenirId: souvenirId
                        },
                        limit: 0
                    },
                    {
                        transaction: t
                    }))
                .then((num) => this.Souvenir.update(
                    {
                        rating: this.sequelize.literal(`(rating * ${num.count - 1} + ${rating})` +
                        ` / ${num.count}`)
                    },
                    {
                        attributes: {
                            include: [this.sequelize.fn('count', 'reviews'), 'countOfReview']
                        },
                        where: {
                            id: souvenirId
                        },
                        include: [
                            {
                                attributes: [],
                                model: this.Review
                            }
                        ]
                    },
                    {
                        transaction: t
                    }
                ));
        });
    }

    getCartSum(login) {
        // Данный метод должен считать общую стоимость корзины пользователя login
        // У пользователя может быть только одна корзина, поэтому это тоже можно отразить
        // в модели.
        return this.User.findAll({
            where: {
                login: login
            },
            include: [
                {
                    model: this.Cart,
                    include: [
                        {
                            model: this.Souvenir
                        }
                    ]
                }
            ]
        }).then(userWithData => {
            let sum = 0;
            for (let i = 0; i < userWithData[0].dataValues.cart.dataValues.souvenirs.length; i++) {
                sum += userWithData[0].dataValues.cart.dataValues.souvenirs[i].price;
            }

            return sum;
        });
    }
}

module.exports = Queries;
