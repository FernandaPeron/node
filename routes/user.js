const User = require('../models/user');
const { checkToken } = require('../services/authService');
const router = require('express').Router();

// Get all
router.get('/', checkToken, async (request, response) => {
  try {
    const users = await User.find({}, '-password');

    response.status(200).json(users)
  } catch (error) {
    response.status(500).json(error.message);
  }
});

// Get user
router.get('/:id', checkToken, async (request, response) => {
  try {
    const { id } = request.params;
    const user = await User.findOne({ _id: id }, '-password');

    if (!user) {
      response.status(404).json({ message: 'User not found' });
      return;
    }

    response.status(200).json(user);
  } catch (error) {
    response.status(500).json(error.message);
  }
});

// Update user
router.patch('/:id', checkToken, async (request, response) => {
  const { id } = request.params;
  const user = {
    name: request.body.name,
    approved: request.body.approved,
    salary: request.body.salary,
  };

  try {
    const updatedUser = await User.updateOne({ _id: id }, user);

    if (!updatedUser.matchedCount) {
      response.status(404).json({ message: 'User not found' });
    }

    response.status(200).json(updatedUser);

  } catch (error) {
    response.status(500).json(error.message);
  }
});

// Delete user
router.delete('/:id', checkToken, async (request, response) => {
  const { id } = request.params;

  try {
    const user = await User.findOne({ _id: id });

    if (!user) {
      response.status(404).json({ message: 'User not found' });
      return;
    }

    await User.deleteOne({ _id: id });

    response.status(200).json({ message: 'User removed' });
  } catch (error) {
    response.status(500).json(error.message);
  }
});

module.exports = router;
