const Joi = require('joi')
Joi.objectId = require('joi-objectid')(Joi)

function validateRental(rental) {
  const schema = Joi.object({
    customerId: Joi.objectId().required(),
    movieId: Joi.objectId().required(),
  })

  return schema.validate(rental)
}

exports.validate = validateRental
