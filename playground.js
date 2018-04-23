'use strict';

const models = require('./index');
const Queries = require('./queries');

(async () => {
    const sequelize = models.sequelize;

    const queries = new Queries(models);

    try {
        // Здесь можно делать запросы, чтобы проверять, что они правильно работают
        // const result = await queries.getAllSouvenirs();
        // const result = await queries.getCheapSouvenirs(100);
        // const result = await queries.getTopRatingSouvenirs(5);
        // const result = await queries.getSouvenirsByTag('ракушка');
        // const result = await queries.getSouvenirsCount({
        //     country: 'Япония', price: 20000, rating: 4
        // });
        // const result = await queries.searchSouvenirs('магнит');
        // const result = await queries.getDisscusedSouvenirs(5);
        // const result = await queries.deleteOutOfStockSouvenirs();
        const result = await queries.getCartSum('punisher');
        // const result = await queries.addReview(1, {
        //     login: 'punisher', rating: 5, text: 'Sample text'
        // });

        console.info(result);
    } catch (error) {
        console.error(error);
    }

    await sequelize.close();
})();
