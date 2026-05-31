const express = require("express");
const app = express();
require("dotenv").config();
require("../backend/src/config/db");
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Api is running");
});

app.listen(process.env.PORT, () => {
  console.log("Server is running!");
});
