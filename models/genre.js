const Joi = require("joi");
const mongoose = require("mongoose");

const Genre = mongoose.model(
  "Genre",
  mongoose.Schema({
    name: { type: String, required: true, minlength: 5, maxlength: 50 },
  })
);

const validateGenre = (genre) => {
  const schema = Joi.object({
    name: Joi.string().min(3).required(),
  });

  return schema.validate(genre);
};

exports.Genre = Genre;
exports.validate = validateGenre;
