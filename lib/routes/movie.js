'use strict';

const Joi = require('joi');

module.exports = [
    {
        method: 'post',
        path: '/movie',
        options: {
            auth: {
                scope: ['admin']
            },
            tags: ['api'],
            validate: {
                payload: Joi.object({
                    title: Joi.string().required().min(1).example('Just Penguins').description('Title of the movie'),
                    description: Joi.string().required().min(8).example('A movie about killer penguins').description('Description of the movie'),
                    releaseDate: Joi.date().required().description('Release date of the movie'),
                    director: Joi.string().required().min(3).example('Johny').description('Director of the movie'),
                })
            }
        },
        handler: async (request, h) => {
            const { movieService } = request.services();

            return await movieService.create(request.payload);
        }
    },
    {
        method: 'get',
        path: '/movies',
        options: {
            auth: {
                scope: ['admin', 'user']
            },
            tags: ['api']
        },
        handler: async (request, h) => {
            const { movieService } = request.services();

            return await movieService.findAll();
        }
    },
    {
        method: 'delete',
        path: '/movie/{id}',
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
            const { movieService } = request.services();
            const movieId = request.params.id;

            if (!await movieService.delete(movieId)) {
                return h.response(`Movie with ID ${movieId} not found`).code(404);
            }

            return '';
        }
    },
    {
        method: 'patch',
        path: '/movie/{id}',
        options: {
            tags: ['api'],
            auth: {
                scope: ['admin']
            },
            validate: {
                params: Joi.object({
                    id: Joi.number().integer().required().description('ID of the user')
                }),
                payload: Joi.object({
                    title: Joi.string().min(1).example('Just Penguins').description('Title of the movie'),
                    description: Joi.string().min(8).example('A movie about killer penguins').description('Description of the movie'),
                    releaseDate: Joi.date().description('Release date of the movie'),
                    director: Joi.string().min(3).example('Johny').description('Director of the movie'),
                })
            }
        },
        handler: async (request, h) => {
            const { movieService } = request.services();

            return await movieService.update(request.params.id, request.payload);
        }
    }
];
