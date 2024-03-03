'use strict';

const Joi = require('joi');

module.exports = [
    {
        method: 'post',
        path: '/favouriteMovies/{id}',
        options: {
            tags: ['api'],
            auth: {
                scope: ['admin', 'user']
            },
            validate: {
                params: Joi.object({
                    id: Joi.number().integer().required().description('ID of the movie to add')
                })
            }
        },
        handler: async (request, h) => {
            const { favouriteMoviesService } = request.services();
            const movieId = request.params.id;
            const response = await favouriteMoviesService.create(movieId, request);

            return h.response(response).code(response.statusCode ?? 200);
        }
    },
    {
        method: 'get',
        path: '/favouriteMovies',
        options: {
            auth: {
                scope: ['admin', 'user']
            },
            tags: ['api']
        },
        handler: async (request, h) => {
            const { favouriteMoviesService } = request.services();

            return await favouriteMoviesService.findAll(request);
        }
    },
    {
        method: 'delete',
        path: '/favouriteMovies/{id}',
        options: {
            tags: ['api'],
            auth: {
                scope: ['admin']
            },
            validate: {
                params: Joi.object({
                    id: Joi.number().integer().required().description('ID of the movie to delete')
                })
            }
        },
        handler: async (request, h) => {
            const { favouriteMoviesService } = request.services();
            const movieId = request.params.id;
            const response = await favouriteMoviesService.delete(movieId, request);

            return h.response(response).code(response.statusCode ?? 200);
        }
    }
];
