'use strict';

const models = require('./index');
const Queries = require('./queries');

(async () => {
    const sequelize = models.sequelize;

    const queries = new Queries(models);

    try {
        // Здесь можно делать запросы, чтобы проверять, что они правильно работают
        const result = await queries.searchSouvenirs('рыба');
        // const result = await queries.getSouvenirsByTag('ракушка');
        // const result = await queries.getSouvenirsCount({ country: 'Кипр', rating: 3, price: 9 });
        // const result = await queries.deleteOutOfStockSouvenirs();
        // const result = await queries.getDisscusedSouvenirs(3);
        // const result = await queries.addReview(1, { login: 'batman', rating: 5, text: 'хо-хо' });
        // const result = await queries.getCartSum('batman');
        console.info(result);
    } catch (error) {
        console.error(error);
    }

    await sequelize.close();
})();
