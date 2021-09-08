const express = require("express");
const router = express.Router();
const Joi = require("joi");
const mongoose = require("mongoose");

const Genre = mongoose.model(
  "Genre",
  mongoose.Schema({
    name: { type: String, required: true, minlength: 5, maxlength: 50 },
  })
);

router.get("/", async (req, res) => {
  const genres = await Genre.find().sort({ name: 1 });
  return res.send(genres);
});

router.post("/", async (req, res) => {
  const { error } = validateGenre(req.body);
  if (error) return res.status(400).send(error.details);

  let genre = new Genre({
    name: req.body.name,
  });

  genre = await genre.save();
  return res.send(genre);
});

router.put("/:id", async (req, res) => {
  const { error } = validateGenre(req.body);
  if (error) return res.status(400).send(error.details);

  const genre = await Genre.findByIdAndUpdate(
    req.params.id,
    { name: req.body.name },
    { new: true }
  );

  if (!genre)
    return res.status(404).send("The requested genre to update not found");

  return res.send(genre);
});

router.delete("/:id", async (req, res) => {
  const genre = await Genre.findByIdAndRemove(req.params.id);
  if (!genre)
    return res.status(404).send("The requested genre to delete not found");

  return res.send(genre);
});

router.get("/:id", async (req, res) => {
  const genre = await Genre.findById(req.params.id).sort({ name: 1 });
  if (!genre) return res.status(404).send("The requested genre not found");

  return res.send(genre);
});

const validateGenre = (genre) => {
  const schema = Joi.object({
    name: Joi.string().min(3).required(),
  });

  return schema.validate(genre);
};

module.exports = router;
