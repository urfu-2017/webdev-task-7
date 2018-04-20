'use strict';

const models = require('./index');
const Queries = require('./queries');

(async () => {
    const sequelize = models.sequelize;

    const queries = new Queries(models);

    try {
        // Здесь можно делать запросы, чтобы проверять, что они правильно работают
        await queries.searchSouvenirs('рыба');
        await queries.getSouvenirsByTag('ракушка');
        await queries.getSouvenirsCount({ country: 'Кипр', rating: 3, price: 9 });
        await queries.deleteOutOfStockSouvenirs();
        await queries.getDisscusedSouvenirs(3);
        await queries.addReview(1, { login: 'batman', rating: 5, text: 'хо-хо' });
        await queries.getCartSum('batman');
    } catch (error) {
        console.error(error);
    }

    await sequelize.close();
})();
