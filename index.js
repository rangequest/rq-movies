const express = require('express')
const app = express()
const logger = require('./logger')

require('./startup/logging')()
require('./startup/routes')(app)
require('./startup/db')()
require('./startup/config')()
require('./startup/validation')()
require('./startup/prod')(app)

//For testing purposes...
//throw new Error("Uncaught exception");
//const p = Promise.reject(new Error("Unhandled Promise Rejection"));

// For testing logger
// const error = new Error('Ooops')
// logger.error('An error occurred:', error)

const port = process.env.PORT || 3000
const server = app.listen(port, () =>
  logger.log({ level: 'debug', message: `Server is listening on port ${port}...` })
)
module.exports = server
