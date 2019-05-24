const errors = require('../lib/errors')

module.exports = {
  errorHandler
  // onError
}

// function onError(error, ctx) { }

async function errorHandler(ctx, next) {
  try {
    await next()
  } catch (err) {
    ctx.type = 'application/json'

    if (err instanceof errors.ValidationError) {
      ctx.body = { error: formatValidationError(err) }
      ctx.status = 422
    } else if (err instanceof errors.AppError) {
      ctx.body = { error: formatException(err) }
      ctx.status = err.status
    } else if (err.status && err.status >= 400 && err.status < 500) {
      ctx.body = { error: err.message }
      ctx.status = err.status
    }

    // emit error to retain the default behaviour in Koa
    ctx.app.emit('error', err, ctx)
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
