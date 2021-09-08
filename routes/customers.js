const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const { Customer, validate } = require("../models/customer");

router.get("/", async (req, res) => {
  const customers = await Customer.find().sort({ name: 1 });
  return res.send(customers);
});

router.post("/", async (req, res) => {
  const { error } = validate(req.body);
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
  const { error } = validate(req.body);
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

module.exports = router;
