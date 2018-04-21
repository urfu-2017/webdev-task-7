'use strict';

class Queries {
    constructor(models) {
        this.sequelize = models.sequelize;
        this._Op = models.sequelize.Op;
        this._Cart = models.Cart;
        this._Country = models.Country;
        this._Review = models.Review;
        this._Souvenir = models.Souvenir;
        this._Tag = models.Tag;
        this._User = models.User;
    }

    // Далее идут методы, которые вам необходимо реализовать:

    getAllSouvenirs() {
        return this._Souvenir.findAll();
    }

    getCheapSouvenirs(price) {
        // Данный метод должен возвращать все сувениры, цена которых меньше или равна price.
        return this._Souvenir.findAll({
            where: {
                price: { [this._Op.lte]: price }
            }
        });
    }

    getTopRatingSouvenirs(n) {
        // Данный метод должен возвращать топ n сувениров с самым большим рейтингом.
        return this._Souvenir.findAll({
            order: [['rating', 'DESC']],
            limit: n
        });
    }

    getSouvenirsByTag(tag) {
        // Данный метод должен возвращать все сувениры, в тегах которых есть tag.
        // Кроме того, в ответе должны быть только поля id, name, image, price и rating.
        return this._Souvenir.findAll({
            attributes: ['id', 'name', 'image', 'price', 'rating'],
            include: {
                model: this._Tag,
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
        return this._Souvenir.count({
            where: {
                rating: { [this._Op.gte]: rating },
                price: { [this._Op.lte]: price }
            },
            include: {
                model: this._Country,
                where: {
                    name: country
                }
            }
        });
    }

    searchSouvenirs(substring) {
        // Данный метод должен возвращать все сувениры, в название которых входит
        // подстрока substring. Поиск должен быть регистронезависимым.
        return this._Souvenir.findAll({
            where: {
                name: { [this._Op.iLike]: `%${substring}%` }
            }
        });
    }

    getDisscusedSouvenirs(n) {
        // Данный метод должен возвращать все сувениры, имеющих >= n отзывов.
        // Кроме того, в ответе должны быть только поля id, name, image, price и rating.
        const sequelize = this.sequelize;

        return this._Souvenir.findAll({
            attributes: ['name', 'image', 'price', 'rating'],
            include: {
                model: this._Review,
                attributes: []
            },
            order: ['id'],
            group: 'souvenirs.id',
            having: sequelize.where(sequelize.fn('COUNT', sequelize.col('reviews.id')), '>=', n)
        });
    }

    deleteOutOfStockSouvenirs() {
        // Данный метод должен удалять все сувениры, которых нет в наличии
        // (то есть amount = 0).

        // Метод должен возвращать количество удаленных сувениров в случае успешного удаления.
        return this._Souvenir.destroy({
            where: {
                amount: { [this._Op.eq]: 0 }
            }
        });
    }

    addReview(souvenirId, { login, text, rating }) {
        // Данный метод должен добавлять отзыв к сувениру souvenirId
        // содержит login, text, rating - из аргументов.
        // Обратите внимание, что при добавлении отзыва рейтинг сувенира должен быть пересчитан,
        // и всё это должно происходить за одну транзакцию (!).
        return this.sequelize.transaction(async t => {
            const user = await this._User.findOne({
                where: {
                    login
                },
                transaction: t
            });

            await this._Review.create({
                text, rating, souvenirId, userId: user.id
            }, { transaction: t });

            const souvenir = await this._Souvenir.findOne({
                where: {
                    id: souvenirId
                },
                include: {
                    model: this._Review
                },
                transaction: t
            });

            souvenir.rating = souvenir.reviews.reduce((previousValue, currentReview) =>
                previousValue + currentReview.rating, 0) / souvenir.reviews.length;

            return souvenir.save({ transaction: t });
        });
    }

    async getCartSum(login) {
        // Данный метод должен считать общую стоимость корзины пользователя login
        // У пользователя может быть только одна корзина, поэтому это тоже можно отразить
        // в модели.
        const cart = await this._Cart.findOne({
            include: [
                { model: this._User, where: { login } },
                { model: this._Souvenir }
            ]
        });

        const totalPrice = cart.souvenirs.reduce((previousValue, currentSouvenir) =>
            previousValue + currentSouvenir.price, 0);

        return totalPrice.toFixed(10);
    }
}

module.exports = Queries;
