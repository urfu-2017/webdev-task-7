'use strict';

const models = require('./index');
const Queries = require('./queries');

(async () => {
    const sequelize = models.sequelize;

    const queries = new Queries(models);

    try {
        // Здесь можно делать запросы, чтобы проверять, что они правильно работают
        const result = await queries.addReview(1, { login: 'batgirl', text: 'start', rating: 100500 });
        // const result = await queries.getDisscusedSouvenirs(0);

        console.info(result);
    } catch (error) {
        console.error(error);
    }

    await sequelize.close();
})();

/**
 * @param {Promise} response
 * @returns {Promise}
 */
// eslint-disable-next-line no-unused-vars
async function makePlain(response) {
    return (await response).map(el => el.get({ plain: true }));
}

