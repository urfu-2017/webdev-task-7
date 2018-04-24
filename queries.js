'use strict';

class Queries {
    constructor(models) {
        // Что-нибудь инициализируем в конструкторе
        this.models = models;
    }

    // Далее идут методы, которые вам необходимо реализовать:

    getAllSouvenirs() {
        // Данный метод должен возвращать все сувениры.
        return this.models.Souvenir.findAll();
    }

    getCheapSouvenirs(price) {
        // Данный метод должен возвращать все сувениры, цена которых меньше или равна price.
        return this.models.Souvenir.findAll({
            where: {
                price: {
                    [this.models.Op.lte]: price
                }
            }
        });
    }

    getTopRatingSouvenirs(n) {
        // Данный метод должен возвращать топ n сувениров с самым большим рейтингом.
        return this.models.Souvenir.findAll({
            order: [
                ['rating', 'DESC']
            ],
            limit: n
        });
    }

    getSouvenirsByTag(tag) {
        // Данный метод должен возвращать все сувениры, в тегах которых есть tag.
        // Кроме того, в ответе должны быть только поля id, name, image, price и rating.
        return this.models.Souvenir.findAll({
            attributes: ['id', 'name', 'image', 'price', 'rating'],
            include: {
                model: this.models.Tag,
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
        return this.models.Souvenir.count({
            where: {
                rating: { [this.models.Op.gte]: rating },
                price: { [this.models.Op.lte]: price }
            },
            include: {
                model: this.models.Country,
                where: {
                    name: country
                },
                attributes: []
            }
        });
    }

    searchSouvenirs(substring) {
        // Данный метод должен возвращать все сувениры, в название которых входит
        // подстрока substring. Поиск должен быть регистронезависимым.
        return this.models.Souvenir.findAll({
            where: {
                name: {
                    [this.models.Op.iLike]: `%${substring}%`
                }
            }
        });
    }

    getDisscusedSouvenirs(n) {
        // Данный метод должен возвращать все сувениры, имеющих >= n отзывов.
        // Кроме того, в ответе должны быть только поля name, image, price и rating.
        return this.models.Souvenir.findAll({
            attributes: ['name', 'image', 'price', 'rating'],
            include: {
                model: this.models.Review,
                attributes: []
            },
            group: this.models.Souvenir.name + '.id',
            having: this.models.sequelize.where(
                this.models.sequelize.fn(
                    'COUNT',
                    this.models.sequelize.col(this.models.Review.name + '.souvenirId')
                ),
                '>=',
                n
            )
        });
    }

    deleteOutOfStockSouvenirs() {
        // Данный метод должен удалять все сувениры, которых нет в наличии
        // (то есть amount = 0).

        // Метод должен возвращать количество удаленных сувениров в случае успешного удаления.
        return this.models.Souvenir.destroy({
            attributes: [this.models.sequelize.col(this.models.Souvenir.name + '.id')],
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
        const user = await this.models.User.findOne({
            where: { login },
            attributes: ['id', 'login']
        });

        return this.models.sequelize.transaction(async transaction => {
            const newReview = await this.models.Review.create({
                text,
                rating,
                souvenirId,
                userId: user.id
            }, { transaction });
            await newReview.save({ transaction });
            const souvenir = await this.models.Souvenir.findById(souvenirId);
            const reviewCount = await this.models.Review.count({
                where: { souvenirId: souvenir.id }
            });
            rating = (rating + souvenir.dataValues.rating * (reviewCount - 1)) / reviewCount;
            await souvenir.update({ rating }, { transaction });
        });
    }

    async getCartSum(login) {
        // Данный метод должен считать общую стоимость корзины пользователя login
        // У пользователя может быть только одна корзина, поэтому это тоже можно отразить
        // в модели.
        const user = await this.models.User.findOne({
            where: { login }
        });

        return await this.models.Cart.sum(this.models.Souvenir.tableName + '.price', {
            where: { userId: user.id },
            include: {
                model: this.models.Souvenir,
                attributes: ['price']
            },
            groupBy: this.models.Cart.name + '.id',
            includeIgnoreAttributes: false
        });
    }
}

module.exports = Queries;
