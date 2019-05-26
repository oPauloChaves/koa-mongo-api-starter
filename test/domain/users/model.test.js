require('should')
require('../../test_helper')
const User = require('../../../src/domain/users/model')

describe('Users', () => {
  it('should create a user', async () => {
    const user = await new User({
      name: 'test',
      email: 'test@test.tt',
      password: 'test'
    }).save()

    user.isNew.should.be.eql(false)
  })

  it('should not allow duplicate email', async () => {
    try {
      await new User({
        name: 'test',
        email: 'test@test.tt',
        password: 'test'
      }).save()
    } catch (err) {
      err.name.should.be.eql('DuplicateKeyError')
    }
  })
})
