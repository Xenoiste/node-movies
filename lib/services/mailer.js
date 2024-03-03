'use strict';

const { Service } = require('@hapipal/schmervice');
const { createTransport } = require('nodemailer');

module.exports = class MailerService extends Service {

    sendMail(subject, content, email) {

        const transporter = createTransport({
            host: process.env.MAILER_HOST,
            port: process.env.MAILER_PORT,
            auth: {
                user: process.env.MAILER_USERNAME,
                pass: process.env.MAILER_PASSWORD
            }
        });

        const mailOptions = {
            from: process.env.MAILER_USERNAME,
            to: email,
            subject,
            text: content
        };

        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.log(error);
            }
        });
    }

    sendEmailToAllUsers(subject, content) {
        const { User } = this.server.models();

        for (const user of User.query()) {
            this.sendMail(subject, content, user.mail);
        }
    }

    async sendMovieUpdateEmail(movie) {
        const users = await movie.$relatedQuery('favouritedBy');
        const subject = 'Un de vos films favoris à été modifié';
        const content = `Les informations du film "${movie.title}" ont été mises à jour.`;
        for (const user of users) {
            this.sendMail(subject, content, user.mail);
        }
    }
};
