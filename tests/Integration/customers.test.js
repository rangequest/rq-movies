const request = require('supertest')
const { Customer } = require('../../models/customer')
const { User } = require('../../models/user')
const mongoose = require('mongoose')
let server

describe('/api/customers', () => {
  beforeEach(() => {
    server = require('../../index')
  })
  afterEach(async () => {
    await server.close()
    await Customer.deleteMany({})
  })

  describe('GET /', () => {
    it('should return all customers', async () => {
      await Customer.collection.insertMany([
        { name: 'customer1', phone: '123456' },
        { name: 'customer2', phone: '123456' },
        { name: 'customer3', phone: '123456' },
      ])
      const res = await request(server).get('/api/customers')
      expect(res.status).toBe(200)
      expect(res.body.length).toBe(3)
      expect(res.body[0].name).toBe('customer1')
      expect(res.body.some(g => g.name === 'customer1')).toBeTruthy()
      expect(res.body.some(g => g.name === 'customer2')).toBeTruthy()
    })
  })
  describe('GET /:id', () => {
    it('should return customer when called with id', async () => {
      const customer = new Customer({ name: 'customer1', phone: '123456' })
      //   const doc = await Customer.collection.insertOne(customer)
      await customer.save()
      const res = await request(server).get('/api/customers/' + customer._id)
      expect(res.status).toBe(200)
      expect(res.body.name).toBe('customer1')
    })

    it('should return 404 when called with invalid id', async () => {
      const id = new mongoose.Types.ObjectId()
      const res = await request(server).get('/api/customers/' + id)
      expect(res.status).toBe(404)
    })

    it('should return 404 if no customer with give id exists', async () => {
      const id = mongoose.Types.ObjectId()
      const res = await request(server).get('/api/customers/' + id)
      expect(res.status).toBe(404)
    })
  })

  describe('POST /', () => {
    let token
    let name

    const exec = async () => {
      return await request(server)
        .post('/api/customers')
        .set('x-auth-token', token)
        .send({ name, phone: '123456' })
    }

    beforeEach(() => {
      token = new User().generateAuthToken()
      name = 'customer1'
    })

    it('should return 401 if the client is not logged in', async () => {
      token = ''
      const res = await exec()
      expect(res.status).toBe(401)
    })

    it('should return 400 if the the customer is less than 5 charactors', async () => {
      name = 'a'
      const res = await exec()
      expect(res.status).toBe(400)
    })

    it('should return 400 if the the customer is more than 50 charactors', async () => {
      name = new Array(10).join('aaaaaa')
      const res = await exec()
      expect(res.status).toBe(400)
    })

    it('should return 400 if the the customer name is not present', async () => {
      name = null
      const res = await exec()
      expect(res.status).toBe(400)
    })

    it('should save the customer', async () => {
      await exec()
      const saved = Customer.find({ name: 'query1' })
      expect(saved).not.toBeNull()
    })

    it('should return the saved customer', async () => {
      const res = await exec()
      expect(res.status).toBe(200)
      expect(res.body.name).toBe('customer1')
      expect(res.body).toHaveProperty('name', 'customer1')
    })
  })

  describe('PUT /:id', () => {
    let token
    let name
    let id

    const exec = async () => {
      return await request(server)
        .put('/api/customers/' + id)
        .set('x-auth-token', token)
        .send({ name, phone: '123456' })
    }

    beforeEach(() => {
      token = new User().generateAuthToken()
      name = 'customer1'
      id = mongoose.Types.ObjectId()
    })

    it('should return 401 if the client is not logged in', async () => {
      token = ''
      const res = await exec()
      expect(res.status).toBe(401)
    })

    it('should return 400 if the the customer is less than 5 charactors', async () => {
      name = 'a'
      const res = await exec()
      expect(res.status).toBe(400)
    })

    it('should return 400 if the the customer is more than 50 charactors', async () => {
      name = new Array(52).join('a')
      const res = await exec()
      expect(res.status).toBe(400)
    })

    it('should return 400 if the the customer name is not present', async () => {
      name = null
      const res = await exec()
      expect(res.status).toBe(400)
    })

    it('should return 404 if the customer not found', async () => {
      const res = await exec()
      expect(res.status).toBe(404)
    })

    it('should update the customer', async () => {
      const customer = new Customer({ _id: id, name: 'Customer1', phone: '123456' })
      customer.save()

      id = customer.id
      name = 'SciFi'

      await exec()

      const updated = await Customer.findById(id)

      expect(updated.name).toBe('SciFi')
    })

    it('should return 200 after updating the customer', async () => {
      const customer = new Customer({ _id: id, name: 'Customer1', phone: '123456' })
      customer.save()

      id = customer.id
      const res = await exec()

      expect(res.status).toBe(200)
    })
  })

  describe('DELETE /:id', () => {
    it('should delete customer when called with id', async () => {
      token = new User({ isAdmin: true }).generateAuthToken()
      const customer = new Customer({ name: 'customer1', phone: '123456' })
      await customer.save()

      const res = await request(server)
        .delete('/api/customers/' + customer._id)
        .set('x-auth-token', token)

      expect(res.status).toBe(200)
    })

    it('should return 404 if customer to be deleted not found', async () => {
      token = new User({ isAdmin: true }).generateAuthToken()
      id = new mongoose.Types.ObjectId()
      const res = await request(server)
        .delete('/api/customers/' + id)
        .set('x-auth-token', token)

      expect(res.status).toBe(404)
    })
  })
})
