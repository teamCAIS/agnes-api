const swaggerConfig = {
    routePrefix: '/docs',
    swagger: {
      info: {
        title: 'AGNES API',
        description: 'Documentação do sistema AGNES',
        version: '1.0.0'
      },
      host: 'agnes-api.herokuapp.com',
      schemes: ['http'],
      consumes: ['application/json'],
      produces: ['application/json'],
      tags: [
        { name: 'school', description: 'End-points relacionados a escola' },
        { name: 'user', description: 'End-points relacionados ao usuário' },
        { name: 'evaluation', description: 'End-points relacionados a avaliação' }
      ],
      definitions: {
        School: {
          type: 'object',
          required: ['id', 'email'],
          properties: {
            id: {type: 'string'},
            name: {type: 'string'},
            address: {type: 'string'},
            location: {type: 'point'},
            grade: {type: 'number'},
            tags: {type: 'array of tag'},
          }
        }
      },
      securityDefinitions: {
        apiKey: {
          type: 'apiKey',
          name: 'apiKey',
          in: 'header'
        }
      }
    },
    uiConfig: {
      docExpansion: 'full',
      deepLinking: false
    },
    uiHooks: {
      onRequest: function (request, reply, next) { next() },
      preHandler: function (request, reply, next) { next() }
    },
    staticCSP: true,
    transformStaticCSP: (header) => header,
    exposeRoute: true
};

module.exports = swaggerConfig;