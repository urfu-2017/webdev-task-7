'use strict';

class Queries {
    constructor({ Souvenir, Cart, User, Country, Tag, Review, sequelize }) {
        this.Souvenir = Souvenir;
        this.Cart = Cart;
        this.User = User;
        this.Tag = Tag;
        this.Review = Review;
        this.Country = Country;
        this.sequelize = sequelize;
    }

    // Данный метод должен возвращать все сувениры.
    getAllSouvenirs() {
        return this.Souvenir.findAll();
    }

    // Данный метод должен возвращать все сувениры, цена которых меньше или равна price.
    getCheapSouvenirs(price) {
        return this.Souvenir
            .findAll({
                where: {
                    price: {
                        [this.sequelize.Op.lte]: price
                    }
                }
            });
    }

    // Данный метод должен возвращать топ n сувениров с самым большим рейтингом.
    getTopRatingSouvenirs(limit) {
        return this.Souvenir.findAll({ limit, order: [['rating', 'DESC']] });
    }

    // Данный метод должен возвращать все сувениры, в тегах которых есть tag.
    // Кроме того, в ответе должны быть только поля id, name, image, price и rating.
    getSouvenirsByTag(name) {
        return this.Souvenir.findAll({
            attributes: ['id', 'name', 'image', 'price', 'rating'],
            include: {
                model: this.Tag,
                where: { name },
                attributes: []
            }
        });
    }

    // Данный метод должен возвращать количество сувениров,
    // из страны country, с рейтингом больше или равной rating,
    // и ценой меньше или равной price.

    // Важно, чтобы метод работал очень быстро,
    // поэтому учтите это при определении моделей (!).
    getSouvenirsCount({ country, rating, price }) {
        return this.Souvenir.count({
            where: {
                price: {
                    [this.sequelize.Op.lte]: price
                },
                rating: {
                    [this.sequelize.Op.gte]: rating
                }
            },
            include: {
                attributes: [],
                model: this.Country,
                where: {
                    name: country
                }
            }
        });
    }

    // Данный метод должен возвращать все сувениры, в название которых входит
    // подстрока substring. Поиск должен быть регистронезависимым.
    searchSouvenirs(substring) {
        return this.Souvenir.findAll({
            where: {
                name: {
                    [this.sequelize.Op.iLike]: `%${substring}%`
                }
            }
        });
    }

    // Данный метод должен возвращать все сувениры, имеющих >= n отзывов.
    // Кроме того, в ответе должны быть только поля id, name, image, price и rating.
    getDisscusedSouvenirs(n) {
        return this.Souvenir.findAll({
            include: {
                model: this.Review,
                attributes: []
            },
            order: ['id'],
            group: 'souvenirs.id',
            attributes: ['id', 'name', 'image', 'price', 'rating'],
            having: this.sequelize.where(
                this.sequelize.fn('COUNT', this.sequelize.col('reviews.id')), '>=', n
            )
        });
    }

    // Данный метод должен удалять все сувениры, которых нет в наличии
    // (то есть amount = 0).

    // Метод должен возвращать количество удаленных сувениров в случае успешного удаления.
    deleteOutOfStockSouvenirs() {
        return this.Souvenir.destroy({ where: { amount: 0 } });
    }

    // Данный метод должен добавлять отзыв к сувениру souvenirId
    // содержит login, text, rating - из аргументов.
    // Обратите внимание, что при добавлении отзыва рейтинг сувенира должен быть пересчитан,
    // и всё это должно происходить за одну транзакцию (!).
    async addReview(souvenirId, { login, text, rating }) {
        const { id: userId } = await this.User.findOne({ where: { login } });
        const souvenir = await this.Souvenir.findById(souvenirId);

        return this.sequelize.transaction(transaction => souvenir.createReview({
            userId, text, rating
        }, { transaction })
            .then(() => souvenir.getReviews({ transaction }))
            .then(reviews => souvenir.update({
                rating: (souvenir.rating * rating + (reviews.length - 1)) / reviews.length
            }, { transaction })));
    }

    // Данный метод должен считать общую стоимость корзины пользователя login
    // У пользователя может быть только одна корзина, поэтому это тоже можно отразить
    // в модели.
    async getCartSum(login) {
        return await this.Cart.sum('souvenirs.price', {
            group: 'carts.id',
            includeIgnoreAttributes: false,
            include: [this.Souvenir, {
                model: this.User,
                where: { login }
            }]
        });
    }
}

module.exports = Queries;
