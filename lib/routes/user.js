'use strict';

const Joi = require('joi');
const { NotFoundError } = require('objection');

module.exports = [
    {
        method: 'post',
        path: '/user',
        options: {
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
            tags: ['api']
        },
        handler: async (request, h) => {
            const { userService } = request.services();

            return await userService.findAll();
        }
    },
    {
        method: 'delete',
        path: '/user/{id}',
        options: {
            tags: ['api'],
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
    }
];
