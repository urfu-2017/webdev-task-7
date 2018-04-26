'use strict';

const models = require('./index');
const Queries = require('./queries');

(async () => {
    const sequelize = models.sequelize;

    const queries = new Queries(models);

    try {
        const result = await queries.getSouvenirsByTag('редкий');
        console.info(result.map(i => i.dataValues));
    } catch (error) {
        console.error(error);
    }

    await sequelize.close();
})();
