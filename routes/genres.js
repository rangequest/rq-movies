const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const { Genre, validate } = require('../models/genre')
const auth = require('../middleware/auth')
const admin = require('../middleware/admin')
const validateObjectId = require('../middleware/validateObjectId')

router.get('/', async (req, res) => {
  const genres = await Genre.find().sort({ name: 1 })
  return res.send(genres)
})

router.post('/', auth, async (req, res) => {
  const { error } = validate(req.body)
  if (error) return res.status(400).send(error.details)

  const genre = new Genre({
    name: req.body.name,
  })

  await genre.save()
  return res.send(genre)
})

router.put('/:id', async (req, res) => {
  const { error } = validate(req.body)
  if (error) return res.status(400).send(error.details)

  const genre = await Genre.findByIdAndUpdate(req.params.id, { name: req.body.name }, { new: true })

  if (!genre) return res.status(404).send('The requested genre to update not found')

  return res.send(genre)
})

router.delete('/:id', [auth, admin], async (req, res) => {
  const genre = await Genre.findByIdAndRemove(req.params.id)
  if (!genre) return res.status(404).send('The requested genre to delete not found')
  return res.send(genre)
})

router.get('/:id', validateObjectId, async (req, res) => {
  const genre = await Genre.findById(req.params.id).sort({ name: 1 })
  if (!genre) return res.status(404).send('The requested genre not found')

  return res.send(genre)
})

module.exports = router
