const request = require('supertest')
const { Genre } = require('../../models/genre')
const { User } = require('../../models/user')
const mongoose = require('mongoose')
let server

describe('/api/genres', () => {
  beforeEach(() => {
    server = require('../../index')
  })
  afterEach(async () => {
    await server.close()
    await Genre.deleteMany({})
  })

  describe('GET /', () => {
    it('should return all genres', async () => {
      await Genre.collection.insertMany([
        { name: 'genre1' },
        { name: 'genre2' },
        { name: 'genre3' },
      ])
      const res = await request(server).get('/api/genres')
      expect(res.status).toBe(200)
      expect(res.body.length).toBe(3)
      expect(res.body[0].name).toBe('genre1')
      expect(res.body.some(g => g.name === 'genre1')).toBeTruthy()
      expect(res.body.some(g => g.name === 'genre2')).toBeTruthy()
    })
  })
  describe('GET /:id', () => {
    it('should return genre when called with id', async () => {
      const genre = new Genre({ name: 'genre1' })
      //   const doc = await Genre.collection.insertOne(genre)
      await genre.save()
      const res = await request(server).get('/api/genres/' + genre._id)
      expect(res.status).toBe(200)
      expect(res.body.name).toBe('genre1')
    })

    it('should return 404 when called with invalid id', async () => {
      const res = await request(server).get('/api/genres/1')
      expect(res.status).toBe(404)
    })

    it('should return 404 if no genre with give id exists', async () => {
      const id = mongoose.Types.ObjectId()
      const res = await request(server).get('/api/genres/' + id)
      expect(res.status).toBe(404)
    })
  })

  describe('POST /', () => {
    let token
    let name

    const exec = async () => {
      return await request(server).post('/api/genres').set('x-auth-token', token).send({ name })
    }

    beforeEach(() => {
      token = new User().generateAuthToken()
      name = 'genre1'
    })

    it('should return 401 if the client is not logged in', async () => {
      token = ''
      const res = await exec()
      expect(res.status).toBe(401)
    })

    it('should return 400 if the the genre is less than 5 charactors', async () => {
      name = 'a'
      const res = await exec()
      expect(res.status).toBe(400)
    })

    it('should return 400 if the the genre is more than 50 charactors', async () => {
      name = new Array(10).join('aaaaaa')
      const res = await exec()
      expect(res.status).toBe(400)
    })

    it('should return 400 if the the genre name is not present', async () => {
      name = null
      const res = await exec()
      expect(res.status).toBe(400)
    })

    it('should save the genre', async () => {
      await exec()
      const saved = Genre.find({ name: 'query1' })
      expect(saved).not.toBeNull()
    })

    it('should return the saved genre', async () => {
      const res = await exec()
      expect(res.status).toBe(200)
      expect(res.body.name).toBe('genre1')
      expect(res.body).toHaveProperty('name', 'genre1')
    })
  })

  describe('PUT /:id', () => {
    let token
    let name
    let id

    const exec = async () => {
      return await request(server)
        .put('/api/genres/' + id)
        .set('x-auth-token', token)
        .send({ name })
    }

    beforeEach(() => {
      token = new User().generateAuthToken()
      name = 'genre1'
      id = mongoose.Types.ObjectId()
    })

    it('should return 401 if the client is not logged in', async () => {
      token = ''
      const res = await exec()
      expect(res.status).toBe(401)
    })

    it('should return 400 if the the genre is less than 5 charactors', async () => {
      name = 'a'
      const res = await exec()
      expect(res.status).toBe(400)
    })

    it('should return 400 if the the genre is more than 50 charactors', async () => {
      name = new Array(52).join('a')
      const res = await exec()
      expect(res.status).toBe(400)
    })

    it('should return 400 if the the genre name is not present', async () => {
      name = null
      const res = await exec()
      expect(res.status).toBe(400)
    })

    it('should return 404 if the genre not found', async () => {
      const res = await exec()
      expect(res.status).toBe(404)
    })

    it('should update the genre', async () => {
      const genre = new Genre({ _id: id, name: 'Thriller' })
      genre.save()

      id = genre.id
      name = 'SciFi'

      await exec()

      const updated = await Genre.findById(id)

      expect(updated.name).toBe('SciFi')
    })

    it('should return 200 after updating the genre', async () => {
      const genre = new Genre({ _id: id, name: 'Thriller' })
      genre.save()

      id = genre.id
      const res = await exec()

      expect(res.status).toBe(200)
    })
  })

  describe('DELETE /:id', () => {
    it('should delete genre when called with id', async () => {
      token = new User({ isAdmin: true }).generateAuthToken()
      const genre = new Genre({ name: 'genre1' })
      await genre.save()

      const res = await request(server)
        .delete('/api/genres/' + genre._id)
        .set('x-auth-token', token)

      expect(res.status).toBe(200)
    })

    it('should return 404 if genre to be deleted not found', async () => {
      token = new User({ isAdmin: true }).generateAuthToken()
      id = new mongoose.Types.ObjectId()
      const res = await request(server)
        .delete('/api/genres/' + id)
        .set('x-auth-token', token)

      expect(res.status).toBe(404)
    })
  })
})
