
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
        description: 'End-point para checar se estudante avaliou escola',
        tags: ['evaluation'],
        summary: 'Checar avaliação',
        query: {
          type: 'object',
          properties: {
            school: {
              type: 'string',
              description: 'ID da escola (EX: "61c5f158b8d02f37f0f57101")',
            },
            student: {
              type: 'string',
              description: 'ID do(a) estudante (EX: "61c5f158b8d02f37f0f57101")',
            },
          }
        }
      }
    }, evaluationController.hasEvaluated);
    server.get('/evaluations/comments', {
      preValidation: checkToken,
      schema: {
        description: 'End-point para buscar comentários e notas por escola',
        tags: ['evaluation'],
        summary: 'Listar comentários e notas de uma escola',
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
            school: {
              type: 'string',
              description: 'ID da escola (EX: "61c5f158b8d02f37f0f57101")',
            },
          }
        }
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
        description: 'End-point para avaliar escola',
        tags: ['evaluation'],
        summary: 'Avaliar escola',
        body: {
          type: 'object',
          properties: {
            student: {
              type: 'string',
              description: 'ID do(a) estudante (EX: "61c5f158b8d02f37f0f57101")',
            },
            school: {
              type: 'string',
              description: 'ID da escola (EX: "61c5f158b8d02f37f0f57101")',
            },
            grade: {
              type: 'number',
              description: 'Nota da avaliação',
            },
            comment: {
              type: 'string',
              description: 'Comentário sobre a escola',
            },
            tags: {
              type: 'array',
              description: 'Array de IDs de tags (EX: "["61c5f158b8d02f37f0f57101"]")',
            },
          }
        }
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