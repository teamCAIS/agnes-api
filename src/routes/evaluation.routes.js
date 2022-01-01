
const fp = require('fastify-plugin');
const evaluationController = require('../evaluations/evaluations.controller');
const checkToken = require('../middlewares/auth.middleware');

const EvaluationsRouter = async (server, options, next) => {
    server.get('/evaluations', {
      preValidation: checkToken,
      schema: {
        tags: ['X-HIDDEN'],
      }
    }, evaluationController.getAll);
    server.get('/evaluations/has-evaluated', {
      preValidation: checkToken,
      schema: {
        tags: ['X-HIDDEN'],
      }
    }, evaluationController.hasEvaluated);
    server.get('/evaluations/comments', {
      preValidation: checkToken,
      schema: {
        tags: ['X-HIDDEN'],
      }
    }, evaluationController.schoolComments);
    server.get('/evaluations/:id', {
      preValidation: checkToken,
      schema: {
        tags: ['X-HIDDEN'],
      }
    }, evaluationController.get);
    server.post('/evaluations', {
      preValidation: checkToken,
      schema: {
        tags: ['X-HIDDEN'],
      }
    }, evaluationController.create);
    server.put('/evaluations/:id', {
      preValidation: checkToken,
      schema: {
        tags: ['X-HIDDEN'],
      }
    }, evaluationController.update);
    server.delete('/evaluations/:id', {
      preValidation: checkToken,
      schema: {
        tags: ['X-HIDDEN'],
      }
    }, evaluationController.delete);

    next();
  };

  module.exports = fp(EvaluationsRouter);