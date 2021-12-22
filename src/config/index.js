const fp = require('fastify-plugin');
const mongoose = require('mongoose');

const schoolModel = require('../schools/schools.model');

const ConnectDB = async (fastify, options) => {
    try {
        mongoose.connection.on('connected', () => {
            console.log('MongoDB connected');
        });
        mongoose.connection.on('disconnected', () => {
            console.log('MongoDB disconnected');
        });

        mongoose.connect(options.uri, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });

        const models = { 
          schoolModel   
        };

        fastify.decorate('db', { models });
    } catch (error) {
        console.error(error);
    }
};

module.exports = fp(ConnectDB);