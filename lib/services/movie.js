'use strict';

const { Service } = require('@hapipal/schmervice');

module.exports = class MovieService extends Service {
    create(movie) {
        const { Movie } = this.server.models();
        new Promise(async (resolve, reject) => {
            try {
                const { mailerService } = this.server.services();
                const subject = 'Nouveau film ajouté';
                const content = `Le film "${movie.title}" a été ajouté. Venez le découvrir !`;
                mailerService.sendEmailToAllUsers(subject, content);
                resolve();
            } catch (error) {
                reject(error);
            }
        });

        return Movie.query().insertAndFetch(movie);
    }

    async update(id, movie) {
        const { Movie } = this.server.models();

        return Movie.query().findById(id).patch(movie);
    }

    findAll() {
        const { Movie } = this.server.models();

        return Movie.query();
    }

    delete(id) {
        const { Movie } = this.server.models();

        return Movie.query().deleteById(id);
    }
};
