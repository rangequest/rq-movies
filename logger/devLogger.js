const { createLogger, format, transports } = require('winston')
const { combine, printf, colorize } = format
require('winston-mongodb')
const config = require('config')

const logFormat = printf(({ level, message, label, timestamp, stack }) => {
  return `${timestamp} [${label}] ${level}: ${message} ${stack}`
})

/***********************

const levels = { 
  error:    0,
  warn:     1,
  info:     2,
  http:     3,
  verbose:  4,
  debug:    5,
  silly:    6
}; 

*************************/

const devLogger = createLogger({
  level: 'silly',
  format: combine(
    format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    format.label({ label: config.get('label') }),
    format.errors({ stack: true }),
    logFormat
    //format.json()
  ),
  transports: [
    new transports.File({ filename: 'error.log', level: 'error' }),
    new transports.File({ filename: 'combined.log', level: 'silly' }),
    new transports.Console({ format: combine(colorize({ all: true })) }),
    new transports.MongoDB({
      level: 'error',
      collection: 'logs',
      options: { useUnifiedTopology: true },
      db: 'mongodb://127.0.0.1:27017/rq-movies',
    }),
  ],
  exceptionHandlers: [
    new transports.File({ filename: 'exceptions.log' }),
    new transports.Console({ format: combine(colorize({ all: true })) }),
    new transports.MongoDB({
      collection: 'logs',
      options: { useUnifiedTopology: true },
      db: 'mongodb://127.0.0.1:27017/rq-movies',
    }),
  ],
})

module.exports = devLogger
