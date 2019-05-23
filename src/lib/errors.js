const { ValidationError } = require('yup')

class DuplicateKeyError extends Error {
  constructor(...params) {
    super(...params)
    if (Error.captureStackTrace)
      Error.captureStackTrace(this, DuplicateKeyError)
    this.name = 'DuplicateKeyError'
  }
}

class UnauthorizedError extends Error {
  constructor(...params) {
    super(...params)
    if (Error.captureStackTrace)
      Error.captureStackTrace(this, UnauthorizedError)
    this.name = 'UnauthorizedError'
  }
}

class ForbiddenError extends Error {
  constructor(...params) {
    super(...params)
    if (Error.captureStackTrace) Error.captureStackTrace(this, ForbiddenError)
    this.name = 'ForbiddenError'
  }
}

class NotFoundError extends Error {
  constructor(...params) {
    super(...params)
    if (Error.captureStackTrace) Error.captureStackTrace(this, NotFoundError)
    this.name = 'NotFoundError'
  }
}

class ServerError extends Error {
  constructor(...params) {
    super(...params)
    if (Error.captureStackTrace) Error.captureStackTrace(this, ServerError)
    this.name = 'ServerError'
  }
}

module.exports = {
  UnauthorizedError, // 401
  ForbiddenError, // 403
  NotFoundError, // 404
  ValidationError, // 422
  DuplicateKeyError, // 422
  ServerError // 500
}
