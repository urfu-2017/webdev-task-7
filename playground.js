'use strict';

const models = require('./index');
const Queries = require('./queries');

(async () => {
    const sequelize = models.sequelize;

    const queries = new Queries(models);

    try {
        // Здесь можно делать запросы, чтобы проверять, что они правильно работают
        const result = await queries.getDisscusedSouvenirs(4);
        // const result = await queries.getDisscusedSouvenirs(2);

        console.info(result);
    } catch (error) {
        console.error(error);
    }

    await sequelize.close();
})();
