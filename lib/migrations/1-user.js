'use strict';

module.exports = {

    async up(knex) {

        await knex.schema.table('user', (table) => {
            table.string('username').notNull();
            table.string('mail').notNull();
            table.string('password').notNull();
        });
    },

    async down(knex) {

        await knex.schema.table('user', (table) => {
            table.dropColumn('username');
            table.dropColumn('mail');
            table.dropColumn('password');
        });
    }
};
