require('dotenv/config');

const { fastify } = require('fastify');
const fastifySwagger = require('fastify-swagger');
const fastifyCors = require('fastify-cors');

const db = require('./config/db');
const swaggerConfig = require('./config/docs');
const SchoolsRouter = require('./routes/school.routes');
const UsersRouter = require('./routes/user.routes');
const TagsRouter = require('./routes/tag.routes');
const EvaluationsRouter = require('./routes/evaluation.routes');

const PORT = process.env.PORT || 8000;
const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/agnes';
const server = fastify({
    ignoreTrailingSlash: true,
});

server.register(fastifyCors, {
  origin: '*'
});
server.register(db, {uri});
server.register(fastifySwagger, swaggerConfig);

server.register(SchoolsRouter);
server.register(UsersRouter);
server.register(TagsRouter);
server.register(EvaluationsRouter);

const start = async () => {
    try {
        await server.listen(PORT, '0.0.0.0');
        console.log(`Server started successfully on PORT ${PORT}`);
    } catch (err) {
        console.log(err);
        process.exit(1);
    }
};

start();