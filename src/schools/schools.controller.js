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
            return reply.status(400).send(error);
        }
    }

    async getAll(request, reply) {
        const {
            search, 
            coordinates: coordinatesStr, 
            grade: gradeStr, 
            tags: tagsStr, 
            radius, 
            page, 
            limit = 10
        } = request.query;

        const where = {};
        let sortAlphabetically = false;

        if (search) {
            where.name = { '$regex' : search, '$options' : 'i' }
        }

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

            if (page) {
                let options = {
                    page,
                    limit,
                    populate: {
                        path: 'tags',
                        populate: {
                            path: 'tag',
                            select: ['_id', 'name', 'color']
                        },
                    }
                };

                if (sortAlphabetically) {
                    options.sort = 'name';
                }
                
                const tempSchools = await School.find(where);
                const ids = tempSchools.map(school => school._id);

                schools = await School.paginate({
                    '_id': {
                        $in: ids
                    },
                }, options);
            } else {
                if (sortAlphabetically) {
                    schools = await School.find(where).sort('name');
                } else {
                    schools = await School.find(where);
                }
            }
            
            return reply.code(200).send(schools);
        } catch (error) {
            return reply.status(400).send(error);
        }
    }

    async create(request, reply) {
        try {
            const data = request.body;
            const school = await School.create(data);
            return reply.code(200).send(school);
        } catch (error) {
            return reply.status(400).send(error);
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
            return reply.status(400).send(error);
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
            return reply.status(400).send(error);
        }
    }
}

const schoolController = new SchoolController();

module.exports = schoolController;