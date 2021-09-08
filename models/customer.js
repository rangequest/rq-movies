const Joi = require("joi");
const mongoose = require("mongoose");

const Customer = mongoose.model(
  "Customer",
  mongoose.Schema({
    name: { type: String, required: true, minlength: 5, maxlength: 50 },
    isGold: { type: Boolean, required: true, default: false },
    phone: { type: String, required: true, minlength: 5, maxlength: 50 },
  })
);

const validateCustomer = (customer) => {
  const schema = Joi.object({
    name: Joi.string().min(5).max(50).required(),
    isGold: Joi.bool(),
    phone: Joi.string().min(5).max(50).required(),
  });
  return schema.validate(customer);
};

exports.Customer = Customer;
exports.validate = validateCustomer;
