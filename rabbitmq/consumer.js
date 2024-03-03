require('dotenv').config({ path: '../server/.env' });
const amqp = require('amqplib');
const { Model } = require('objection');
const Movie = require('../lib/models/movie');
const { writeFileSync } = require("fs");
const { parse } = require('json2csv');
const {createTransport} = require("nodemailer");
const Knex = require('knex')({
    client: 'mysql2',
    connection: {
        host: process.env.DB_HOST || '127.0.0.1',
        port: 3307,
        user: process.env.DB_USER || 'root',
        password: process.env.DB_PASSWORD || 'hapi',
        database: process.env.DB_DATABASE || 'user'
    }
});
Model.knex(Knex);

async function consumeQueue() {
    const connection = await amqp.connect('amqp://localhost');
    const channel = await connection.createChannel();
    const queue = 'export_queue';

    await channel.assertQueue(queue, { durable: true });

    console.log('Waiting for messages in the queue...');

    channel.consume(queue, async (message) => {
        const data = message.content.toString();

        try {
            console.log(data);
            const result = await Movie.query();

            const csv = parse(result);

            sendCsvEmail(csv, data);

            console.log('Data inserted into the database:');
        } catch (error) {
            console.error('Error inserting data into the database:', error);
        }

        channel.ack(message);
    });
}

consumeQueue().catch((error) => {
    console.error('Error consuming queue:', error);
});

function sendCsvEmail(csv, email) {
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
        subject: 'Export CSV des films',
        text: 'Ce mail contient un fichier CSV en pièce jointe avec les données de films',
        attachments: {
            filename: 'movies.csv',
            content: csv
        }
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.log(error);
        }
    });
}
