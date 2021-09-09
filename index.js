const express = require("express");
const app = express();
const logger = require("./logger");

require("./startup/logging")();
require("./startup/routes")(app);
require("./startup/db")();
require("./startup/config")();
require("./startup/validation")();

//For testing purposes...
//throw new Error("Uncaught exception");
//const p = Promise.reject(new Error("Unhandled Promise Rejection"));

const port = process.env.PORT || 3000;
app.listen(port, () => logger.log({ level: "debug", message: `Server is listening on port ${port}...` }));
