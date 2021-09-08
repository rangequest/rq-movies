const express = require("express");
const router = express.Router();
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

router.get("/", async (req, res) => {
  const customers = await Customer.find().sort({ name: 1 });
  return res.send(customers);
});

router.post("/", async (req, res) => {
  const { error } = validateCustomer(req.body);
  if (error) return res.status(400).send(error.details);

  let customer = new Customer({
    name: req.body.name,
    isGold: req.body.isGold,
    phone: req.body.phone,
  });

  try {
    customer = await customer.save();
    return res.send(customer);
  } catch (err) {
    return res.send(err.errors);
  }
});

router.put("/:id", async (req, res) => {
  const { error } = validateCustomer(req.body);
  if (error) return res.status(400).send(error.details);

  try {
    const customer = await Customer.findByIdAndUpdate(
      req.params.id,
      { name: req.body.name, isGold: req.body.isGold, phone: req.body.phone },
      { new: true }
    );
    if (!customer)
      return res.status(404).send("The requested customer to update not found");

    return res.send(customer);
  } catch (err) {
    return res.send(err.errors);
  }
});

router.delete("/:id", async (req, res) => {
  const customer = await Customer.findByIdAndRemove(req.params.id);
  if (!customer)
    return res.status(404).send("The requested customer to delete not found");

  return res.send(customer);
});

router.get("/:id", async (req, res) => {
  const customer = await Customer.findById(req.params.id).sort({ name: 1 });
  if (!customer)
    return res.status(404).send("The requested customer not found");

  return res.send(customer);
});

const validateCustomer = (customer) => {
  const schema = Joi.object({
    name: Joi.string().min(5).max(50).required(),
    isGold: Joi.bool(),
    phone: Joi.string().min(5).max(50).required(),
  });
  return schema.validate(customer);
};

module.exports = router;
