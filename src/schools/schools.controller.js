const schoolModel = require('./schools.model');

class SchoolController {
    async get(request, reply) {
        reply.code(200).send({ok: true});
        // try {
        //     const ID = request.params.id;
        //     const { Blog } = server.db.models;
        //     const blog = await Blog.findById(ID);
        //     if (!blog) {
        //         return reply.send(404);
        //     }
        //     return reply.code(200).send(blog);
        // } catch (error) {
        //     request.log.error(error);
        //     return reply.send(400);
        // }
    }

    async getAll(request, reply) {
        const location = {
            type: "location",
            coordinates: [-38.5360525, -3.7443675],
        };

        reply.code(200).send({
          name: 'Instituto Federal de Educação, Ciência e Tecnologia do Ceará - IFCE',
          address: 'Avenida 13 de maio',
          location,
          grade: 0.0
        });
    }

    async create() {

    }

    async update() {

    }

    async delete() {

    }
}

const schoolController = new SchoolController();

module.exports = schoolController;