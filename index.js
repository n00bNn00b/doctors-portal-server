const express = require("express");
const cors = require("cors");
const app = express();
const port = process.env.PORT || 5000;

/**
 * Server root api
 */

app.get("/", (req, res) => {
  res.send("Doctor's Portal Server is running!");
});

app.listen(port, () => {
  console.log("Listening to the port: ", port);
});
