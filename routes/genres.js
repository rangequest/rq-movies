const express = require("express");
const router = express.Router();
const Joi = require("joi");

let genres = [
  { id: 1, name: "Action" },
  { id: 2, name: "Horror" },
  { id: 3, name: "Romance" },
];

router.get("/", (req, res) => {
  return res.send(genres);
});

router.post("/", (req, res) => {
  const { error } = validateGenre(req.body);
  if (error) return res.status(400).send(error.details);

  const genre = {
    id: genres.length + 1,
    name: req.body.name,
  };

  genres.push(genre);
  return res.send(genre);
});

router.put("/:id", (req, res) => {
  const genre = genres.find((genre) => genre.id === parseInt(req.params.id));
  if (!genre)
    return res.status(400).send("The requested genre to PUT not found");

  const { error } = validateGenre(req.body);
  if (error) return res.status(400).send(error.details);

  genre.name = req.body.name;
  return res.send(genre);
});

router.delete("/:id", (req, res) => {
  const genre = genres.find((genre) => genre.id === parseInt(req.params.id));
  if (!genre)
    return res.status(400).send("The requested genre to DELETE not found");

  let index = genres.indexOf(genre);
  genres.splice(index, 1);

  return res.send(genre);
});

const validateGenre = (genre) => {
  const schema = Joi.object({
    name: Joi.string().min(3).required(),
  });

  return schema.validate(genre);
};

module.exports = router;
