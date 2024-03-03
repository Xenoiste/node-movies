'use strict';

const { Service } = require('@hapipal/schmervice');
const bcrypt = require('bcrypt');
const Jwt = require('@hapi/jwt');
const Boom = require('@hapi/boom');

module.exports = class UserService extends Service {

    async create(user) {

        const { User } = this.server.models();
        user.password = await bcrypt.hash(user.password, 10);
        return User.query().insertAndFetch(user);
    }

    async update(id, user) {
        const { User } = this.server.models();
        user.password = await bcrypt.hash(user.password, 10);
        return User.query().findById(id).patch(user);
    }

    findAll() {
        const { User } = this.server.models();

        return User.query();
    }

    delete(id) {
        const { User } = this.server.models();

        return User.query().deleteById(id);
    }

    async authenticate(payload) {
        const { User } = this.server.models();
        const user = await User.query().where('mail', payload.mail).first();

        if (user === undefined) {
            // throw Boom.notFound('La ressource demandée est introuvable');
            return Boom.notFound(`User with email "${payload.mail}" not found`).output.payload;
        }

        if (bcrypt.compareSync(payload.password, user.password)) {
            return Jwt.token.generate(
                {
                    aud: 'urn:audience:iut',
                    iss: 'urn:issuer:iut',
                    id: user.id,
                    firstName: user.firstName,
                    lastName: user.lastName,
                    email: user.email,
                    scope: user.scope
                },
                {
                    key: 'random_string',
                    algorithm: 'HS512'
                },
                {
                    ttlSec: 14400
                }
            );
        }

        return Boom.unauthorized('Password incorrect').output.payload;
    }
};
