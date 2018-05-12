'use strict';

const models = require('./index');
const Queries = require('./queries');

(async () => {
    const sequelize = models.sequelize;

    const queries = new Queries(models);

    try {
        // Здесь можно делать запросы, чтобы проверять, что они правильно работают
        const result = await queries.getAllSouvenirs();
        // const result = await queries.getCheapSouvenirs(1000);
        // const result = await queries.getTopRatingSouvenirs(5);
        // const result = await queries.getSouvenirsByTag('handmade');
        // const result = await queries.getSouvenirsCount({ 
        //    country: 'США', rating: 4, price: 2000 
        // });
        // const result = await queries.searchSouvenirs('кАр');
        // const result = await queries.getDisscusedSouvenirs(5);
        // const result = await queries.getCartSum('stranger');
        // const result = await queries.addReview(1, { 
        //    login: 'superman',
        //    text: 'azaza',
        //    rating: 5 
        // });

        console.info(result);
    } catch (error) {
        console.error(error);
    }

    await sequelize.close();
})();
