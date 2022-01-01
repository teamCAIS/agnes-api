
const fp = require('fastify-plugin');
const schoolsController = require('../schools/schools.controller');
const checkToken = require('../middlewares/auth.middleware');

const SchoolsRouter = async (server, options, next) => {
    server.get('/schools', {
      schema: {
        description: 'End-point para buscar escolas com filtros',
        tags: ['school'],
        summary: 'Listar escolas',
        query: {
          type: 'object',
          properties: {
            page: {
              type: 'number',
              description: 'Paginação (EX: "1")',
            },
            limit: {
              type: 'number',
              description: 'Limite de documentos por página (EX: "10")',
            },
            search: {
              type: 'string',
              description: 'Nome da escola (EX: "Colegio")',
            },
            coordinates: {
              type: 'string',
              description: 'Coordenadas do usuário (EX: "-3.727287,-38.544684")',
            },
            radius: {
              type: 'number',
              description: 'Raio de busca em KM (EX: "1")',
            },
            grade: {
              type: 'number',
              description: 'Escolas com nota maior que (Ex: "3.0")'
            },
            tags: {
              type: 'string',
              description: 'IDs de tags (Ex: "61c5f158b8d02f37f0f57101,61c5f158b8d02f37f0f57100")'
            }
          }
        }
      }
    }, schoolsController.getAll);
    server.get('/schools/:id', {
      preValidation: checkToken,
      schema: {
        tags: ['X-HIDDEN'],
      }
    }, schoolsController.get);
    server.post('/schools', {
      preValidation: checkToken,
      schema: {
        tags: ['X-HIDDEN'],
      }
    }, schoolsController.create);
    server.put('/schools/:id', {
      preValidation: checkToken,
      schema: {
        tags: ['X-HIDDEN'],
      }
    }, schoolsController.update);
    server.delete('/schools/:id', {
      preValidation: checkToken,
      schema: {
        tags: ['X-HIDDEN'],
      }
    }, schoolsController.delete);

    next();
  };

  module.exports = fp(SchoolsRouter);