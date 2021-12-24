const School = require('./schools.model');

class SchoolController {
    async get(request, reply) {
        try {
            const id = request.params.id;
            const school = await School.findById(id);

            if (!school) {
                return reply.send(404);
            }

            return reply.code(200).send(school);
        } catch (error) {
            request.log.error(error);
            return reply.send(400);
        }
    }

    async getAll(request, reply) {
        const {coordinates: coordinatesStr, grade: gradeStr, tags: tagsStr, radius} = request.query;
        const where = {};
        let sortAlphabetically = false;

        if (coordinatesStr) {
            const [latitude, longitude] = coordinatesStr.split(',');
            const coordinates = [longitude, latitude];

            if (!radius && !latitude && !longitude) {
                sortAlphabetically = true;
            } else if (radius && latitude && longitude) {
                const kmRadius = parseInt(radius) * 1000;
                where.location = {
                    $near: {
                        $geometry: {
                            type: "Point",
                            coordinates,
                        },
                        $maxDistance: kmRadius,
                    },
                }
            }
        }

        if (tagsStr) {
            const tags = tagsStr.split(',');
        }

        if (gradeStr) {
            where.grade = {
                $gte: parseFloat(gradeStr),
            }
        }

        try {
            let schools;

            if (sortAlphabetically) {
                schools = await School.find(where).sort('name');
            } else {
                schools = await School.find(where);
            }
            return reply.code(200).send(schools);
        } catch (error) {
            request.log.error(error);
            return reply.send(400);
        }
    }

    async create(request, reply) {
        try {
            const data = request.body;
            const school = await School.create(data);
            return reply.code(200).send(school);
        } catch (error) {
            request.log.error(error);
            return reply.send(400);
        }
    }

    async update(request, reply) {
        try {
            const id = request.params.id;
            const data = request.body;
            const school = await School.updateOne({
                id,
            }, data);
            return reply.code(200).send(school);
        } catch (error) {
            request.log.error(error);
            return reply.send(400);
        }
    }

    async delete(request, reply) {
        try {
            const id = request.params.id;
            await School.deleteOne({
                id,
            });
            return reply.code(200).send({
                ok: true,
            });
        } catch (error) {
            request.log.error(error);
            return reply.send(400);
        }
    }
}

const schoolController = new SchoolController();

module.exports = schoolController;