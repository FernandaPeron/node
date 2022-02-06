const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const User = require('../user/model');
const BaseError = require('../_shared/entities/baseError');
const HttpStatusCode = require('../_shared/enums/httpStatusCode');

function checkToken(req, res, next) {
  const token = req.headers['authorization'];

  if (!token) {
    res.status(401).json({ errors: ['not authorized'] });
    return;
  }

  try {
    const secret = process.env.SECRET;

    jwt.verify(token, secret);

    next();
  } catch (error) {
    res.status(400).json({ errors: ['Invalid token'] });
  }

}

function generateToken(user) {
  const secret = process.env.SECRET;
  return jwt.sign(
    {
      id: user._id,
    },
    secret,
  );
}

async function register(body) {
  const salt = await bcrypt.genSalt(12);
  const passwordHash = await bcrypt.hash(body.password, salt);

  const user = new User({
    name: body.name,
    email: body.email,
    password: passwordHash,
  });

  return User.create(user);
}

async function login(body) {
  const user = await User.findOne({ email: body.email });

  if (!user) {
    throw new BaseError(HttpStatusCode.UNPROCESSABLE_REQUEST, 'This e-mail does not exist in our database');
  }

  const isPasswordCorrect = await bcrypt.compare(body.password, user.password);

  if (!isPasswordCorrect) {
    throw new BaseError(HttpStatusCode.UNPROCESSABLE_REQUEST, 'Invalid password');
  }

  return generateToken(user);
}

module.exports = {
  checkToken,
  register,
  login,
};
