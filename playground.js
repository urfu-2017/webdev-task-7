'use strict';

const models = require('./index');
const Queries = require('./queries');

(async () => {
    const sequelize = models.sequelize;

    const queries = new Queries(models);

    try {
        // Здесь можно делать запросы, чтобы проверять, что они правильно работают
        // const result = await queries.getAllSouvenirs();
        // const result = await queries.getTopRatingSouvenirs(5);
        // const result = await queries.getSouvenirsByTag('магнит');
        // const result = await queries.getSouvenirsCount({
        //     country: 'США',
        //     rating: 2,
        //     price: 1000
        // });
        // const result = await queries.searchSouvenirs('Рука');
        // const result = await queries.deleteOutOfStockSouvenirs();
        // const result = await queries.addReview(1, {
        //     login: 'steve',
        //     text: 'Hello world!',
        //     rating: 3
        // });
        const result = await queries.getCartSum('steve');

        console.info(result);
    } catch (error) {
        console.error(error);
    }

    await sequelize.close();
})();
