require('dotenv/config');

const jwt = require('jsonwebtoken');

const SECRET_KEY = process.env.SECRET_KEY || 'custom_secret_key';

const checkToken = async (request, reply) => {
  try {
    const fullToken = request.headers["Authorization"] || request.headers["authorization"];
    if (!fullToken) {
      throw Error("Envie o token na requisição");
    }

    const [type, token] = fullToken.split(' ');

    if (!token) {
        throw Error("Envie o token na requisição");
    }

    jwt.verify(token, SECRET_KEY, (err, decoded) => {
        if (err) {
            throw Error("Token inválido");
        }

        request.userId = decoded.id;
        return;
    });
  } catch (error) {
    return reply.status(400).send(error);
  }
};

module.exports = checkToken;