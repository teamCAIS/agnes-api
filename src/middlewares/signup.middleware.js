const User = require('../users/users.model');

const checkDuplicateEmail = async (request, reply) => {
  try {
    const user = await User.findOne({
      email: request.body.email,
    });

    if (user) {
      throw Error("Este e-mail já está sendo utilizado");
    }

    return;
  } catch (error) {
    return reply.status(400).send(error);
  }
};

module.exports = checkDuplicateEmail;