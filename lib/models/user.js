'use strict';

const Joi = require('joi');
const { Model } = require('@hapipal/schwifty');
const Movie = require("./movie");

module.exports = class User extends Model {

    static get tableName() {

        return 'user';
    }

    static relationMappings = {
        movies: {
            relation: Model.ManyToManyRelation,
            modelClass: Movie,
            join: {
                from: 'user.id',
                through: {
                    from: 'user_favourite_movies.userId',
                    to: 'user_favourite_movies.movieId'
                },
                to: 'movie.id'
            }
        }
    };

    static get joiSchema() {

        return Joi.object({
            id: Joi.number().integer().greater(0),
            firstName: Joi.string().min(3).example('John').description('Firstname of the user'),
            lastName: Joi.string().min(3).example('Doe').description('Lastname of the user'),
            password: Joi.string().description('Hashed password of the user'),
            mail: Joi.string().email().description('email of the User'),
            username: Joi.string().min(3).example('Johny').description('Username of the user'),
            scope: Joi.string().description('user or admin scope'),
            createdAt: Joi.date(),
            updatedAt: Joi.date()
        });
    }

    $beforeInsert(queryContext) {

        this.updatedAt = new Date();
        this.createdAt = this.updatedAt;
        if (this.scope === null) {
            this.scope = 'user';
        }
    }

    $beforeUpdate(opt, queryContext) {

        this.updatedAt = new Date();
    }

};