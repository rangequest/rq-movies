const mongoose = require('mongoose')
const logger = require('../logger')

module.exports = function () {
  mongoose.connect('mongodb://127.0.0.1:27017/rq-movies').then(() => {
    logger.log({
      level: 'info',
      message: 'Connected to MongoDB...',
    })
  })
}
