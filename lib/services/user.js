'use strict';

const { Service } = require('@hapipal/schmervice');
const {NotFoundError} = require("objection");

module.exports = class UserService extends Service {

    create(user) {

        const { User } = this.server.models();

        return User.query().insertAndFetch(user);
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
