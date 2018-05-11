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
            attributes: ['id', 'name', 'image', 'price', 'rating'],
            include: [
                {
                    model: this.tag,
                    where: {
                        name: tag
                    },
                    attributes: []
                }
            ]
        });
    }

    getSouvenirsCount({ country, rating, price }) {
        // Данный метод должен возвращать количество сувениров,
        // из страны country, с рейтингом больше или равной rating,
        // и ценой меньше или равной price.

        // Важно, чтобы метод работал очень быстро,
        // поэтому учтите это при определении моделей (!).
        return this.souvenir.count({
            where: {
                rating: { [this.op.gte]: rating },
                price: { [this.op.lte]: price }
            },
            include: [
                {
                    model: this.country,
                    where: {
                        name: country
                    }
                }
            ]
        });
    }

    searchSouvenirs(substring) {
        // Данный метод должен возвращать все сувениры, в название которых входит
        // подстрока substring. Поиск должен быть регистронезависимым.
        return this.souvenir.findAll({
            where: {
                name: { [this.op.iLike]: `%${substring}%` }
            }
        });
    }

    getDisscusedSouvenirs(n) {
        // Данный метод должен возвращать все сувениры, имеющих >= n отзывов.
        // Кроме того, в ответе должны быть только поля id, name, image, price и rating.
        return this.souvenir.findAll({
            attributes: ['id', 'name', 'image', 'price', 'rating'],
            include: [
                {
                    model: this.review,
                    attributes: []
                }
            ],
            order: ['id'],
            group: 'souvenirs.id',
            having: this.sequelize.where(
                this.sequelize.fn('COUNT', this.sequelize.col('reviews.id')), '>=', n
            )
        });
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

    async addReview(souvenirId, { login, text, rating }) {
        // Данный метод должен добавлять отзыв к сувениру souvenirId
        // содержит login, text, rating - из аргументов.
        // Обратите внимание, что при добавлении отзыва рейтинг сувенира должен быть пересчитан,
        // и всё это должно происходить за одну транзакцию (!).
        return this.sequelize.transaction(async transaction => {
            const user = await this.user.findOne({
                where: {
                    login: login
                },
                transaction: transaction
            });
            await this.review.create(
                {
                    text: text,
                    rating: rating,
                    souvenirId: souvenirId,
                    userId: user.id
                },
                {
                    transaction: transaction
                }
            );

            const ratings = (await this.review.findAll({
                where: {
                    souvenirId: souvenirId
                },
                transaction: transaction
            })).map(review => review.rating);

            rating = ratings.reduce((sum, current) => sum + current, 0) / ratings.length;

            const souvenir = await this.souvenir.findOne({
                where: {
                    id: souvenirId
                },
                transaction: transaction
            });

            await souvenir.update({ rating }, { transaction });
        });
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
