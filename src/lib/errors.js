const { ValidationError } = require('yup')

class AppError extends Error {
  constructor(message, statusCode) {
    super(message)

    this.name = this.constructor.name
    this.status = statusCode

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor)
    }
  }
}

class DuplicateKeyError extends AppError {
  constructor(message) {
    super(message, 422)
  }
}

class UnauthorizedError extends AppError {
  constructor(message) {
    super(message, 401)
  }
}

class ForbiddenError extends AppError {
  constructor(message) {
    super(message, 403)
  }
}

class NotFoundError extends AppError {
  constructor(message) {
    super(message, 404)
  }
}

class InternalServerError extends AppError {
  constructor(message) {
    super(message, 500)
  }
}

module.exports = {
  AppError,
  UnauthorizedError,
  ForbiddenError,
  NotFoundError,
  ValidationError,
  DuplicateKeyError,
  InternalServerError
}
