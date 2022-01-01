const Evaluation = require('./evaluations.model');
const Tag = require('../tags/tags.model');
const School = require('../schools/schools.model');
const User = require('../users/users.model');

class EvaluationController {
    async hasEvaluated(request, reply) {
        try {
            const {student: studentId, school: schoolId} = request.query;

            if (!studentId) {
                throw Error("Insira o id do estudante");
            }

            if (!schoolId) {
                throw Error("Insira o id da escola");
            }

            const evaluation = await Evaluation.findOne({
                student: studentId,
                school: schoolId,
            });

            if (evaluation) {
                return reply.code(200).send({evaluated: true});
            }

            return reply.code(200).send({evaluated: false});
        } catch (error) {
            return reply.status(400).send(error);
        }
    }

    async schoolComments(request, reply) {
        try {
            const {school: schoolId, page, limit} = request.query;

            if (!schoolId) {
                throw Error("Insira o id da escola");
            }

            let comments;
            const select = ['_id', 'grade', 'comment', 'createdAt'];

            if (page) {
                const options = {
                    page,
                    limit,
                    select
                };

                comments = await Evaluation.paginate({school: schoolId,}, options);
            } else {
                comments = await Evaluation.find({
                    school: schoolId,
                }).select(select);
            }

            return reply.code(200).send(comments);
        } catch (error) {
            return reply.status(400).send(error);
        }
    }

    async get(request, reply) {
        try {
            const id = request.params.id;
            const evaluation = await Evaluation.findById(id);

            if (!evaluation) {
                return reply.send(404);
            }

            return reply.code(200).send(evaluation);
        } catch (error) {
            return reply.status(400).send(error);
        }
    }

    async getAll(request, reply) {
        try {
            const evaluations = await Evaluation.find();
            
            return reply.code(200).send(evaluations);
        } catch (error) {
            return reply.status(400).send(error);
        }
    }

    async create(request, reply) {
        try {
            const {student: studentId, school: schoolId, grade, comment, tags} = request.body;

            const student = await User.findById(studentId);

            if (!student) {
                throw Error("Estudante não encontrado");
            }

            const school = await School.findById(schoolId);

            if (!school) {
                throw Error("Escola não encontrada");
            }

            if (!student.school.equals(school._id)) {
                throw Error("O estudante não pertence a esta escola");
            }

            const alreadyEvaluated = await Evaluation.findOne({
                student: studentId,
                school: schoolId,
            });

            if (alreadyEvaluated) {
                throw Error("O estudante já avaliou a escola");
            }

            const correctTags = [];

            for (const tagId of tags) {
                const tag = await Tag.findById(tagId);

                if (!tag) {
                    throw Error(`Tag ${tagId} não encontrada`);
                }

                correctTags.push(tag);
            }

            for (const correctTag of correctTags) {
                const hasTag = await School.findOne({
                    _id: school._id,
                    'tags.tag': correctTag._id,
                });

                if (hasTag) {
                    hasTag.tags = hasTag.tags.map(tag => {
                        if (tag.tag.equals(correctTag._id)) {
                            tag.count = tag.count + 1;
                        }

                        return tag;
                    });
                    await hasTag.save();
                } else {
                  school.tags.push({
                    tag: correctTag._id,
                    count: 1,
                  });

                  await school.save();
                }
            }

            const evaluationsGrade = await Evaluation.find({
                school: school._id,
            });

            const gradesSum = (evaluationsGrade.map(evaluation => evaluation.grade).reduce((a, b) => a + b, 0)) + grade;
            const newGrade = parseFloat(gradesSum / (evaluationsGrade.length + 1)).toFixed(2);

            school.grade = newGrade;
            await school.save();

            const evaluation = new Evaluation({
                student: student.id,
                school: school.id,
                grade, comment,
                tags: tags,
            });
            await evaluation.save();

            return reply.code(200).send(evaluation);
        } catch (error) {
            return reply.status(400).send(error);
        }
    }

    async update(request, reply) {
        try {
            const id = request.params.id;
            const data = request.body;
            const evaluation = await Evaluation.updateOne({
                id,
            }, data);
            return reply.code(200).send(evaluation);
        } catch (error) {
            return reply.status(400).send(error);
        }
    }

    async delete(request, reply) {
        try {
            const id = request.params.id;
            await Evaluation.deleteOne({
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

const evaluationController = new EvaluationController();

module.exports = evaluationController;