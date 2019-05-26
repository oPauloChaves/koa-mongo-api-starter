require('should')
const app = require('../src/app')
const request = require('supertest').agent(app.callback())

describe('Basic routes', () => {
  it('should get HOME', async () => {
    const res = await request.get('/')
    res.status.should.be.eql(200)
    res.text.should.be.eql('OK')
  })
})
