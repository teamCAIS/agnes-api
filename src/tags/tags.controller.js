const Tag = require('./tags.model');

class TagController {

    async get(request, reply) {
        try {
            const id = request.params.id;
            const tag = await Tag.findById(id);

            if(!user) {
                throw Error("Tag não encontrada");
            }
            
            return reply.code(200).send(tag);
        } catch (error) {
            return reply.status(400).send(error);
        }
    }

    async getAll(request, reply) {
        try {
            const tags = await Tag.find();
            
            return reply.code(200).send(tags);
        } catch (error) {
            return reply.status(400).send(error);
        }
    }

    async create(request, reply) {
        try {
            const {name} = request.body;

            const tag = new Tag({
                name,
            });
            await tag.save();

            return reply.code(200).send(tag);
        } catch (error) {
            return reply.status(400).send(error);
        }
    }

    async update(request, reply) {
        try {
            const id = request.params.id;
            const data = request.body;
            const tag = await Tag.updateOne({
                id,
            }, data);
            return reply.code(200).send(tag);
        } catch (error) {
            return reply.status(400).send(error);
        }
    }

    async delete(request, reply) {
        try {
            const id = request.params.id;
            await Tag.deleteOne({
                id,
            });
            return reply.code(200).send({
                ok: true,
            });
        } catch (error) {
            return reply.status(400).send(error);
        }
    }
}

const tagController = new TagController();

module.exports = tagController;