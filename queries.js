'use strict';

const Sequelize = require('sequelize');
const Op = Sequelize.Op;

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

        return this.Souvenir.findAll({
            attributes: ['id', 'name', 'image', 'price', 'rating'],
            include: {
                model: this.Tag,
                where: { name: tag },
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
                    name: country
                }
            }]
        });
    }

    searchSouvenirs(substring) {
        // Данный метод должен возвращать все сувениры, в название которых входит
        // подстрока substring. Поиск должен быть регистронезависимым.

        return this.Souvenir.findAll({
            where: {
                name: {
                    [Op.iLike]: `%${substring}%`
                }
            }
        });
    }

    getDisscusedSouvenirs(n) {
        return this.Souvenir.findAll({
            attributes: ['name', 'image', 'price', 'rating'],
            include: {
                model: this.Review,
                attributes: []
            },
            order: ['id'],
            group: ['souvenir.id'],
            having: Sequelize.literal(`count(*) >= ${n}`)
        });
    }

    countReviews(souvenirId) {
        return this.Review.count({ where: { souvenirId } });
    }

    deleteOutOfStockSouvenirs() {
        // Данный метод должен удалять все сувениры, которых нет в наличии
        // (то есть amount = 0).

        return this.Souvenir.destroy({
            where: { amount: 0 }
        });
    }

    addReview(souvenirId, { login, text, rating }) {
        // Данный метод должен добавлять отзыв к сувениру souvenirId
        // содержит login, text, rating - из аргументов.
        // Обратите внимание, что при добавлении отзыва рейтинг сувенира должен быть пересчитан,
        // и всё это должно происходить за одну транзакцию (!).

        return this.sequelize.transaction(async transaction => {
            const souvenir = await this.Souvenir.findById(souvenirId, { transaction });
            const souvenirRating = souvenir.dataValues.rating;

            const reviewsCount = await this.countReviews(souvenirId);

            const newRating = (souvenirRating * reviewsCount + rating) / (reviewsCount + 1);

            await this.Souvenir.update({
                rating: newRating
            }, {
                where: { id: souvenirId },
                transaction
            });

            const userId = await this.User.findOne({
                where: { login },
                transaction
            }).then(user => user.id);

            await this.Review.create({ souvenirId, userId, text, rating }, { transaction });
        });
    }

    getCartSum(login) {
        // Данный метод должен считать общую стоимость корзины пользователя login
        // У пользователя может быть только одна корзина, поэтому это тоже можно отразить
        // в модели.

        return this.sequelize.query(`
            SELECT sum(souvenirs.price)
            FROM cart_souvenirs
            JOIN souvenirs ON cart_souvenirs."souvenirId"=souvenirs.id
            JOIN carts ON cart_souvenirs."cartId"=carts.id
            WHERE carts."userId" = (SELECT id FROM users WHERE login = '${login}')
            GROUP BY carts.id
        `).then(res => res[0][0].sum);
    }
}

module.exports = Queries;
