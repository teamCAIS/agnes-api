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
        { name: 'student', description: 'End-points relacionados ao estudante' },
        { name: 'tag', description: 'End-points relacionados a tag' },
        { name: 'evaluation', description: 'End-points relacionados a avaliação' }
      ],
      definitions: {
        School: {
          type: 'object',
          required: ['email'],
          properties: {
            id: {type: 'string'},
            name: {type: 'string'},
            address: {type: 'string'},
            location: {type: 'point'},
            grade: {type: 'number'},
            tags: {type: 'array of tag'},
          }
        },
        Student: {
          type: 'object',
          required: ['name', 'email', 'password', 'school'],
          properties: {
            id: {type: 'string'},
            name: {type: 'string'},
            email: {type: 'string'},
            password: {type: 'string'},
            school: {type: 'School'},
            photo: {type: 'string'},
          },
        },
        Tag: {
          type: 'object',
          required: ['name', 'color'],
          properties: {
            id: {type: 'string'},
            name: {type: 'string'},
            color: {type: 'string'}
          }
        }
      },
    },
    securityDefinitions: {
      apiKey: {
        name: 'Authorization',
        type: 'apiKey',
        in: 'header'
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