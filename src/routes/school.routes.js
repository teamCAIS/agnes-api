
const fp = require('fastify-plugin');
const schoolsController = require('../schools/schools.controller');

const SchoolsRouter = async (server, options) => {
    server.get('/schools', {
      schema: {
        description: 'End-point para buscar escolas com filtros',
        tags: ['school'],
        summary: 'Listar escolas',
        query: {
          type: 'object',
          properties: {
            search: {
              type: 'string',
              description: 'Nome da escola (EX: "Colegio")',
              default: 'Colegio'
            },
            coordinates: {
              type: 'string',
              description: 'Coordenadas do usuário (EX: "-3.727287,-38.544684")',
              default: '-3.727287,-38.544684'
            },
            radius: {
              type: 'number',
              description: 'Raio de busca em KM (EX: "1")',
              default: 1,
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
      schema: {
        tags: ['X-HIDDEN'],
      }
    }, schoolsController.get);
    server.post('/schools', {
      schema: {
        tags: ['X-HIDDEN'],
      }
    }, schoolsController.create);
    server.put('/schools/:id', {
      schema: {
        tags: ['X-HIDDEN'],
      }
    }, schoolsController.update);
    server.delete('/schools/:id', {
      schema: {
        tags: ['X-HIDDEN'],
      }
    }, schoolsController.delete);
  };

  module.exports = fp(SchoolsRouter);