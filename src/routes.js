const Router = require('koa-router')
const router = new Router()
const api = new Router()

const users = require('./domain/users/routes')

api.use(users)

router.get('/', ctx => {
  ctx.body = 'OK'
})

router.use('/api', api.routes())

module.exports = router
