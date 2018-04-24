'use strict';

const models = require('./index');
const Queries = require('./queries');

(async () => {
    const sequelize = models.sequelize;

    const queries = new Queries(models);

    try {
        const result = await queries.addReview(1, { login: 'punisher', text: '123', rating: 5 });
        console.info(result);
    } catch (error) {
        console.error(error);
    }

    await sequelize.close();
})();
