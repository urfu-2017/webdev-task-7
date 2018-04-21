'use strict';

class Queries {
    constructor(models) {
        // Что-нибудь инициализируем в конструкторе
        this.sequelize = models.sequelize;
        this.Op = models.sequelize.Op;
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
                rating: { [this.Op.gte]: rating },
                price: { [this.Op.lte]: price }
            },
            include: {
                model: this.Country,
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
        return this.Souvenir.findAll({
            where: {
                name: {
                    [this.Op.iLike]: '%' + substring + '%'
                }
            }
        });
    }

    getDisscusedSouvenirs(n) {
        // Данный метод должен возвращать все сувениры, имеющих >= n отзывов.
        // Кроме того, в ответе должны быть только поля name, image, price и rating.
        return this.Souvenir.findAll({
            attributes: ['name', 'image', 'price', 'rating'],
            include: {
                model: this.Review,
                attributes: []
            },
            group: this.Souvenir.name + '.id',
            having: this.sequelize.where(
                this.sequelize.fn(
                    'COUNT',
                    this.sequelize.col(this.Review.tableName + '.souvenirId')
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
        return this.Souvenir.destroy({
            attributes: [this.sequelize.col(this.Souvenir.name + '.id')],
            where: {
                amount: 1
            }
        });
    }

    async addReview(souvenirId, { login, text, rating }) {
        // Данный метод должен добавлять отзыв к сувениру souvenirId
        // содержит login, text, rating - из аргументов.
        // Обратите внимание, что при добавлении отзыва рейтинг сувенира должен быть пересчитан,
        // и всё это должно происходить за одну транзакцию (!).
        const user = await this.User.findOne({
            where: { login },
            attributes: ['id', 'login']
        });

        return this.sequelize.transaction(async transaction => {
            const newReview = await this.Review.create({
                text,
                rating,
                souvenirId,
                userId: user.id
            });
            await newReview.save();
            const souvenir = await this.Souvenir.findById(souvenirId);
            const reviewCount = await this.Review.count({
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
        const user = await this.User.findOne({
            where: { login }
        });

        return await this.Cart.sum(this.Souvenir.tableName + '.price', {
            where: { userId: user.id },
            include: {
                model: this.Souvenir,
                attributes: ['price']
            },
            groupBy: this.Cart.name + '.id',
            includeIgnoreAttributes: false
        });
    }
}

module.exports = Queries;
