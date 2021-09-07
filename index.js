const express = require("express");
const app = express();
const movies = require("./routes/movies");

app.use(express.json());

app.use("/api/movies/", movies);

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Server is listening on port ${port}...`));
