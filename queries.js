'use strict';

class Queries {
    constructor({ sequelize, Country, Tag, Review, Souvenir, Cart, User }) {
        this.sequelize = sequelize;
        this.Country = Country;
        this.Tag = Tag;
        this.Review = Review;
        this.Souvenir = Souvenir;
        this.Cart = Cart;
        this.User = User;
    }

    // Далее идут методы, которые вам необходимо реализовать:

    getAllSouvenirs() {
        return this.Souvenir.findAll();
    }

    getCheapSouvenirs(price) {
        // Данный метод должен возвращать все сувениры, цена которых меньше или равна price.
        return this.Souvenir.findAll({
            where: {
                price: { $lte: price }
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
            include: {
                model: this.Tag,
                where: { name: tag },
                attributes: []
            },
            attributes: ['id', 'name', 'image', 'price', 'rating']
        });
    }

    getSouvenirsCount({ country, rating, price }) {
        // Данный метод должен возвращать количество сувениров,
        // из страны country, с рейтингом больше или равной rating,
        // и ценой меньше или равной price.
        return this.Souvenir.count({
            include: {
                model: this.Country,
                where: { name: country }
            },
            where: {
                rating: { $gte: rating },
                price: { $lte: price }
            }
        });
    }

    searchSouvenirs(substring) {
        // Данный метод должен возвращать все сувениры, в название которых входит
        // подстрока substring. Поиск должен быть регистронезависимым.
        return this.Souvenir.findAll({
            where: {
                name: { $iRegexp: substring }
            }
        });
    }

    getDisscusedSouvenirs(n) {
        // Данный метод должен возвращать все сувениры, имеющих >= n отзывов.
        // Кроме того, в ответе должны быть только поля name, image, price и rating.
        const { where, fn, col } = this.sequelize;

        return this.Souvenir.findAll({
            attributes: ['name', 'image', 'price', 'rating'],
            include: [{
                model: this.Review,
                attributes: []
            }],
            order: ['id'],
            group: col('souvenirs.id'),
            having: where(fn('COUNT', col('reviews.id')), '>=', n)
        });
    }

    deleteOutOfStockSouvenirs() {
        // Данный метод должен удалять все сувениры, которых нет в наличии
        // (то есть amount = 0).

        // Метод должен возвращать количество удаленных сувениров в случае успешного удаления.
        return this.Souvenir.destroy({
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
        const user = await this.User.findOne({
            where: { login }
        });
        const souvenir = await this.Souvenir.findById(souvenirId);

        return this.sequelize.transaction(async transaction => {
            await souvenir.createReview({ userId: user.id, text, rating }, { transaction });

            const reviews = await souvenir.getReviews({ transaction });
            const newRating = (souvenir.rating * (reviews.length - 1) + rating) / (reviews.length);

            await souvenir.update({ rating: newRating }, { transaction });
        });
    }

    getCartSum(login) {
        // Данный метод должен считать общую стоимость корзины пользователя login
        // У пользователя может быть только одна корзина, поэтому это тоже можно отразить
        // в модели.
        return this.Cart.sum('souvenirs.price', {
            group: 'carts.id',
            includeIgnoreAttributes: false,
            include: [
                this.Souvenir, {
                    model: this.User,
                    where: { login }
                }
            ]
        });
    }
}

module.exports = Queries;
