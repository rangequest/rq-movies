const mongoose = require('mongoose')
const request = require('supertest')
const { Rental } = require('../../models/rental')
const { Movie } = require('../../models/movie')
const { User } = require('../../models/user')
const moment = require('moment')

describe('/api/returns', () => {
  let server
  let customerId
  let movieId
  let token
  let movie

  beforeEach(async () => {
    server = require('../../index')

    customerId = mongoose.Types.ObjectId()
    movieId = mongoose.Types.ObjectId()
    token = new User().generateAuthToken()

    movie = new Movie({
      _id: movieId,
      title: '12345',
      dailyRentalRate: 2,
      genre: { name: 'genrenew' },
      numberInStock: 10,
    })

    await movie.save()

    rental = new Rental({
      customer: {
        _id: customerId,
        name: '12345',
        phone: '12345',
      },
      movie: {
        _id: movieId,
        title: '12345',
        dailyRentalRate: 2,
      },
    })
    await rental.save()
  })

  const exec = () => {
    return request(server)
      .post('/api/returns')
      .set('x-auth-token', token)
      .send({ customerId, movieId })
  }

  afterEach(async () => {
    await server.close()
    await Rental.deleteMany({})
    await Movie.deleteMany({})
  })

  it('should return 401 if not authenticated', async () => {
    token = ''
    const res = await exec()
    expect(res.status).toBe(401)
  })

  it('should return 400 if customerId is not present', async () => {
    customerId = ''
    const res = await exec()
    expect(res.status).toBe(400)
  })

  it('should return 400 if movieId is not present', async () => {
    movieId = ''
    const res = await exec()
    expect(res.status).toBe(400)
  })

  it('should return 404 if no rental found for the combination provided', async () => {
    await Rental.deleteMany({})
    const res = await exec()
    expect(res.status).toBe(404)
  })

  it('should return 400 if no rental already processed', async () => {
    rental.dateReturned = new Date()
    await rental.save()
    const res = await exec()
    expect(res.status).toBe(400)
  })

  it('should return 200 if valid request', async () => {
    const res = await exec()
    expect(res.status).toBe(200)
  })

  it('should set the return date', async () => {
    const res = await exec()

    const rentalInDb = await Rental.findById(rental._id)
    const diff = new Date() - rentalInDb.dateReturned

    expect(diff).toBeLessThan(10 * 1000)
  })

  it('should calculate the rental fee', async () => {
    rental.dateOut = moment().add(-7, 'days').toDate()
    await rental.save()

    const res = await exec()

    const rentalInDb = await Rental.findById(rental._id)
    expect(rentalInDb.rentalFee).toBe(14)
  })

  it('should increase the movie stock', async () => {
    const res = await exec()

    const movieInDb = await Movie.findById(movieId)
    expect(movieInDb.numberInStock).toBe(11)
  })

  it('should return the rental', async () => {
    const rentalInDb = await Rental.findById(rental._id)
    const res = await exec()
    expect(res.body).toHaveProperty('dateOut')
    expect(res.body).toHaveProperty('dateReturned')
    expect(res.body).toHaveProperty('rentalFee')
    expect(res.body).toHaveProperty('customer')
    expect(res.body).toHaveProperty('movie')

    expect(Object.keys(res.body)).toEqual(
      expect.arrayContaining(['dateOut', 'dateReturned', 'rentalFee', 'customer', 'movie'])
    )
  })
})
