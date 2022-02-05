const jwt = require('jsonwebtoken');

function checkToken(req, res, next) {
  const token = req.headers['authorization'];

  if (!token) {
    res.status(401).json('not authorized');
  }

  try {
    const secret = process.env.SECRET;

    jwt.verify(token, secret);

    next();
  } catch (error) {
    res.status(400).json('Invalid token');
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

module.exports = {
  checkToken,
  generateToken,
};
