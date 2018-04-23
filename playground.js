'use strict';

const models = require('./index');
const Queries = require('./queries');

/* eslint-disable max-statements */
(async () => {
    const sequelize = models.sequelize;

    const queries = new Queries(models);

    try {
        // Здесь можно делать запросы, чтобы проверять, что они правильно работают
        let result = await queries.getAllSouvenirs();
        result = await queries.getCheapSouvenirs(100);
        result = await queries.getTopRatingSouvenirs(2);
        result = await queries.getSouvenirsByTag('ракушка');
        result = await queries.getSouvenirsCount({
            country: 'Япония',
            rating: 4,
            price: 5000
        });
        result = await queries.searchSouvenirs('мОРе');
        result = await queries.addReview(1, {
            login: 'superman',
            text: 'o ma gash',
            rating: 5
        });
        result = await queries.getCartSum('superman');
        result = await queries.deleteOutOfStockSouvenirs();
        result = await queries.getDisscusedSouvenirs(6);

        console.info(result);
    } catch (error) {
        console.error(error);
    }

    await sequelize.close();
})();
