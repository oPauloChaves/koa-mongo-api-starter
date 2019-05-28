require('should')
require('../../test_helper')
const app = require('../../../src/app')
const request = require('supertest').agent(app.callback())
const User = require('../../../src/domain/users/model')

describe('User.routes', () => {
  let data = { name: 'user', email: 'user@test.js', password: '12345678' }

  describe('POST users/', () => {
    it('create a user', async () => {
      const res = await request.post('/api/users').send(data)

      res.status.should.be.eql(201)
      res.body.should.have.property('token')
    })

    it('do not create if email is duplicate', async () => {
      const res = await request.post('/api/users').send(data)

      res.status.should.be.eql(422)
    })

    it('do not create if email is invalid', async () => {
      let withInvalidEmail = { ...data, email: 'invalid@' }
      const res = await request.post('/api/users').send(withInvalidEmail)

      res.status.should.be.eql(422)
    })

    it('do not create if required field is missing', async () => {
      let withoutPass = { email: 'user@email.js', name: 'user' }
      let withoutEmailAndPass = { name: 'user' }

      const [res1, res2] = await Promise.all([
        request.post('/api/users').send(withoutPass),
        request.post('/api/users').send(withoutEmailAndPass)
      ])

      res1.status.should.be.eql(422)
      res1.body.should.have.propertyByPath('error', 'password')

      res2.status.should.be.eql(422)
      res2.body.should.have.propertyByPath('error', 'email')
      res2.body.should.have.propertyByPath('error', 'password')
    })

    it('do not create if password length is not between 8 and 30', async () => {
      let belowMin = {
        email: 'user0@email.js',
        name: 'user',
        password: '1234567'
      }
      let aboveMax = {
        email: 'user00@email.js',
        name: 'user',
        password: '0123456789012345678901234567890'
      }

      const [res1, res2] = await Promise.all([
        request.post('/api/users').send(belowMin),
        request.post('/api/users').send(aboveMax)
      ])

      res1.status.should.be.eql(422)
      res2.status.should.be.eql(422)
    })
  })

  describe('GET users/', () => {
    before(async () => {
      await User.deleteMany({}).exec()
    })

    describe('when authenticated', () => {
      it('return a list of users', async () => {
        let data1 = {
          name: 'user1',
          email: 'user1@test.js',
          password: '12345678'
        }
        let data2 = {
          name: 'user2',
          email: 'user2@test.js',
          password: '12345678'
        }

        const [user1] = await Promise.all([
          request.post('/api/users').send(data1),
          request.post('/api/users').send(data2)
        ])

        const token = user1.body.token
        const res = await request
          .get('/api/users')
          .set('Authorization', `Bearer ${token}`)

        res.status.should.be.eql(200)
        res.body.should.have.size(2)
      })
    })

    describe('when not authenticated', () => {
      it('returns 401', async () => {
        let data = {
          name: 'user1',
          email: 'user1@test.js',
          password: '12345678'
        }

        await request.post('/api/users').send(data)

        const res = await request
          .get('/api/users')
          .set('Authorization', `Bearer invalidTok3n`)

        res.status.should.be.eql(401)
      })
    })
  })
})
