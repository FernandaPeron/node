const router = require('express').Router();
const { commitValidation } = require('../_shared/services/validators');
const AuthValidators = require('./validators');
const AuthService = require('../auth/authService');
const { returnError } = require('../_shared/services/errorHandler');

router.post(
  '/register',
  AuthValidators.userRegister(),
  commitValidation,
  async (request, response, next) => {

    const body = {
      name: request.body.name,
      email: request.body.email,
      password: request.body.password,
    };

    try {
      await AuthService.register(body);
      response.status(200).json({ message: 'User successfully registered' });
    } catch (error) {
      next(error);
    }
});

router.post(
  '/login',
  AuthValidators.userLogin(),
  commitValidation,
  async (request, response, next) => {

    const body = {
      email: request.body.email,
      password: request.body.password,
    };

    try {
      const token = await AuthService.login(body);

      response.status(200).json(token);
    } catch (error) {
      next(error);
    }
});

router.use(returnError);

module.exports = router;
