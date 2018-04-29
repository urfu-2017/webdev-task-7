'use strict';

class Queries {
    constructor(models) {
        this._models = models;
        this._Op = models.sequelize.Op;
        this._sequelize = models.sequelize;
        // Что-нибудь инициализируем в конструкторе
    }

    // Далее идут методы, которые вам необходимо реализовать:

    getAllSouvenirs() {
        // Данный метод должен возвращать все сувениры.

        return this._models.Souvenir.findAll();
    }

    getCheapSouvenirs(price) {
        // Данный метод должен возвращать все сувениры, цена которых меньше или равна price.

        return this._models.Souvenir.findAll({
            where: {
                price: {
                    [this._Op.lte]: price
                }
            }
        });
    }

    getTopRatingSouvenirs(n) {
        // Данный метод должен возвращать топ n сувениров с самым большим рейтингом.

        return this._models.Souvenir.findAll({
            order: [['rating', 'DESC']],
            limit: n
        });
    }

    getSouvenirsByTag(tag) {
        // Данный метод должен возвращать все сувениры, в тегах которых есть tag.
        // Кроме того, в ответе должны быть только поля id, name, image, price и rating.
        return this._models.Souvenir.findAll(
            {
                attributes: ['id', 'name', 'image', 'price', 'rating'],
                include: [
                    {
                        model: this._models.Tag,
                        where: {
                            name: tag
                        },
                        attributes: []
                    }
                ]
            }
        );
    }

    getSouvenirsCount({ country, rating, price }) {
        // Данный метод должен возвращать количество сувениров,
        // из страны country, с рейтингом больше или равной rating,
        // и ценой меньше или равной price.

        // Важно, чтобы метод работал очень быстро,
        // поэтому учтите это при определении моделей (!).
        return this._models.Souvenir.count(
            {
                include: [
                    {
                        model: this._models.Country,
                        where: {
                            name: country
                        }
                    }
                ],
                where: {
                    rating: {
                        [this._Op.gte]: rating
                    },
                    price: {
                        [this._Op.lte]: price
                    }
                }
            }
        );
    }

    searchSouvenirs(substring) {
        // Данный метод должен возвращать все сувениры, в название которых входит
        // подстрока substring. Поиск должен быть регистронезависимым.
        return this._models.Souvenir.findAll({
            where: {
                name: {
                    [this._Op.iLike]: `%${substring}%`
                }
            }
        });
    }

    getDisscusedSouvenirs(n) {
        // Данный метод должен возвращать все сувениры, имеющих >= n отзывов.
        // Кроме того, в ответе должны быть только поля id, name, image, price и rating.
        return this._models.Souvenir.findAll({
            attributes: ['id', 'name', 'image', 'price', 'rating'],
            include: {
                model: this._models.Review,
                attributes: []
            },
            order: ['id'],
            group: 'souvenir.id',
            having: this._sequelize.where(this._Sequelize.fn('COUNT', 'reviews.id'), '>=', n)
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

    addReview(souvenirId, { login, text, rating }) {
        // Данный метод должен добавлять отзыв к сувениру souvenirId
        // содержит login, text, rating - из аргументов.
        // Обратите внимание, что при добавлении отзыва рейтинг сувенира должен быть пересчитан,
        // и всё это должно происходить за одну транзакцию (!).
        const modelUser = this._models.User;
        const modelReview = this._models.Review;
        const modelSouvenir = this._models.Souvenir;

        return this._sequelize.transaction(transaction => {
            return modelUser
                .findOne({
                    where: {
                        login
                    },
                    attributes: ['id'],
                    transaction
                })
                .then(user => {
                    return modelReview.create({
                        text,
                        rating,
                        souvenirId,
                        userId: user.id
                    }, { transaction });
                })
                .then(() => {
                    return modelSouvenir.findOne({
                        where: {
                            id: souvenirId
                        },
                        include: {
                            model: modelReview
                        },
                        transaction
                    });
                })
                .then((souvenir) => {
                    const newRating = (souvenir.rating * souvenir.reviews.length + rating) /
                        (souvenir.reviews.length + 1);
                    souvenir.set({
                        rating: newRating
                    }, { transaction });

                    return souvenir.save({ transaction });
                });
        });
    }

    getCartSum(login) {
        // Данный метод должен считать общую стоимость корзины пользователя login
        // У пользователя может быть только одна корзина, поэтому это тоже можно отразить
        // в модели.
        return this._models.Cart.sum('souvenirs.price', {
            includeIgnoreAttributes: false,
            include: [{
                model: this._models.Souvenir
            }, {
                model: this._models.User,
                where: { login }
            }]
        });
    }
}

module.exports = Queries;
