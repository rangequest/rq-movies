const request = require('supertest')
const { User } = require('../../models/user')
const { Genre } = require('../../models/genre')

describe('auth middleware', () => {
  beforeEach(() => {
    server = require('../../index')
  })

  afterEach(async () => {
    server.close()
  })

  let token

  const exec = () => {
    return request(server).post('/api/genres').set('x-auth-token', token).send({ name: 'genre1' })
  }

  it('should send 401 if no token is provided', async () => {
    token = ''
    const res = await exec()
    expect(res.status).toBe(401)
  })

  it('should send 400 if token is not valid', async () => {
    token = '1'
    const res = await exec()
    expect(res.status).toBe(400)
  })

  it('should send 200 if token is valid', async () => {
    token = new User().generateAuthToken()

    const res = await exec()
    expect(res.status).toBe(200)
    await Genre.deleteMany({})
  })
})
