
'use strict';

class Queries {
    constructor(models) {
        this.sequelize = models.sequelize;
        this.Op = this.sequelize.Op;
        this.Country = models.Country;
        this.Tag = models.Tag;
        this.Review = models.Review;
        this.Souvenir = models.Souvenir;
        this.Cart = models.Cart;
        this.User = models.User;
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
                price: {
                    [this.Op.lte]: price
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
            attributes: [
                'id',
                'name',
                'image',
                'price',
                'rating'
            ],
            include: {
                attributes: [],
                model: this.Tag,
                where: {
                    name: tag
                }
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
            include: {
                model: this.Country,
                where: {
                    name: country
                }
            },
            where: {
                rating: {
                    [this.Op.gte]: rating
                },
                price: {
                    [this.Op.lte]: price
                }
            }
        });
    }

    searchSouvenirs(substring) {
        // Данный метод должен возвращать все сувениры, в название которых входит
        // подстрока substring. Поиск должен быть регистронезависимым.
        return this.Souvenir.findAll({
            where: {
                name: {
                    [this.Op.iRegexp]: substring
                }
            }
        });
    }

    getDisscusedSouvenirs(n) {
        // Данный метод должен возвращать все сувениры, имеющих >= n отзывов.
        // Кроме того, в ответе должны быть только поля id, name, image, price и rating.
        return this.Souvenir.findAll({
            attributes: [
                'name',
                'image',
                'price',
                'rating'
            ],
            group: 'souvenir.id',
            having: this.sequelize.where(
                this.sequelize.fn(
                    'COUNT',
                    this.sequelize.col('reviews.id')
                ),
                {
                    [this.Op.gte]: n
                }
            ),
            include: {
                model: this.Review,
                attributes: []
            }
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
        let transaction;

        try {
            transaction = await this.sequelize.transaction();

            const souvenir = await this.Souvenir.findOne({
                include: {
                    model: this.Review
                },
                souvenirId
            }, {
                transaction
            });

            const user = await this.User.findOne({
                where: {
                    login
                }
            }, {
                transaction
            });

            const review = await this.Review.create({
                userId: user.id,
                text,
                rating,
                souvenirId: souvenir.id
            }, {
                transaction
            });

            const souvenirsCount = souvenir.reviews.length;
            const souvenirRating = souvenir.rating * souvenirsCount + rating /
                (souvenirsCount + 1);

            await souvenir.update({
                rating: souvenirRating
            }, {
                transaction
            });
            await transaction.commit();

            return review;
        } catch (err) {
            await transaction.rollback();
            throw err;
        }
    }

    getCartSum(login) {
        // Данный метод должен считать общую стоимость корзины пользователя login
        // У пользователя может быть только одна корзина, поэтому это тоже можно отразить
        // в модели.
        return this.Cart.sum('souvenirs.price', {
            includeIgnoreAttributes: false,
            include: [
                {
                    model: this.Souvenir
                },
                {
                    model: this.User,
                    where: {
                        login
                    }
                }
            ],
            group: 'cart.id'
        });
    }
}

module.exports = Queries;
