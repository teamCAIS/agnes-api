require('dotenv/config');

const jwt = require('jsonwebtoken');

const SECRET_KEY = process.env.SECRET_KEY || 'custom_secret_key';

const checkToken = async (request, reply, next) => {
  try {
    const fullToken = request.headers["Authorization"] || request.headers["authorization"];
    const [type, token] = fullToken.split(' ');

    if (!token) {
        throw Error("Envie o token na requisição");
    }

    console.log(token);

    jwt.verify(token, SECRET_KEY, (err, decoded) => {
        if (err) {
            throw Error("Token inválido");
        }

        request.userId = decoded.id;
        next();
    });
  } catch (error) {
    return reply.status(400).send(error);
  }
};

module.exports = checkToken;