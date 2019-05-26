const Router = require('koa-router')
const controller = require('./controller')
const jwt = require('../../middleware/jwt')

const router = new Router()

router.get('/users', jwt, controller.list)
router.post('/users', controller.register)
router.put('/users/:id', jwt, controller.update)
router.post('/login', controller.login)

module.exports = router.routes()
