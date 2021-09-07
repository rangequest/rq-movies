const express = require("express");
const app = express();
const movies = require("./routes/movies");
const genres = require("./routes/genres");

app.use(express.json());

app.use("/api/movies/", movies);
app.use("/api/genres/", genres);

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Server is listening on port ${port}...`));
