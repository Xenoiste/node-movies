'use strict';

module.exports = {

    async up(knex) {

        await knex.schema.createTable('user_favourite_movies', (table) => {
            table.integer('userId').unsigned().references('user.id').onDelete('CASCADE').notNull();
            table.integer('movieId').unsigned().references('movie.id').onDelete('CASCADE').notNull();
            table.primary(['userId', 'movieId']);
        });
    },

    async down(knex) {
        await knex.schema.dropTableIfExists('user_favourite_movies');
    }
};
