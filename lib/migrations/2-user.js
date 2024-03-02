'use strict';

module.exports = {

    async up(knex) {

        await knex.schema.table('user', (table) => {
            table.string('scope').default('user').notNull();
        });
    },

    async down(knex) {

        await knex.schema.table('user', (table) => {
            table.dropColumn('scope');
        });
    }
};
