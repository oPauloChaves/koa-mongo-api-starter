/**
 * Set the params needed for pagination
 *
 * Examples
 *
 *    /users?page=2
 *    /users?page=2&limit=10 (only 10 items per page)
 *    /users?offset=5?limit=30
 */
module.exports = (ctx, next) => {
  if (ctx.method !== 'GET') {
    return next()
  }

  const { query } = ctx

  query.limit = parseInt(query.limit, 10) || 20
  query.skip = query.offset = parseInt(query.offset, 10) || 0

  if (query.page) {
    query.page = parseInt(query.page, 10)
    if (query.page < 1) {
      query.page = 1
    }
    query.skip = query.offset = (query.page - 1) * query.limit
  }

  return next()
}
