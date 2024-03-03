'use strict';

const Joi = require('joi');
const Boom = require('@hapi/boom');

module.exports = [
    {
        method: 'post',
        path: '/user',
        options: {
            auth: false,
            tags: ['api'],
            validate: {
                payload: Joi.object({
                    firstName: Joi.string().required().min(3).example('John').description('Firstname of the user'),
                    lastName: Joi.string().required().min(3).example('Doe').description('Lastname of the user'),
                    mail: Joi.string().email().example('example@mail.com'),
                    username: Joi.string().min(3).example('Johny'),
                    password: Joi.string().min(8).example('password')
                })
            }
        },
        handler: async (request, h) => {
            const { userService } = request.services();

            return await userService.create(request.payload);
        }
    },
    {
        method: 'get',
        path: '/users',
        options: {
            auth: {
                scope: ['admin', 'user']
            },
            tags: ['api']
        },
        handler: async (request, h) => {
            const { userService } = request.services();
            console.log(request.auth.credentials)
            return await userService.findAll();
        }
    },
    {
        method: 'delete',
        path: '/user/{id}',
        options: {
            tags: ['api'],
            auth: {
                scope: ['admin']
            },
            validate: {
                params: Joi.object({
                    id: Joi.number().integer().required().description('ID of the user to delete')
                })
            }
        },
        handler: async (request, h) => {
            const { userService } = request.services();
            const userId = request.params.id;

            if (!await userService.delete(userId)) {
                return h.response(`User with ID ${userId} not found`).code(404);
            }

            return '';
        }
    },
    {
        method: 'patch',
        path: '/user/{id}',
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
                    firstName: Joi.string().min(3).example('John').description('Firstname of the user'),
                    lastName: Joi.string().min(3).example('Doe').description('Lastname of the user'),
                    mail: Joi.string().email().example('example@mail.com'),
                    username: Joi.string().min(3).example('Johny'),
                    password: Joi.string().min(8).example('password')                })
            }
        },
        handler: async (request, h) => {
            const { userService } = request.services();
            return await userService.update(request.params.id, request.payload);
        }
    },
    {
        method: 'post',
        path: '/user/login',
        options: {
            auth: false,
            tags: ['api'],
            validate: {
                payload: Joi.object({
                    mail: Joi.string().email().required().example('example@mail.com'),
                    password: Joi.string().min(8).required().example('password')
                })
            }
        },
        handler: async (request, h) => {
            const { userService } = request.services();
            const response = await userService.authenticate(request.payload);

            return h.response(response).code(response.statusCode ?? 200);
        }
    }
];
