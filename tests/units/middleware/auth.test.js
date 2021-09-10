const auth = require('../../../middleware/auth')
const { User } = require('../../../models/user')
const jwt = require('jsonwebtoken')
const config = require('config')

describe('auth middleware', () => {
  it('should set user property on request after verification', () => {
    const token = new User().generateAuthToken()
    const req = {
      header: jest.fn().mockReturnValue(token),
    }
    const res = {}
    const next = jest.fn()

    auth(req, res, next)
    expect(next).toHaveBeenCalled()
    expect(req.user).toBeDefined()

    const decoded = jwt.verify(token, config.get('jwtPrivateKey'))
    expect(req.user).toEqual(decoded)
  })
})
