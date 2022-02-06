const User = require('../user/model');
const HttpStatusCode = require('../_shared/enums/httpStatusCode');
const BaseError = require('../_shared/entities/baseError');

async function findById(id) {
  const user = await User.findById(id, '-password');

  if (!user) {
    throw new BaseError(HttpStatusCode.NOT_FOUND, 'User not found');
  }

  return user;
}

async function updateUser(id, user) {
  const updatedUser = await User.updateOne({ _id: id }, user);

  if (!updatedUser.matchedCount) {
    throw new BaseError(HttpStatusCode.NOT_FOUND, 'User not found');
  }

  return updatedUser;
}

async function deleteUser(id) {
  const user = await User.findById(id);

  if (!user) {
    throw new BaseError(HttpStatusCode.NOT_FOUND, 'User not found');
  }

  await User.deleteOne({ _id: id });
}

module.exports = {
  findById,
  updateUser,
  deleteUser,
}
