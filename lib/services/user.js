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

        if (await User.query().findById(id) === undefined) {
            return Boom.notFound(`User with id ${id} was not found`).output.payload;
        }

        user.password = await bcrypt.hash(user.password, 10);
        await User.query().findById(id).patch(user);

        return 'User updated';
    }

    findAll() {
        const { User } = this.server.models();

        return User.query();
    }

    async delete(id) {
        const { User } = this.server.models();
        const result = await User.query().deleteById(id);

        if (result === 1 ) {
            return 'User deleted';
        }

        return Boom.notFound(`User with ID ${id} not found`).output.payload;
    }

    async authenticate(payload) {
        const { User } = this.server.models();
        const user = await User.query().where('mail', payload.mail).first();

        if (user === undefined) {
            return Boom.notFound(`User with email "${payload.mail}" was not found`).output.payload;
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
