const { check } = require('express-validator');
const User = require('../models/user');

function validateEmailUsage() {
  return check('email').custom((value) => {
    return User.findOne({ email: value }).then((user) => {
      if (user) return Promise.reject('E-mail already in use');
    });
  });
}

function validateEmail() {
  return check('email').isEmail().withMessage('Enter a valid e-mail');
}

function validateEmptyField(field) {
  return check(field).notEmpty()
    .withMessage(`${field} can not be empty`);
}

function validateMinChars(field, min) {
  return check(field).isLength({ min })
    .withMessage(`${field} must be at least ${min} chars long`);
}

function validatePasswordConfirmation() {
  return check('confirmPassword').custom((value, { req }) => {
    if (value !== req.body.password) {
      throw new Error('Password confirmation does not match password');
    }
    return true;
  });
}

module.exports = {
  validateEmailUsage,
  validateEmail,
  validateEmptyField,
  validateMinChars,
  validatePasswordConfirmation,
};
