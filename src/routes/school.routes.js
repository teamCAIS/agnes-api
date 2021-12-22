
const fp = require('fastify-plugin');
const schoolsController = require('../schools/schools.controller');

const SchoolsRouter = async (server, options) => {
    server.get('/schools', {}, schoolsController.getAll);
    server.get('/schools/:id', {}, schoolsController.get);
    server.post('/schools', {}, schoolsController.create);
    server.put('/schools/:id', {}, schoolsController.update);
    server.delete('/schools/:id', {}, schoolsController.delete);
  };

  module.exports = fp(SchoolsRouter);