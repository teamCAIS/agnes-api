require('dotenv/config');
const User = require('./users.model');
const School = require('../schools/schools.model');

const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const SECRET_KEY = process.env.SECRET_KEY || 'custom_secret_key';

class UserController {
    async get(request, reply) {
        try {
            const id = request.params.id;
            const user = await User.findById(id);

            if (!user) {
                return reply.send(404);
            }

            return reply.code(200).send(user);
        } catch (error) {
            return reply.status(400).send(error);
        }
    }

    async getAll(request, reply) {
        try {
            const users = await User.find();
            
            return reply.code(200).send(users);
        } catch (error) {
            return reply.status(400).send(error);
        }
    }

    async create(request, reply) {
        try {
            const {password: passwordStr, name, email, school: schoolId} = request.body;

            const school = await School.findOne({
                _id: schoolId,
            });

            if (!school) {
                throw Error("Escola não encontrada");
            }

            const userData = {
                name,
                email,
                school: schoolId,
                password: bcrypt.hashSync(passwordStr, 8),
            };

            const user = new User(userData);
            await user.save();

            const token = jwt.sign({id: user.id}, SECRET_KEY);

            const {password, type, _v, ...result} = user._doc;

            const userResult = {
                ...result,
                token,
                school: {
                    ...school._doc,
                }
            };

            return reply.code(200).send(userResult);
        } catch (error) {
            return reply.status(400).send(error);
        }
    }

    async signIn(request, reply) {
        try {
            const data = request.body;
            const user = await User.findOne({
                email: data.email,
            });
            if (!user) {
                throw Error("Este e-mail não existe");
            } else {
                const userDoc = user._doc;
                const isPasswordOk = bcrypt.compareSync(data.password, userDoc.password);
                
                if (!isPasswordOk) {
                    throw Error("Senha incorreta");
                }

                const {password, type, _v, school: schoolId, ...userData} = userDoc;
                
                const school = await School.findOne({
                    _id: schoolId
                });
                
                if (!school) {
                    throw Error("Escola não encontrada");
                }

                const token = jwt.sign({id: userDoc._id}, SECRET_KEY);

                return reply.code(200).send({...userData, token, school: {
                    ...school._doc,
                }});
            }
        } catch (error) {
            return reply.status(400).send(error);
        }
    }

    async update(request, reply) {
        try {
            const id = request.params.id;
            const data = request.body;
            const user = await User.updateOne({
                id,
            }, data);
            return reply.code(200).send(user);
        } catch (error) {
            return reply.status(400).send(error);
        }
    }

    async delete(request, reply) {
        try {
            const id = request.params.id;
            await User.deleteOne({
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

const userController = new UserController();

module.exports = userController;