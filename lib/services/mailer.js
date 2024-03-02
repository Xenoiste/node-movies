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
            else {
                console.log('Email sent: ' + info.response);
            }
        });
    }
};
