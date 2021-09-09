const Joi = require("joi");
Joi.objectId = require("joi-objectid")(Joi);
const express = require("express");
const app = express();
const movies = require("./routes/movies");
const genres = require("./routes/genres");
const customers = require("./routes/customers");
const rentals = require("./routes/rentals");
const users = require("./routes/users");
const auth = require("./routes/auth");
const mongoose = require("mongoose");
const config = require("config");

if (!config.get("jwtPrivateKey")) {
  console.log("FATAL ERROR: jwtPrivateKey is not defined");
  process.exit(1);
}

mongoose
  .connect("mongodb://127.0.0.1:27017/rq-movies")
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("Could not connect to MongoDB"));

app.use(express.json());

app.use("/api/movies/", movies);
app.use("/api/genres/", genres);
app.use("/api/customers/", customers);
app.use("/api/rentals/", rentals);
app.use("/api/users/", users);
app.use("/api/auth/", auth);

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Server is listening on port ${port}...`));
