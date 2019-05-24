const User = require('./model')
const { generateToken } = require('../../lib/helpers')
const { UnauthorizedError } = require('../../lib/errors')
const { loginSchema, userSchema } = require('./schema')

module.exports = {
  async list(ctx) {
    const { skip, limit } = ctx.query

    const users = await User.list({ skip, limit })

    ctx.body = users
  },

  /**
   * Registers a new user and logs him in by returnin a token
   */
  async register(ctx) {
    const { body } = ctx.request
    let { user = {} } = body

    const opts = { abortEarly: false, context: { validatePassword: true } }

    user = await userSchema.validate(user, opts)

    user = await new User(user).save()

    ctx.status = 201
    ctx.set('Location', `${ctx.URL}/${user.id}`)

    const token = generateToken(user)
    ctx.body = { token }
  },

  async update(ctx) {
    // const { body }
    // const { body } = ctx.request
    // let { user = {} } = body
    // const opts = { abortEarly: false, context: { validatePassword: true } }
    // user = await ctx.app.schemas.user.validate(user, opts)
    // const userId = ctx.state.user.id
    // const existingUser = await User.getById(userId)
    // await existingUser.updateProfile(user)
    // ctx.status = 200
    // ctx.body = {
    //   id: existingUser.id,
    //   name: existingUser.name,
    //   email: existingUser.email
    // }
  },

  /**
   * Logs in a user by checking if the given email and password matches,
   * then return a token if email and password match
   */
  async login(ctx) {
    const { body } = ctx.request

    const { email, password } = await loginSchema.validate(body, {
      abortEarly: false
    })

    const user = await User.findByEmail(email)

    if (!user || !(await user.passwordMatches(password))) {
      throw new UnauthorizedError('Email or password is invalid')
    }

    ctx.body = { token: generateToken(user) }
  }
}
