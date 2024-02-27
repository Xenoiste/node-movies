'use strict';

const { Service } = require('@hapipal/schmervice');
const bcrypt = require('bcrypt');

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
};
