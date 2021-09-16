const express = require('express')
const app = express()
const config = require('config')
const logger = require('./logger')

require('./startup/logging')()
require('./startup/routes')(app)
require('./startup/db')()
require('./startup/config')()
require('./startup/validation')()
require('./startup/prod')(app)

const port = process.env.PORT || config.get('port')
const server = app.listen(port, () =>
  logger.log({ level: 'debug', message: `Server is listening on port ${port}...` })
)

module.exports = server
