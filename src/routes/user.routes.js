
const fp = require('fastify-plugin');
const checkEmail = require('../middlewares/signup.middleware');
const userController = require('../users/users.controller');

const UserRouter = async (server, options) => {
    server.post('/students', {
      schema: {
        description: 'End-point para criar novo usuário estudante',
        tags: ['student'],
        summary: 'Criar estudante',
        body: {
          type: 'object',
          properties: {
            name: {
              type: 'string',
              description: 'Nome do(a) estudante (EX: "Maria")',
            },
            email: {
              type: 'string',
              description: 'E-mail do(a) estudante (EX: "maria@estudante.com")',
            },
            password: {
              type: 'string',
              description: 'Senha para login',
            },
            school: {
              type: 'string',
              description: 'ID da escola do(a) estudante (EX: "61c5f158b8d02f37f0f57101")',
            },
          }
        }
      },
      preValidation: checkEmail,
    }, userController.create);
    server.post('/authentication', {
      schema: {
        description: 'End-point para logar numa conta',
        tags: ['student'],
        summary: 'Logar na conta',
        body: {
          type: 'object',
          properties: {
            email: {
              type: 'string',
              description: 'E-mail do(a) estudante (EX: "maria@estudante.com")',
            },
            password: {
              type: 'string',
              description: 'Senha para login',
            },
          },
        }
      }
      }, userController.signIn);
  };

  module.exports = fp(UserRouter);