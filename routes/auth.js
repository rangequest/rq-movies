const { User } = require("../models/user");
const mongoose = require("mongoose");
const express = require("express");
const Joi = require("joi");
const router = express.Router();
const _ = require("lodash");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const config = require("config");

router.post("/", async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  let user = await User.findOne({ email: req.body.email });
  if (!user) return res.status(400).send("Invalid email or password");

  const validPassword = await bcrypt.compare(req.body.password, user.password);
  if (!validPassword) res.status(400).send("Invalid email or password");

  res.send(user.generateAuthToken());
});

function validate(req) {
  const schema = Joi.object({
    password: Joi.string().min(5).max(255).required(),
    email: Joi.string().min(5).max(255).email(),
  });

  return schema.validate(req);
}

module.exports = router;
