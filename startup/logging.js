require('express-async-errors')
module.exports = function () {
  process.on('unhandledRejection', ex => {
    throw ex
  })
}
