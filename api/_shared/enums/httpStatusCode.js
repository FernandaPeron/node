const HttpStatusCode = Object.freeze({
  OK: 200,
  BAD_REQUEST: 400,
  UNPROCESSABLE_REQUEST: 422,
  NOT_FOUND: 404,
  INTERNAL_SERVER: 500,
});

module.exports = HttpStatusCode;
