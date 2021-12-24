require('dotenv/config');

const { fastify } = require('fastify');
const fastifySwagger = require('fastify-swagger');

const db = require('./config/db');
const swaggerConfig = require('./config/docs');
const SchoolsRouter = require('./routes/school.routes');

const PORT = process.env.PORT || 8000;
const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/agnes';
const server = fastify();

server.register(db, {uri});
server.register(fastifySwagger, swaggerConfig);

server.register(SchoolsRouter);

const start = async () => {
    try {
        await server.listen(PORT, '0.0.0.0');
        console.log(`Server started successfully on PORT ${PORT}`);
    } catch (err) {
        server.log.error(err);
        process.exit(1);
    }
};

start();