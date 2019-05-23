const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
const { DuplicateKeyError } = require('../../lib/errors')

const Schema = mongoose.Schema

const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true
    },
    email: {
      type: String,
      required: true,
      unique: true
    },
    password: {
      type: String,
      required: true
    },
    password_reset_expires: {
      type: Schema.Types.Date
    },
    password_reset_token: {
      type: String
    }
  },
  { timestamps: true }
)

UserSchema.pre('save', async function(next) {
  const user = this
  if (!user.isModified('password')) {
    return next()
  }
  user.password = await bcrypt.hash(user.password, 10)
  next()
})

UserSchema.post('save', function postSave(error, doc, next) {
  if (error.name === 'MongoError' && error.code === 11000) {
    next(new DuplicateKeyError(`email has already been taken.`))
  } else {
    next(error)
  }
})

UserSchema.methods = {
  async passwordMatches(rawPassword) {
    return bcrypt.compare(rawPassword, this.password)
  },

  async updateProfile({ name }) {
    this.name = name
    return this.save()
  }
}

UserSchema.statics = {
  async getById(id) {
    const user = await this.findById(id).exec()

    if (user) return user

    let error = new Error('No such user exists!')
    error.status = 404
    return Promise.reject(error)
  },

  async findByEmail(email) {
    return this.findOne({ email }).exec()
  },

  async list({ skip = 0, limit = 20 } = {}) {
    return this.find({}, { id: 1, name: 1, email: 1 })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .exec()
  }
}

module.exports = mongoose.model('User', UserSchema)
