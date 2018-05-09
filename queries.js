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
        // Данный метод должен возвращать все сувениры.

        return this.Souvenir.findAll();
    }

    getCheapSouvenirs(price) {
        // Данный метод должен возвращать все сувениры, цена которых меньше или равна price.

        return this.Souvenir.findAll({
            where: {
                price: { [this.sequelize.Op.lte]: price }
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
            include: {
                model: this.Tag,
                where: {
                    name: tag
                },
                attributes: []
            }
        });
    }

    getSouvenirsCount({ country, rating, price }) {
        // Данный метод должен возвращать количество сувениров,
        // из страны country, с рейтингом больше или равной rating,
        // и ценой меньше или равной price.

        // Важно, чтобы метод работал очень быстро,
        // поэтому учтите это при определении моделей (!).

        return this.Souvenir.count({
            where: {
                rating: { [this.sequelize.Op.gte]: rating },
                price: { [this.sequelize.Op.lte]: price }
            },
            include: {
                model: this.Country,
                where: {
                    name: country
                }
            }
        });
    }

    searchSouvenirs(substring) {
        // Данный метод должен возвращать все сувениры, в название которых входит
        // подстрока substring. Поиск должен быть регистронезависимым.


        return this.Souvenir.findAll({
            where: {
                name: { [this.sequelize.Op.iRegexp]: substring }
            }
        });
    }

    getDisscusedSouvenirs(n) {
        // Данный метод должен возвращать все сувениры, имеющих >= n отзывов.
        // Кроме того, в ответе должны быть только поля name, image, price и rating.

        return this.Souvenir.findAll({
            attributes: [
                'name',
                'image',
                'price',
                'rating'
            ],
            include: {
                model: this.Review,
                attributes: []
            },
            group: 'souvenir.id',
            having: this.sequelize.where(
                this.sequelize.literal('COUNT(DISTINCT(reviews.id))'),
                {
                    [this.sequelize.Op.gte]: n
                }
            )
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

    addReview(souvenirId, { login, text, rating }) {
        // Данный метод должен добавлять отзыв к сувениру souvenirId
        // содержит login, text, rating - из аргументов.
        // Обратите внимание, что при добавлении отзыва рейтинг сувенира должен быть пересчитан,
        // и всё это должно происходить за одну транзакцию (!).

        return this.sequelize.transaction(async transaction => {
            const user = await this.User.findOne({
                where: { login },
                transaction
            });
            await this.Review.create(
                { text, rating, souvenirId, userId: user.id },
                { transaction });

            const ratings = (await this.Review.findAll({
                where: { souvenirId },
                transaction
            })).map(review => review.rating);

            const souvenir = await this.Souvenir.findOne({
                where: { id: souvenirId },
                transaction
            });
            souvenir.rating = ratings.reduce((a, b) => a + b, 0) / ratings.length;
            await souvenir.save({ transaction });
        });
    }

    getCartSum(login) {
        // Данный метод должен считать общую стоимость корзины пользователя login
        // У пользователя может быть только одна корзина, поэтому это тоже можно отразить
        // в модели.
        return this.Cart.sum('souvenirs.price', {
            includeIgnoreAttributes: false,
            include: [{
                model: this.User,
                where: { login },
                attributes: []
            },
            {
                model: this.Souvenir,
                attributes: []
            }]
        });
    }
}

module.exports = Queries;
