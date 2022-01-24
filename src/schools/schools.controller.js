const School = require('./schools.model');

function getDistance(lat1, lon1, lat2, lon2) {
    if ((lat1 == lat2) && (lon1 == lon2)) {
        return 0;
    }

    const radlat1 = Math.PI * lat1/180;
    const radlat2 = Math.PI * lat2/180;
    const theta = lon1-lon2;
    const radtheta = Math.PI * theta/180;
    let dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
    if (dist > 1) {
        dist = 1;
    }
    dist = Math.acos(dist);
    dist = dist * 180/Math.PI;
    dist = dist * 60 * 1.1515;
    return dist * 1.609344;
}

function addDistanceToSchools(docs, coordinatesStr) {
    const orderedDocs = [];
    for (const school of docs) {
        if (school.location && school.location.coordinates && school.location.coordinates.length === 2 && coordinatesStr) {
            const [latitude, longitude] = coordinatesStr.split(',');
            if (latitude, longitude) {
                const [schoolLong, schoolLat] = school.location.coordinates;
                const distance = getDistance(schoolLat, schoolLong, latitude, longitude).toFixed(1);
                orderedDocs.push({
                    ...school,
                    distance,
                });
            } else {
                orderedDocs.push(school);
            }
        } else {
            orderedDocs.push(school);
        };
    };

    return orderedDocs;
}

function sortByDistance(a, b) {
    if (parseFloat(a.distance) < parseFloat(b.distance)) {
        return -1;
    }

    if (parseFloat(a.distance) > parseFloat(b.distance)) {
        return 1;
    }

    return 0;
}

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

            where["tags.tag"] = {
                $in: tags,
            };
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
                
                schools = await School.find(where);
                const docs = schools.map(school => school._doc);
                const orderedDocs = addDistanceToSchools(docs, coordinatesStr).sort(sortByDistance);
                schools = orderedDocs;
                const hasNextPage = (page * limit) < schools.length;
                const hasPrevPage = page > 1;
                const totalPages = Math.floor(schools.length / limit) + 1;
                const limitedSchools = schools.slice((page * limit) - limit, limit * page);
                return reply.code(200).send({
                  docs: limitedSchools, 
                  limit: parseInt(limit),
                  totalDocs: schools.length,
                  page: parseInt(page),
                  hasNextPage,
                  hasPrevPage,
                  totalPages,
                  prevPage: page <= 1 ? null : page - 1,
                  nextPage: hasNextPage ? page + 1 : null,
                });
            } else {
                if (sortAlphabetically) {
                    schools = await School.find(where).sort('name');
                } else {
                    schools = await School.find(where);
                }
                schools = schools.map(school => school._doc);
                schools = addDistanceToSchools(schools, coordinatesStr).sort(sortByDistance);
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