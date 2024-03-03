'use strict';

const { Service } = require('@hapipal/schmervice');

module.exports = class FavouriteMoviesService extends Service {
    async create(movieId, request) {
        const { User, Movie } = this.server.models();
        const userId = request.auth.credentials.id;
        const user = await User.query().findById(userId);
        const movie = await Movie.query().findById(movieId);
        try {
            await user.$relatedQuery('movies').relate(movie);
            return 'Film added to favourite';
        }
        catch (error) {
            console.log(error);
            return 'Film not found';
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

        return 'Film not found';
    }
};
