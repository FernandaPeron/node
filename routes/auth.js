const router = require('express').Router();
const bcrypt = require('bcrypt');
const User = require('../models/user');
const { validationResult } = require('express-validator');
const { generateToken } = require('../services/authService');
const {
  validateEmailUsage,
  validateEmail,
  validateEmptyField,
  validateMinChars,
  validatePasswordConfirmation
} = require('../services/validations');

router.post(
  '/register',
  validateEmailUsage(),
  validateEmail(),
  validateEmptyField('name'),
  validateMinChars('password', 4),
  validatePasswordConfirmation(),
  async (request, response) => {

    const validations = validationResult(request);
    if (!validations.isEmpty()) {
      response.status(400).json({ errors: validations.errors.map(error => error.msg) });
      return;
    }

    const { name, email, password } = request.body;

    const salt = await bcrypt.genSalt(12);
    const passwordHash = await bcrypt.hash(password, salt);

    const user = new User({
      name,
      email,
      password: passwordHash,
    });

    try {
      await User.create(user);
      response.status(200).json({ message: 'User successfully registered' });
    } catch (error) {
      response.status(500).json({ message: error.message });
    }
});

router.post(
  '/login',
  validateEmail(),
  validateEmptyField('password'),
  async (request, response) => {

    const validations = validationResult(request);
    if (!validations.isEmpty()) {
      response.status(400).json({ errors: validations.errors.map(error => error.msg) });
      return;
    }

    const { email, password } = request.body;

    const user = await User.findOne({ email: email });

    if (!user) {
      response.status(422).json({ message: 'This e-mail does not exist in our database' });
      return;
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password);

    if (!isPasswordCorrect) {
      response.status(422).json({ message: 'Invalid password' });
      return;
    }

    try {
      const token = generateToken(user);

      response.status(200).json(token);
    } catch (error) {
      response.status(500).json({ message: error.message });
    }
});

module.exports = router;
