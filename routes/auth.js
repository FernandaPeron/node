const router = require('express').Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user')

router.post('/register', async (request, response) => {
  const body = {
    name: request.body.name,
    email: request.body.email,
    password: request.body.password,
    confirmPassword: request.body.confirmPassword,
  };

  const salt = await bcrypt.genSalt(12);
  const passwordHash = await bcrypt.hash(body.password, salt);

  const user = new User({
    name: body.name,
    email: body.email,
    password: passwordHash,
  });

  try {
    await User.create(user);
    response.status(200).json('User successfully registered');
  } catch (error) {
    response.status(500).json(error.message);
  }
});

router.post('/login', async (request, response) => {
  const body = {
    email: request.body.email,
    password: request.body.password,
  };

  const user = await User.findOne({ email: body.email });

  const isPasswordCorrect = await bcrypt.compare(body.password, user.password);

  if (!isPasswordCorrect) {
    response.status(422).json('Password not correct');
    return;
  }

  try {
    const secret = process.env.SECRET;

    const token = jwt.sign(
      {
        id: user._id,
      },
      secret,
    );

    response.status(200).json(token);
  } catch (error) {
    response.status(500).json(error.message);
  }

});

module.exports = router;
