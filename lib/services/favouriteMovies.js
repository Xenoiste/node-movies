'use strict';

const { Service } = require('@hapipal/schmervice');
const Boom = require('@hapi/boom');

module.exports = class FavouriteMoviesService extends Service {
    async create(movieId, request) {
        const { User, Movie } = this.server.models();
        const userId = request.auth.credentials.id;
        const user = await User.query().findById(userId);
        const movie = await Movie.query().findById(movieId);

        if (movie === undefined) {
            return Boom.notFound(`Movie with id ${movieId} was not found`).output.payload;
        }

        try {
            await user.$relatedQuery('movies').relate(movie);
            return 'Film added to favourite';
        }
        catch (error) {
            return Boom.conflict(`Film already added`).output.payload;
        }
    }

    async findAll(request) {
        const { User } = this.server.models();
        const userId = request.auth.credentials.id;
        const user = await User.query().findById(userId).withGraphFetched('movies');

        return user.movies;
    }

    async delete(id, request) {
        const { User } = this.server.models();
        const userId = request.auth.credentials.id;
        const user = await User.query().findById(userId);
        const result = await user.$relatedQuery('movies').unrelate().where('id', id);

        if (result === 1) {
            return 'Film removed to favourite';
        }

        return Boom.notFound(`Film with ID ${id} not found`).output.payload;
    }
};
