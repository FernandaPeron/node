const {
  validateEmailUsage,
  validateEmail,
  validateEmptyField,
  validateMinChars,
  validatePasswordConfirmation
} = require('../_shared/services/validators');

function userRegister() {
  return [
    validateEmailUsage(),
    validateEmail(),
    validateEmptyField('name'),
    validateMinChars('password', 4),
    validatePasswordConfirmation()
  ];
}

function userLogin() {
  return [
    validateEmail(),
    validateEmptyField('password')
  ];
}

module.exports = {
  userRegister,
  userLogin,
};
