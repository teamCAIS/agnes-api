
const fp = require('fastify-plugin');
const tagsController = require('../tags/tags.controller');
const checkToken = require('../middlewares/auth.middleware');

const TagsRouter = async (server, options, next) => {
    server.get('/tags', {
      preValidation: checkToken,
      schema: {
        description: 'End-point para buscar tags',
        tags: ['tag'],
        summary: 'Listar tags',
      }
    }, tagsController.getAll);
    server.get('/tags/:id', {
      preValidation: checkToken,
      schema: {
        tags: ['X-HIDDEN'],
      }
    }, tagsController.get);
    server.post('/tags', {
      preValidation: checkToken,
      schema: {
        tags: ['X-HIDDEN'],
      }
    }, tagsController.create);
    server.put('/tags/:id', {
      preValidation: checkToken,
      schema: {
        tags: ['X-HIDDEN'],
      }
    }, tagsController.update);
    server.delete('/tags/:id', {
      preValidation: checkToken,
      schema: {
        tags: ['X-HIDDEN'],
      }
    }, tagsController.delete);

    next();
  };

  module.exports = fp(TagsRouter);