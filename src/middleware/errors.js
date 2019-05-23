const http = require('http')
const errors = require('../lib/errors')
let constants = require('../lib/constants')

Object.entries(http.STATUS_CODES).forEach(([key, value]) => {
  constants.HTTP[key] = value.toUpperCase().replace(/\s/gim, '_')
})

module.exports = async (ctx, next) => {
  try {
    await next()
    if (Number(ctx.response.status) === 404 && !ctx.response.body) {
      ctx.throw(404)
    }
  } catch (err) {
    ctx.type = 'application/json'

    if (!ctx.response.body) {
      ctx.response.body = { errors: {} }
    }

    console.error(err)

    switch (true) {
      case err instanceof errors.ValidationError: {
        ctx.body.errors = formatValidationError(err)
        ctx.status = err.status || 422
        break
      }

      case err instanceof errors.DuplicateKeyError: {
        ctx.body.errors = formatException(err)
        ctx.status = err.status || 422
        break
      }

      case err instanceof errors.UnauthorizedError || err.status === 401: {
        ctx.body.errors = formatException(err)
        ctx.status = err.status || 401
        break
      }

      default:
        ctx.status = err.status || 500
        break
    }
  }
}

function formatValidationError(err) {
  const result = {}
  if (err.path) {
    result[err.path] = err.message || 'is not valid'
  }
  if (err.inner && err.inner.length > 0) {
    err.inner
      .map(err => formatValidationError(err))
      .reduce((prev, curr) => Object.assign(prev, curr), result)
  }
  return result
}

/**
 * Format the given `err` before sending it out to the client
 *
 * It checks if the error message is in the following format:
 *
 * `Name;Some error message`
 *
 * It tries to extract the content before `;`, if it succeeds,
 * it builds an object where the first part is the key and
 * the remaining is the value.
 *
 * `{key: value}`
 *
 * If the error doesn't attend the above format, then it just
 * returns the message
 *
 * @param {Error}  err The error thrown
 * @return {Object|String} An object if the message is in the explained format
 *                         or just a string if not
 */
function formatException(err) {
  let path = 'unknown'
  let message = err.message
  const idx = err.message.indexOf(';')
  if (idx !== -1) {
    path = err.message.substring(0, idx)
    message = err.message.substring(idx + 1)
    return { [path]: message }
  }
  return message
}
