const express = require("express");
const app = express();
require("dotenv").config();
require("./src/config/db");
app.use(express.json());

const authRoute = require("./src/routes/authRoute");
app.use("/auth", authRoute);

app.get("/", (req, res) => {
  res.send("Api is running");
});

app.listen(process.env.PORT, () => {
  console.log("Server is running!");
});
