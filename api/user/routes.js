const User = require('./model');
const { checkToken } = require('../auth/authService');
const router = require('express').Router();
const UserService = require('./userService');
const { returnError } = require('../_shared/services/errorHandler');
const { validateObjectId, commitValidation } = require('../_shared/services/validators');

// Get all
router.get('/', checkToken, async (request, response, next) => {
  try {
    const users = await User.find({}, '-password');

    response.status(200).json(users)
  } catch (error) {
    next(error);
  }
});

// Get user
router.get(
  '/:id',
  checkToken,
  validateObjectId('id'),
  commitValidation,
  async (request, response, next) => {
    try {
      const { id } = request.params;

      const user = await UserService.findById(id);

      response.status(200).json(user);
    } catch (error) {
      next(error);
    }
});

// Update user
router.patch(
  '/:id',
  checkToken,
  validateObjectId('id'),
  commitValidation,
  async (request, response, next) => {
    const { id } = request.params;
    const user = {
      name: request.body.name,
      approved: request.body.approved,
      salary: request.body.salary,
    };

    try {
      const updatedUser = UserService.updateUser(id, user, response);

      response.status(200).json(updatedUser);

    } catch (error) {
      next(error);
    }
});

// Delete user
router.delete(
  '/:id',
  checkToken,
  validateObjectId('id'),
  commitValidation,
  async (request, response, next) => {
    const { id } = request.params;

    try {
      await UserService.deleteUser(id);

      response.status(200).json({ message: 'User removed' });
    } catch (error) {
      next(error);
    }
});

router.use(returnError);

module.exports = router;
