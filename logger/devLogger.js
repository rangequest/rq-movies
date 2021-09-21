const { createLogger, format, transports } = require('winston')
const { combine, printf, colorize } = format
require('winston-mongodb')
const config = require('config')

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
    format.splat(),
    format.errors({ stack: true }),
    printf(({ level, message, label, timestamp, stack }) => {
      if (stack) {
        return `${timestamp} [${label}] ${level}: ${message}\n${stack}`
      }
      return `${timestamp} [${label}] ${level}: ${message}`
    })
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
      db: config.get('db'),
    }),
  ],
  exceptionHandlers: [
    new transports.File({ filename: 'exceptions.log' }),
    new transports.Console({ format: combine(colorize({ all: true })) }),
    new transports.MongoDB({
      collection: 'logs',
      options: { useUnifiedTopology: true },
      db: config.get('db'),
    }),
  ],
})

module.exports = devLogger
