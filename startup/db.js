const mongoose = require('mongoose')
const logger = require('../logger')
const config = require('config')

module.exports = function () {
  const db = config.get('db')
  mongoose.connect(db).then(() => {
    logger.log({ level: 'info', message: `Connected to ${db}...` })
  })
}
