'use strict';

const { Service } = require('@hapipal/schmervice');
const { connect } = require('amqplib');
const Boom = require('@hapi/boom');

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

    async update(id, dataToPatch) {
        const { Movie } = this.server.models();
        const movie = await Movie.query().findById(id);

        if (movie === undefined) {
            return Boom.notFound(`Movie with id ${id} was not found`).output.payload;
        }

        new Promise(async (resolve, reject) => {
            try {
                const { mailerService } = this.server.services();
                await mailerService.sendMovieUpdateEmail(movie);
                resolve();
            } catch (error) {
                reject(error);
            }
        });

        await Movie.query().findById(id).patch(dataToPatch);
        return 'Movie updated';
    }

    findAll() {
        const { Movie } = this.server.models();

        return Movie.query();
    }

    async delete(id) {
        const { Movie } = this.server.models();
        const result = await Movie.query().deleteById(id);

        if (result === 1 ) {
            return 'Movie deleted';
        }

        return Boom.notFound(`Movie with ID ${id} not found`).output.payload;
    }

    async askMoviesExport(request) {
        const { User } = this.server.models();
        const connection = await connect(process.env.RABBITMQ_HOST);
        const channel = await connection.createChannel();
        const queue = 'export_queue';

        await channel.assertQueue(queue, { durable: true });

        const user = await User.query().findById(request.auth.credentials.id);

        channel.sendToQueue(queue, Buffer.from(user.mail), { persistent: true });

        return 'CSV export message sent to queue';
    }
};
